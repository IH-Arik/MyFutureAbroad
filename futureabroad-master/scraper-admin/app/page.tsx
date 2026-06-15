import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { Dashboard } from "./_components/Dashboard";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const secret = process.env.SESSION_SECRET ?? "";

  if (!token || !(await verifySessionToken(token, secret))) {
    redirect("/login");
  }

  return <Dashboard />;
}
