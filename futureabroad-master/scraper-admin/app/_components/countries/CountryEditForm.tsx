"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import type { Country } from "@/lib/types";

const CONTINENTS = ["Africa", "Antarctica", "Asia", "Europe", "North America", "Oceania", "South America"];

type FormState = Omit<Country, "id" | "created_at">;

function toForm(c: Country): FormState {
  return {
    name: c.name ?? "", continent: c.continent ?? "", iso_code: c.iso_code ?? "",
    flag_url: c.flag_url ?? "", highlight_img_url: c.highlight_img_url ?? "",
    description: c.description ?? "", longdescription: c.longdescription ?? "",
    tax_advice: c.tax_advice ?? "", extra_info: c.extra_info ?? "", local_tips: c.local_tips ?? "",
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
  return <p className="text-xs font-semibold uppercase tracking-wide text-primary pt-4 border-t border-border mt-4">{children}</p>;
}

export function CountryEditForm({ country }: { country: Country }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(toForm(country));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(key: keyof FormState, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    const res = await fetch(`/api/countries/${country.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/");
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Save failed.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label>Name *</Label>
          <Input required value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <Field label="ISO Code">
          <Input maxLength={2} value={form.iso_code ?? ""} onChange={(e) => set("iso_code", e.target.value)} placeholder="PT" />
        </Field>
      </div>

      <Field label="Continent *">
        <Select required value={form.continent} onValueChange={(v) => set("continent", v)}>
          <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
          <SelectContent>
            {CONTINENTS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Flag URL">
          <Input value={form.flag_url ?? ""} onChange={(e) => set("flag_url", e.target.value)} placeholder="https://…" />
        </Field>
        <Field label="Highlight Image URL">
          <Input value={form.highlight_img_url ?? ""} onChange={(e) => set("highlight_img_url", e.target.value)} placeholder="https://…" />
        </Field>
      </div>

      <SectionHeading>Content</SectionHeading>

      <Field label="Short Description">
        <MarkdownEditor value={form.description ?? ""} onChange={(v) => set("description", v)} minHeight={140} />
      </Field>
      <Field label="Long Description">
        <MarkdownEditor value={form.longdescription ?? ""} onChange={(v) => set("longdescription", v)} minHeight={200} />
      </Field>
      <Field label="Tax Advice">
        <MarkdownEditor value={form.tax_advice ?? ""} onChange={(v) => set("tax_advice", v)} minHeight={160} />
      </Field>
      <Field label="Extra Info">
        <MarkdownEditor value={form.extra_info ?? ""} onChange={(v) => set("extra_info", v)} minHeight={160} />
      </Field>
      <Field label="Local Tips">
        <MarkdownEditor value={form.local_tips ?? ""} onChange={(v) => set("local_tips", v)} minHeight={160} />
      </Field>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={() => router.push("/")}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </form>
  );
}
