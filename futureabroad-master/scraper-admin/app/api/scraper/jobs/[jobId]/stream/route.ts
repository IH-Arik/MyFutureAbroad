import { NextRequest } from "next/server";
import { getJob } from "@/lib/jobs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  const stream = new ReadableStream({
    start(controller) {
      let sent = 0;
      let closed = false;

      function poll() {
        const job = getJob(jobId);
        if (!job) {
          enqueue("error", "Job not found");
          close();
          return;
        }

        while (sent < job.frames.length) {
          enqueue("frame", job.frames[sent]);
          sent++;
        }

        if (job.status === "done" || job.status === "error") {
          enqueue("status", job.status);
          close();
          return;
        }
      }

      function enqueue(event: string, data: string) {
        const msg = `event: ${event}\ndata: ${data}\n\n`;
        try {
          controller.enqueue(new TextEncoder().encode(msg));
        } catch {
          // stream already closed
        }
      }

      function close() {
        if (closed) return;
        closed = true;
        try { controller.close(); } catch { /* ignore */ }
      }

      // Poll on an interval
      const iv = setInterval(poll, 200);
      poll(); // immediate first tick

      // Cleanup on disconnect
      const cleanup = () => {
        clearInterval(iv);
        close();
      };
      _req.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
