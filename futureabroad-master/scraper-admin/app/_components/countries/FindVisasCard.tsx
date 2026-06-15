"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe, Loader2, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import type { FoundVisa, JobStatus } from "@/lib/jobs";

interface JobState {
  status: JobStatus;
  visas?: FoundVisa[];
  frames?: string[];
  log?: string[];
  error?: string;
}

export function FindVisasCard({ countryId, countryName }: { countryId: number; countryName: string }) {
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<JobState | null>(null);
  const [loading, setLoading] = useState(false);
  const polling = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (polling.current) { clearInterval(polling.current); polling.current = null; }
  }, []);

  const startJob = async () => {
    setLoading(true);
    setJob(null);
    cleanup();

    try {
      const res = await fetch(`/api/scraper/${countryId}`, { method: "POST" });
      const data = await res.json();
      setJobId(data.jobId);
      setJob({ status: "running" });

      // Poll for job completion (status + visas + streaming log)
      polling.current = setInterval(async () => {
        const pollRes = await fetch(`/api/scraper/jobs/${data.jobId}`);
        const pollData: JobState = await pollRes.json();
        setJob(pollData);
        if (pollData.status === "done" || pollData.status === "error") {
          cleanup();
        }
      }, 2000);
    } catch {
      setJob({ status: "error", error: "Failed to start scraper job." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => cleanup, [cleanup]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Find Visas</CardTitle>
            <CardDescription>
              Use browser automation to discover visas available for {countryName}.
            </CardDescription>
          </div>
          {job?.status === "running" ? (
            <Badge variant="secondary" className="gap-1.5">
              <Loader2 className="h-3 w-3 animate-spin" />Searching&hellip;
            </Badge>
          ) : job?.status === "done" ? (
            <Badge className="gap-1.5 bg-green-600">
              <CheckCircle2 className="h-3 w-3" />{job.visas?.length ?? 0} found
            </Badge>
          ) : job?.status === "error" ? (
            <Badge variant="destructive" className="gap-1.5">
              <XCircle className="h-3 w-3" />Error
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={startJob} disabled={loading || job?.status === "running"} className="gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          {loading ? "Starting&hellip;" : job?.status === "running" ? "Running&hellip;" : "Find visas online"}
        </Button>

        {/* Live agent log */}
        {job && job.status === "running" && job.log && job.log.length > 0 && (
          <pre className="text-xs text-muted-foreground bg-muted rounded p-3 max-h-64 overflow-y-auto leading-relaxed">
            {job.log.join("\n")}
          </pre>
        )}

        {/* Results */}
        {job?.status === "done" && job.visas && job.visas.length > 0 && (
          <div className="border rounded-lg divide-y">
            {job.visas.map((visa, i) => (
              <div key={i} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <h4 className="font-medium text-sm truncate">{visa.name}</h4>
                  {visa.visa_type && (
                    <Badge variant="outline" className="text-xs shrink-0">{visa.visa_type}</Badge>
                  )}
                </div>
                {visa.official_link && (
                  <a href={visa.official_link} target="_blank" rel="noopener noreferrer" className="shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {job?.status === "done" && job.visas && job.visas.length === 0 && (
          <p className="text-sm text-muted-foreground">No visas found for {countryName}.</p>
        )}

        {job?.status === "error" && (
          <p className="text-sm text-destructive">{job.error ?? "An unknown error occurred."}</p>
        )}
      </CardContent>
    </Card>
  );
}
