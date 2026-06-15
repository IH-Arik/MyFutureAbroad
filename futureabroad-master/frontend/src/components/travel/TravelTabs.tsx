import { useState } from "react";

type TrainRegion = "europe" | "china" | "korea";

export default function TravelTabs({ t }: { t: (k: string) => string }) {
  const [activeTab, setActiveTab] = useState<"hotels" | "flights" | "trains">("hotels");
  const [trainRegion, setTrainRegion] = useState<TrainRegion>("europe");

  const tabs = ["hotels", "flights", "trains"] as const;

  const trainIframes: Record<TrainRegion, string> = {
    europe: "https://www.trip.com/partners/ad/S14318789?Allianceid=7932030&SID=298207806&trip_sub1=",
    china: "https://www.trip.com/partners/ad/S14318754?Allianceid=7932030&SID=298207806&trip_sub1=",
    korea: "https://www.trip.com/partners/ad/S14318775?Allianceid=7932030&SID=298207806&trip_sub1=",
  };

  const TAB_LABELS: Record<string, string> = {
    hotels: t("travel.tab_hotels"),
    flights: t("travel.tab_flights"),
    trains: t("travel.tab_trains"),
  };

  const REGION_LABELS: Record<TrainRegion, string> = {
    europe: t("travel.region_europe"),
    china: t("travel.region_china"),
    korea: t("travel.region_korea"),
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-1.5 rounded-full border border-border/40 bg-white dark:bg-[#242424]/90 px-3 py-2 shadow-sm w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
              activeTab === tab
                ? "bg-muted text-foreground shadow-sm dark:bg-[#3a3a3a]"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground dark:hover:bg-[#353535]"
            }`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <div className="mt-6 w-full overflow-hidden rounded-2xl bg-white dark:bg-[#1a1a1a]">
        {activeTab === "hotels" && (
          <iframe
            src="https://www.trip.com/partners/ad/S14318656?Allianceid=7932030&SID=298207806&trip_sub1="
            style={{ width: "100%", height: "200px", border: "none" }}
            id="S14318656"
          />
        )}
        {activeTab === "flights" && (
          <iframe
            src="https://www.trip.com/partners/ad/S14080355?Allianceid=7932030&SID=298207806&trip_sub1="
            style={{ width: "100%", height: "200px", border: "none" }}
            id="S14080355"
          />
        )}
        {activeTab === "trains" && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              {(["europe", "china", "korea"] as TrainRegion[]).map((region) => (
                <button
                  key={region}
                  onClick={() => setTrainRegion(region)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                    trainRegion === region
                      ? "bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] text-white"
                      : "border border-slate-200 dark:border-white/10 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {REGION_LABELS[region]}
                </button>
              ))}
            </div>
            <iframe
              src={trainIframes[trainRegion]}
              style={{ width: "100%", height: "200px", border: "none" }}
              id={`train-${trainRegion}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
