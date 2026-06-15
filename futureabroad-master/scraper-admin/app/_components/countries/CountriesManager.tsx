"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import type { Country } from "@/lib/types";

const CONTINENTS = ["Africa", "Antarctica", "Asia", "Europe", "North America", "Oceania", "South America"];

type FormState = Omit<Country, "id" | "created_at">;

const emptyForm = (): FormState => ({
  name: "", continent: "", iso_code: "", flag_url: "",
  highlight_img_url: "", description: "", longdescription: "",
  tax_advice: "", extra_info: "", local_tips: "",
});

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function CountriesManager() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/countries");
    if (res.ok) setCountries(await res.json());
    else setError("Failed to load countries.");
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setForm(emptyForm()); setFormError(""); setOpen(true); }
  function set(key: keyof FormState, val: string) { setForm((f) => ({ ...f, [key]: val })); }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setFormError("");
    const res = await fetch("/api/countries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { setOpen(false); load(); }
    else { const d = await res.json().catch(() => ({})); setFormError(d.error ?? "Save failed."); }
    setSaving(false);
  }

  async function handleDelete(c: Country) {
    if (!confirm(`Delete "${c.name}"? This will also delete all its visas.`)) return;
    const res = await fetch(`/api/countries/${c.id}`, { method: "DELETE" });
    if (res.ok) load(); else alert("Delete failed.");
  }

  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.continent ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (c.iso_code ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Input placeholder="Search countries…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-52 h-8 text-sm" />
          {!loading && (
            <span className="text-sm text-muted-foreground">
              {filtered.length !== countries.length
                ? `${filtered.length} of ${countries.length}`
                : `${countries.length}`}{" "}
              {countries.length === 1 ? "country" : "countries"}
            </span>
          )}
        </div>
        <Button size="sm" onClick={openAdd}>+ Add Country</Button>
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
                <TableHead>ISO</TableHead>
                <TableHead>Continent</TableHead>
                <TableHead>Flag</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6 text-sm">No countries found.</TableCell>
                </TableRow>
              ) : filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium py-2 text-sm">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground py-2 text-sm">{c.iso_code ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground py-2 text-sm">{c.continent}</TableCell>
                  <TableCell className="py-2">
                    {c.flag_url ? <img src={c.flag_url} alt="" className="h-4 rounded-sm" /> : <span className="text-muted-foreground text-sm">—</span>}
                  </TableCell>
                  <TableCell className="text-right py-2">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
                      <Link href={`/countries/${c.id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive hover:text-destructive" onClick={() => handleDelete(c)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Country</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} id="add-country-form">
            <DialogBody className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <Label>Name *</Label>
                  <Input required value={form.name} onChange={(e) => set("name", e.target.value)} />
                </div>
                <FormField label="ISO Code">
                  <Input maxLength={2} value={form.iso_code ?? ""} onChange={(e) => set("iso_code", e.target.value)} placeholder="PT" />
                </FormField>
              </div>

              <FormField label="Continent *">
                <Select required value={form.continent} onValueChange={(v) => set("continent", v)}>
                  <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    {CONTINENTS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Flag URL">
                  <Input value={form.flag_url ?? ""} onChange={(e) => set("flag_url", e.target.value)} placeholder="https://…" />
                </FormField>
                <FormField label="Highlight Image URL">
                  <Input value={form.highlight_img_url ?? ""} onChange={(e) => set("highlight_img_url", e.target.value)} placeholder="https://…" />
                </FormField>
              </div>

              <div className="pt-1 border-t border-border">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-3">Content</p>
                <div className="space-y-3">
                  <FormField label="Short Description">
                    <MarkdownEditor value={form.description ?? ""} onChange={(v) => set("description", v)} minHeight={120} />
                  </FormField>
                  <FormField label="Long Description">
                    <MarkdownEditor value={form.longdescription ?? ""} onChange={(v) => set("longdescription", v)} minHeight={140} />
                  </FormField>
                  <FormField label="Tax Advice">
                    <MarkdownEditor value={form.tax_advice ?? ""} onChange={(v) => set("tax_advice", v)} minHeight={120} />
                  </FormField>
                  <FormField label="Extra Info">
                    <MarkdownEditor value={form.extra_info ?? ""} onChange={(v) => set("extra_info", v)} minHeight={120} />
                  </FormField>
                  <FormField label="Local Tips">
                    <MarkdownEditor value={form.local_tips ?? ""} onChange={(v) => set("local_tips", v)} minHeight={120} />
                  </FormField>
                </div>
              </div>

              {formError && <p className="text-sm text-destructive">{formError}</p>}
            </DialogBody>
          </form>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="add-country-form" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
