import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ProviderMember, Provider } from "@/lib/types";

export default function BusinessesList({
  memberships,
  fetching,
  onCreateClick,
  onSelect,
  showCreate,
}: {
  memberships: ProviderMember[];
  fetching: boolean;
  onCreateClick: () => void;
  onSelect: (member: ProviderMember) => void;
  showCreate: boolean;
}) {
  const ROLE_COLORS: Record<string, string> = {
    owner: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    member: "bg-muted text-muted-foreground",
  };
  const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    active: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    completed: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your businesses</h2>
        {!showCreate && (
          <Button size="sm" className="rounded-full" onClick={onCreateClick}>
            + Create a business
          </Button>
        )}
      </div>

      {fetching ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : memberships.length === 0 && !showCreate ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-white/60 p-10 text-center dark:bg-[#1a1a1a]/60">
          <p className="text-sm text-muted-foreground">No businesses found</p>
          <Button size="sm" className="mt-4 rounded-full" onClick={onCreateClick}>
            Create first business
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {memberships.map((m) => {
            const p = m.provider as Provider | undefined;
            return (
              <button
                key={m.id}
                onClick={() => onSelect(m)}
                className="w-full text-left rounded-2xl border border-border/50 bg-white px-6 py-5 shadow-sm hover:shadow-md transition-shadow dark:bg-[#1a1a1a] dark:border-white/10 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{p?.company_name ?? "Unknown"}</p>
                    <p className="text-sm text-muted-foreground capitalize">{p?.provider_type ?? "—"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn("rounded-full px-3 py-1 text-xs font-medium capitalize", ROLE_COLORS[m.role] ?? ROLE_COLORS.member)}>
                      {m.role}
                    </span>
                    <span className={cn("rounded-full px-3 py-1 text-xs font-medium capitalize", STATUS_COLORS[p?.status ?? "pending"])}>
                      {p?.status ?? "pending"}
                    </span>
                    <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
