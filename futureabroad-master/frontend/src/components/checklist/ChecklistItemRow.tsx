import type React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const ChecklistItemRow: React.FC<any> = ({ item, tags, itemTagIds, onToggle, onEdit, onDelete, tCat }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 10 : "auto" as any,
  };

  const resolvedTags = (itemTagIds || [])
    .map((tid: string) => tags?.find((t: any) => t.id === tid))
    .filter(Boolean);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col lg:flex-row lg:items-center lg:justify-between p-3 lg:p-4 transition-colors gap-2 lg:gap-0 ${item.status ? "bg-slate-50 dark:bg-[#181818] text-muted-foreground" : "bg-white dark:bg-[#1f1f1f] text-foreground hover:bg-slate-50 dark:hover:bg-[#252525]"}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
          title="Drag to reorder"
          tabIndex={-1}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          </svg>
        </button>
        <button onClick={onToggle} className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${item.status ? "bg-green-500 border-green-500 text-white" : "border-border bg-white dark:bg-[#1f1f1f]"}`}>
          {item.status && (
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          )}
        </button>
        <div className="min-w-0">
          <div className={`text-xs lg:text-sm font-medium truncate ${item.status ? "line-through" : ""}`}>{item.name}</div>
          <div className="flex flex-wrap items-center gap-1 mt-0.5">
            <span className="text-xs text-muted-foreground capitalize font-medium">{tCat(item.category)}</span>
            {resolvedTags.length > 0 && (
              <span className="flex flex-wrap gap-1 ml-1">
                {resolvedTags.map((tag: any) => (
                  <span key={tag.id} className="inline-block px-1.5 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground border border-border leading-tight">
                    {tag.name.replace(/_/g, " ")}
                  </span>
                ))}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0 self-end lg:self-auto">
        <button onClick={onEdit} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors" title="Edit">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </button>
        <button onClick={onDelete} className="p-2 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-destructive/10 rounded transition-colors" title="Delete">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
  );
};

export default ChecklistItemRow;
