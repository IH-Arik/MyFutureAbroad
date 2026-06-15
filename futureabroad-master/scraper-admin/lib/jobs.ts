import { randomUUID } from "crypto";

export type JobStatus = "pending" | "running" | "done" | "error";

export interface FoundVisa {
  name: string;
  visa_type?: string | null;
  official_link?: string | null;
}

/** Full visa details — will be populated in a second pass (step 2). */
export interface VisaDetails {
  name: string;
  visa_type?: string;
  description?: string;
  processing_time_days?: number | null;
  validity_months?: number | null;
  application_fee_usd?: number | null;
  application_fee_currency?: string;
  renewable?: boolean;
  has_path_to_residency?: boolean;
  path_to_residency_description?: string | null;
  official_link?: string | null;
  required_documents?: string[];
  benefits?: string[];
  min_income?: number | null;
  min_income_currency?: string | null;
  requires_health_insurance?: boolean;
  requires_clean_criminal_record?: boolean;
}

export interface Job {
  id: string;
  countryId: number;
  countryName: string;
  status: JobStatus;
  visas?: FoundVisa[];
  /** Base64 PNG screenshots streamed from the browser, in order. */
  frames: string[];
  log: string[];
  error?: string;
  startedAt: string;
  finishedAt?: string;
}

// Stored on globalThis so the Map survives Next.js HMR reloads in dev.
const g = globalThis as { __jobsMap?: Map<string, Job> };
if (!g.__jobsMap) g.__jobsMap = new Map();
const jobs = g.__jobsMap;

export function createJob(countryId: number, countryName: string): Job {
  const job: Job = {
    id: randomUUID(),
    countryId,
    countryName,
    status: "pending",
    frames: [],
    log: [],
    startedAt: new Date().toISOString(),
  };
  jobs.set(job.id, job);
  return job;
}

export function getJob(id: string): Job | undefined {
  return jobs.get(id);
}

export function getJobsForCountry(countryId: number): Job[] {
  return [...jobs.values()]
    .filter((j) => j.countryId === countryId)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}
