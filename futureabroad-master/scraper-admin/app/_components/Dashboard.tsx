"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CountriesManager } from "./countries/CountriesManager";
import { VisasManager } from "./visas/VisasManager";

export function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-13 items-center justify-between border-b border-border bg-card px-6 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">⚙</span>
          <span className="font-semibold text-sm tracking-tight">MFA Visa Tool</span>
        </div>
        <form action="/api/auth/logout" method="POST">
          <Button type="submit" variant="outline" size="sm">Sign out</Button>
        </form>
      </header>

      <div className="flex flex-col flex-1">
        <Tabs defaultValue="countries" className="flex flex-col flex-1">
          <div className="border-b border-border bg-card px-6 pt-3">
            <TabsList>
              <TabsTrigger value="countries">Countries</TabsTrigger>
              <TabsTrigger value="visas">Visas</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="countries" className="flex-1 p-6 max-w-6xl mx-auto w-full">
            <CountriesManager />
          </TabsContent>

          <TabsContent value="visas" className="flex-1 p-6 max-w-6xl mx-auto w-full">
            <VisasManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
