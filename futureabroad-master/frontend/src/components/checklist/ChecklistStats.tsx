import type React from "react";

const ChecklistStats: React.FC<any> = ({ stats, t }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
      <div className="bg-white dark:bg-[#1f1f1f] rounded-lg p-3 lg:p-4 border border-border">
        <div className="text-xs lg:text-sm text-muted-foreground">{t("checklists.total_tasks")}</div>
        <div className="text-xl lg:text-2xl font-bold mt-2 text-foreground">{stats.total}</div>
      </div>
      <div className="bg-white dark:bg-[#1f1f1f] rounded-lg p-3 lg:p-4 border border-border">
        <div className="text-xs lg:text-sm text-muted-foreground">{t("checklists.completed")}</div>
        <div className="text-xl lg:text-2xl font-bold mt-2 text-green-600">{stats.completed}</div>
      </div>
      <div className="bg-white dark:bg-[#1f1f1f] rounded-lg p-3 lg:p-4 border border-border">
        <div className="text-xs lg:text-sm text-muted-foreground">{t("checklists.remaining")}</div>
        <div className="text-xl lg:text-2xl font-bold mt-2 text-orange-500">{stats.remaining}</div>
      </div>
    </div>
  );
};

export default ChecklistStats;
