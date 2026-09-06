import {
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Users", icon: Users },
  { label: "Reports", icon: FileText },
  { label: "Settings", icon: Settings },
] as const;

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`hidden shrink-0 border-r border-slate-200 bg-white shadow-sm transition-all duration-300 md:flex md:flex-col dark:border-slate-800 dark:bg-slate-900 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <nav aria-label="Primary navigation" className="flex-1 space-y-1 p-3">
        {navItems.map(({ label, icon: Icon }, index) => (
          <a
            key={label}
            href="#"
            aria-current={index === 0 ? "page" : undefined}
            title={collapsed ? label : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-300 ${
              index === 0
                ? "bg-[var(--tenant-secondary)] text-[var(--tenant-primary)]"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            }`}
          >
            <Icon className="size-5 shrink-0" aria-hidden />
            {!collapsed ? <span>{label}</span> : <span className="sr-only">{label}</span>}
          </a>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 transition-all duration-300 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <>
              <ChevronLeft className="size-4" />
              Collapse
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
