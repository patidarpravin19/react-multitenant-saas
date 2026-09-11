import { ChevronLeft, ChevronRight } from "lucide-react";

import { sidebarConfiguration } from "../../config/sidebar.config";

import { SidebarMenuItem } from "../navigation/SidebarMenuItem";

interface SidebarProps {
  collapsed: boolean;

  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={[
        "relative flex h-full flex-col",
        "border-r border-slate-200",
        "bg-white",
        "dark:border-slate-800",
        "dark:bg-slate-900",
        "transition-all duration-300",

        collapsed ? "w-[72px]" : "w-[260px]",
      ].join(" ")}
    >
      <div
        className="
          flex-1
          overflow-y-auto
          px-3
          py-4
        "
      >
        <nav aria-label="Main navigation" className="space-y-1">
          {sidebarConfiguration.map((item) => (
            <SidebarMenuItem key={item.id} item={item} collapsed={collapsed} />
          ))}
        </nav>
      </div>

      <div
        className="
          border-t
          border-slate-200
          p-3
          dark:border-slate-800
        "
      >
        <button
          type="button"
          onClick={onToggle}
          className="
            flex
            w-full
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            p-2
            text-slate-600
            transition-all
            duration-300
            hover:bg-slate-100

            dark:border-slate-700
            dark:text-slate-300
            dark:hover:bg-slate-800
          "
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
