import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowLeft } from "lucide-react";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { createAdminClient } from "@/lib/supabase";
import { CountryEditForm } from "@/app/_components/countries/CountryEditForm";
import { FindVisasCard } from "@/app/_components/countries/FindVisasCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function EditCountryPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySessionToken(token, process.env.SESSION_SECRET ?? ""))) {
    redirect("/login");
  }

  const { id } = await params;
  const sb = createAdminClient();
  const { data, error } = await sb.from("countries").select("*").eq("id", id).single();
  if (error || !data) notFound();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 flex h-13 items-center justify-between border-b border-border bg-card px-6 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">⚙</span>
          <span className="font-semibold text-sm tracking-tight">MFA Visa Tool</span>
        </div>
        <form action="/api/auth/logout" method="POST">
          <Button type="submit" variant="outline" size="sm">Sign out</Button>
        </form>
      </header>

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-5">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground">
            <Link href="/"><ArrowLeft className="h-4 w-4 mr-1" />Countries</Link>
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{data.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Edit country details</p>
          </div>
          {data.flag_url && <img src={data.flag_url} alt="" className="h-8 rounded" />}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
            <CardDescription>Update the country information below.</CardDescription>
          </CardHeader>
          <CardContent>
            <CountryEditForm country={data} />
          </CardContent>
        </Card>

        <FindVisasCard countryId={data.id} countryName={data.name} />
      </main>
    </div>
  );
}
