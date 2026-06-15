import { spawn } from "child_process";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { createJob } from "@/lib/jobs";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ countryId: string }> }
) {
  const { countryId } = await params;
  const sb = createAdminClient();

  const { data: country, error } = await sb
    .from("countries")
    .select("name")
    .eq("id", countryId)
    .single();

  if (error || !country) {
    return NextResponse.json({ error: "Country not found" }, { status: 404 });
  }

  const job = createJob(parseInt(countryId, 10), country.name);
  job.status = "running";

  const scriptPath = path.join(process.cwd(), "scripts", "find_visas.py");

  const py = spawn("python", [scriptPath, country.name], {
    env: { ...process.env },
    cwd: process.cwd(),
  });

  let stdoutBuffer = "";
  py.stdout.on("data", (data: Buffer) => {
    stdoutBuffer += data.toString();
    const lines = stdoutBuffer.split("\n");
    stdoutBuffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line);
        if (parsed.type === "screenshot" && typeof parsed.data === "string") {
          job.frames.push(parsed.data);
          if (job.frames.length > 3000) job.frames = job.frames.slice(-3000);
        } else if (parsed.type === "result" && Array.isArray(parsed.data)) {
          job.visas = parsed.data;
          job.status = "done";
        }
      } catch {
        job.log.push(line);
        if (job.log.length > 200) job.log = job.log.slice(-200);
      }
    }
  });

  py.stderr.on("data", (data: Buffer) => {
    const lines = data.toString().split("\n").map((l) => l.trim()).filter(Boolean);
    job.log.push(...lines);
    if (job.log.length > 200) job.log = job.log.slice(-200);
  });

  py.on("close", (code: number | null) => {
    job.finishedAt = new Date().toISOString();
    if (job.status === "running") {
      if (code === 0) {
        job.status = "error";
        job.error = "Script finished but no visa data was found.";
      } else {
        job.status = "error";
        job.error = job.log.filter((l) => l.toLowerCase().startsWith("error")).at(-1)
          ?? `Script exited with code ${code}`;
      }
    }
  });

  py.on("error", (err: Error) => {
    job.status = "error";
    job.error = `Failed to start Python: ${err.message}. Make sure Python is installed and 'browser-use' dependencies are set up (see scripts/requirements.txt).`;
    job.finishedAt = new Date().toISOString();
  });

  return NextResponse.json({ jobId: job.id });
}
