import type React from "react";

const ChecklistHeader: React.FC<any> = ({ editingName, setEditingName, saving, onAddClick, handleDeleteChecklist, notes, setNotes, t }) => {
  return (
    <div className="mb-6 lg:mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 lg:gap-4 mb-4">
        <input value={editingName} onChange={(e) => setEditingName(e.target.value)} className="text-xl lg:text-2xl xl:text-3xl font-bold border-b-2 border-border bg-transparent text-foreground pb-1 focus:outline-none flex-1 min-w-0" />
        {saving && (
          <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground shrink-0">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <button onClick={onAddClick} className="flex-1 lg:flex-none rounded-md px-2 lg:px-3 py-1.5 lg:py-1 bg-[#1f4865] text-white text-xs lg:text-sm cursor-pointer hover:bg-[#1f4865]/90 transition-colors whitespace-nowrap">{t("checklists.add_task")}</button>
          <button onClick={handleDeleteChecklist} className="flex-1 lg:flex-none rounded-md px-2 lg:px-3 py-1.5 lg:py-1 bg-red-600 text-white text-xs lg:text-sm cursor-pointer hover:bg-red-700 transition-colors">{t("common.delete")}</button>
        </div>
      </div>
      <div className="text-xs lg:text-sm font-medium text-foreground mb-2">{t("common.notes")}</div>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("checklists.notes_placeholder")} className="w-full rounded-lg border border-border bg-white dark:bg-[#1f1f1f] text-foreground placeholder:text-muted-foreground px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm focus:border-ring focus:outline-none transition-all" rows={3} />
    </div>
  );
};

export default ChecklistHeader;
