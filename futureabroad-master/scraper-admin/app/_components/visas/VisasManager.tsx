"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { Country, Visa, VisaWithCountry } from "@/lib/types";

const VISA_TYPES = ["Digital Nomad", "Retirement", "Investment", "Skilled Worker", "Student", "Family", "Entrepreneur", "Other"];
const CURRENCIES = ["USD", "EUR", "GBP", "BRL", "AUD", "CAD", "CHF", "JPY", "SGD", "AED"];

type FormState = {
  name: string; visa_type: string; country_id: string; description: string;
  benefits: string; min_age: string; max_age: string;
  min_income: string; min_income_currency: string;
  min_savings: string; min_savings_currency: string;
  required_skills: string; eligible_nationalities: string; excluded_nationalities: string;
  requires_health_insurance: boolean; requires_clean_criminal_record: boolean;
  processing_time_days: string; validity_months: string;
  renewable: boolean; has_path_to_residency: boolean; path_to_residency_description: string;
  application_fee_usd: string; application_fee_amount: string; application_fee_currency: string;
  base_currency: string; required_documents: string; official_link: string; image_url: string;
};

const emptyForm = (): FormState => ({
  name: "", visa_type: "", country_id: "", description: "", benefits: "",
  min_age: "", max_age: "", min_income: "", min_income_currency: "USD",
  min_savings: "", min_savings_currency: "USD", required_skills: "",
  eligible_nationalities: "", excluded_nationalities: "",
  requires_health_insurance: false, requires_clean_criminal_record: false,
  processing_time_days: "", validity_months: "", renewable: false,
  has_path_to_residency: false, path_to_residency_description: "",
  application_fee_usd: "", application_fee_amount: "", application_fee_currency: "USD",
  base_currency: "USD", required_documents: "", official_link: "", image_url: "",
});

function visaToForm(v: Visa): FormState {
  const arr = (a?: string[]) => (a ?? []).join("\n");
  return {
    name: v.name ?? "", visa_type: v.visa_type ?? "", country_id: String(v.country_id),
    description: v.description ?? "", benefits: arr(v.benefits),
    min_age: v.min_age != null ? String(v.min_age) : "",
    max_age: v.max_age != null ? String(v.max_age) : "",
    min_income: v.min_income != null ? String(v.min_income) : "",
    min_income_currency: v.min_income_currency ?? "USD",
    min_savings: v.min_savings != null ? String(v.min_savings) : "",
    min_savings_currency: v.min_savings_currency ?? "USD",
    required_skills: arr(v.required_skills), eligible_nationalities: arr(v.eligible_nationalities),
    excluded_nationalities: arr(v.excluded_nationalities),
    requires_health_insurance: v.requires_health_insurance ?? false,
    requires_clean_criminal_record: v.requires_clean_criminal_record ?? false,
    processing_time_days: v.processing_time_days != null ? String(v.processing_time_days) : "",
    validity_months: v.validity_months != null ? String(v.validity_months) : "",
    renewable: v.renewable ?? false, has_path_to_residency: v.has_path_to_residency ?? false,
    path_to_residency_description: v.path_to_residency_description ?? "",
    application_fee_usd: v.application_fee_usd != null ? String(v.application_fee_usd) : "",
    application_fee_amount: v.application_fee_amount != null ? String(v.application_fee_amount) : "",
    application_fee_currency: v.application_fee_currency ?? "USD",
    base_currency: v.base_currency ?? "USD", required_documents: arr(v.required_documents),
    official_link: v.official_link ?? "", image_url: v.image_url ?? "",
  };
}

function formToPayload(f: FormState) {
  const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);
  const num = (s: string) => s !== "" ? parseFloat(s) : null;
  const int = (s: string) => s !== "" ? parseInt(s, 10) : null;
  return {
    name: f.name, visa_type: f.visa_type || null, country_id: parseInt(f.country_id, 10),
    description: f.description || null, benefits: lines(f.benefits),
    min_age: int(f.min_age), max_age: int(f.max_age),
    min_income: num(f.min_income), min_income_currency: f.min_income_currency || null,
    min_savings: num(f.min_savings), min_savings_currency: f.min_savings_currency || null,
    required_skills: lines(f.required_skills), eligible_nationalities: lines(f.eligible_nationalities),
    excluded_nationalities: lines(f.excluded_nationalities),
    requires_health_insurance: f.requires_health_insurance,
    requires_clean_criminal_record: f.requires_clean_criminal_record,
    processing_time_days: int(f.processing_time_days), validity_months: int(f.validity_months),
    renewable: f.renewable, has_path_to_residency: f.has_path_to_residency,
    path_to_residency_description: f.path_to_residency_description || null,
    application_fee_usd: num(f.application_fee_usd), application_fee_amount: num(f.application_fee_amount),
    application_fee_currency: f.application_fee_currency || null, base_currency: f.base_currency || "USD",
    required_documents: lines(f.required_documents), official_link: f.official_link || null, image_url: f.image_url || null,
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-wide text-primary pt-4 border-t border-border mt-2">{children}</p>;
}

export function VisasManager() {
  const [visas, setVisas] = useState<VisaWithCountry[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<VisaWithCountry | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");

  async function load() {
    setLoading(true);
    const [vRes, cRes] = await Promise.all([fetch("/api/visas"), fetch("/api/countries")]);
    if (vRes.ok) setVisas(await vRes.json());
    else setError("Failed to load visas.");
    if (cRes.ok) setCountries(await cRes.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setForm(emptyForm()); setFormError(""); setAdding(true); }
  function openEdit(v: VisaWithCountry) { setForm(visaToForm(v)); setFormError(""); setEditing(v); }
  function closeDialog() { setAdding(false); setEditing(null); }
  function set<K extends keyof FormState>(key: K, val: FormState[K]) { setForm((f) => ({ ...f, [key]: val })); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setFormError("");
    const url = editing ? `/api/visas/${editing.id}` : "/api/visas";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formToPayload(form)) });
    if (res.ok) { closeDialog(); load(); }
    else { const d = await res.json().catch(() => ({})); setFormError(d.error ?? "Save failed."); }
    setSaving(false);
  }

  async function handleDelete(v: VisaWithCountry) {
    if (!confirm(`Delete visa "${v.name}"?`)) return;
    const res = await fetch(`/api/visas/${v.id}`, { method: "DELETE" });
    if (res.ok) load(); else alert("Delete failed.");
  }

  const filtered = visas.filter((v) => {
    const countryName = v.countries?.name ?? "";
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
      (v.visa_type ?? "").toLowerCase().includes(search.toLowerCase()) ||
      countryName.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = filterCountry === "all" || String(v.country_id) === filterCountry;
    return matchesSearch && matchesCountry;
  });

  const isOpen = adding || !!editing;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <Input placeholder="Search visas…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
          <Select value={filterCountry} onValueChange={setFilterCountry}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>
              {countries.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openAdd}>+ Add Visa</Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Fee (USD)</TableHead>
                <TableHead>Processing</TableHead>
                <TableHead>Renewable</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No visas found.</TableCell></TableRow>
              ) : filtered.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell>
                    {v.visa_type ? <Badge variant="secondary">{v.visa_type}</Badge> : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{v.countries?.name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {v.application_fee_usd != null ? `$${v.application_fee_usd.toLocaleString()}` : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {v.processing_time_days != null ? `${v.processing_time_days}d` : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={v.renewable ? "success" : "muted"}>{v.renewable ? "Yes" : "No"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(v)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(v)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={(v) => { if (!v) closeDialog(); }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit: ${editing.name}` : "Add Visa"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} id="visa-form">
            <DialogBody className="space-y-4">
              {/* Basic */}
              <div className="space-y-1.5 col-span-2">
                <Label>Name *</Label>
                <Input required value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Country *">
                  <Select required value={form.country_id} onValueChange={(v) => set("country_id", v)}>
                    <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Visa Type">
                  <Select value={form.visa_type} onValueChange={(v) => set("visa_type", v)}>
                    <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      {VISA_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Description">
                <Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
              </Field>
              <Field label="Benefits (one per line)">
                <Textarea rows={3} value={form.benefits} onChange={(e) => set("benefits", e.target.value)} />
              </Field>

              {/* Eligibility */}
              <SectionHeading>Eligibility</SectionHeading>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Min Age"><Input type="number" value={form.min_age} onChange={(e) => set("min_age", e.target.value)} /></Field>
                <Field label="Max Age"><Input type="number" value={form.max_age} onChange={(e) => set("max_age", e.target.value)} /></Field>
                <Field label="Min Monthly Income"><Input type="number" value={form.min_income} onChange={(e) => set("min_income", e.target.value)} /></Field>
                <Field label="Income Currency">
                  <Select value={form.min_income_currency} onValueChange={(v) => set("min_income_currency", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Min Savings"><Input type="number" value={form.min_savings} onChange={(e) => set("min_savings", e.target.value)} /></Field>
                <Field label="Savings Currency">
                  <Select value={form.min_savings_currency} onValueChange={(v) => set("min_savings_currency", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Eligible Nationalities (one per line)">
                  <Textarea rows={2} value={form.eligible_nationalities} onChange={(e) => set("eligible_nationalities", e.target.value)} />
                </Field>
                <Field label="Excluded Nationalities (one per line)">
                  <Textarea rows={2} value={form.excluded_nationalities} onChange={(e) => set("excluded_nationalities", e.target.value)} />
                </Field>
              </div>
              <Field label="Required Skills (one per line)">
                <Textarea rows={2} value={form.required_skills} onChange={(e) => set("required_skills", e.target.value)} />
              </Field>

              {/* Requirements */}
              <SectionHeading>Requirements</SectionHeading>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={form.requires_health_insurance} onCheckedChange={(v) => set("requires_health_insurance", !!v)} />
                  Requires health insurance
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={form.requires_clean_criminal_record} onCheckedChange={(v) => set("requires_clean_criminal_record", !!v)} />
                  Requires clean criminal record
                </label>
              </div>
              <Field label="Required Documents (one per line)">
                <Textarea rows={2} value={form.required_documents} onChange={(e) => set("required_documents", e.target.value)} />
              </Field>

              {/* Processing */}
              <SectionHeading>Processing &amp; Validity</SectionHeading>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Processing Time (days)"><Input type="number" value={form.processing_time_days} onChange={(e) => set("processing_time_days", e.target.value)} /></Field>
                <Field label="Validity (months)"><Input type="number" value={form.validity_months} onChange={(e) => set("validity_months", e.target.value)} /></Field>
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={form.renewable} onCheckedChange={(v) => set("renewable", !!v)} />
                  Renewable
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={form.has_path_to_residency} onCheckedChange={(v) => set("has_path_to_residency", !!v)} />
                  Has path to residency
                </label>
              </div>
              {form.has_path_to_residency && (
                <Field label="Path to Residency Description">
                  <Textarea rows={2} value={form.path_to_residency_description} onChange={(e) => set("path_to_residency_description", e.target.value)} />
                </Field>
              )}

              {/* Fees */}
              <SectionHeading>Fees</SectionHeading>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Fee (USD)"><Input type="number" value={form.application_fee_usd} onChange={(e) => set("application_fee_usd", e.target.value)} /></Field>
                <Field label="Fee Amount (local)"><Input type="number" value={form.application_fee_amount} onChange={(e) => set("application_fee_amount", e.target.value)} /></Field>
                <Field label="Fee Currency">
                  <Select value={form.application_fee_currency} onValueChange={(v) => set("application_fee_currency", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
              </div>

              {/* Links */}
              <SectionHeading>Links &amp; Media</SectionHeading>
              <Field label="Official Link"><Input value={form.official_link} onChange={(e) => set("official_link", e.target.value)} placeholder="https://…" /></Field>
              <Field label="Image URL"><Input value={form.image_url} onChange={(e) => set("image_url", e.target.value)} placeholder="https://…" /></Field>

              {formError && <p className="text-sm text-destructive">{formError}</p>}
            </DialogBody>
          </form>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button type="submit" form="visa-form" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
