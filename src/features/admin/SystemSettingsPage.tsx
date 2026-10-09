import { useState, useEffect } from "react";
import {
  Server,
  Mail,
  Database,
  ShieldCheck,
  HardDrive,
  Copy,
  Check,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Key,
  Globe,
  Radio,
} from "lucide-react";
import { apiClient } from "../../services/apiClient";

interface AdminSystemSettings {
  offlineMode: boolean;
  databaseProvider: string;
  databaseHost: string;
  databasePort: number;
  databaseName: string;
  masterSchema: string;
  emailProvider: string;
  adminEmail: string;
  productOwnerUsername: string;
  totalTenants: number;
  activeTenants: number;
  pendingApprovals: number;
  suspendedTenants: number;
  systemVersion: string;
  serverTimeUtc: string;
}

export function SystemSettingsPage() {
  const [settings, setSettings] = useState<AdminSystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<AdminSystemSettings>("/admin/system-settings");
      setSettings(data);
    } catch {
      setSettings({
        offlineMode: true,
        databaseProvider: "PostgreSQL (Npgsql)",
        databaseHost: "localhost",
        databasePort: 5432,
        databaseName: "siddhi_db",
        masterSchema: "tenant",
        emailProvider: "Simulated Console (Offline Mode)",
        adminEmail: "developer.pravin666@gmail.com",
        productOwnerUsername: "admin",
        totalTenants: 1,
        activeTenants: 1,
        pendingApprovals: 0,
        suspendedTenants: 0,
        systemVersion: "1.4.0",
        serverTimeUtc: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!mounted) return;
      await fetchSettings();
    };
    void run();
    return () => {
      mounted = false;
    };
  }, []);

  const copyRegistrationLink = () => {
    const origin = window.location.origin;
    const link = `${origin}/register-tenant`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-slate-800 text-white shadow-sm dark:bg-slate-700">
            <Server className="size-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Platform System Settings</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deployment operational mode, email dispatch configurations, offline workflow parameters, and administrative keys.
            </p>
          </div>
        </div>

        <button
          onClick={fetchSettings}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Settings</span>
        </button>
      </div>

      {/* Deployment Mode Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Environment Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Radio className="size-5 text-emerald-500 animate-pulse" />
              <h2 className="font-bold text-slate-900 dark:text-white">Active Deployment Mode</h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              {settings?.offlineMode ? "Offline First / Local Desktop" : "Cloud SaaS (Online)"}
            </span>
          </div>

          <div className="mt-4 space-y-4 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Database Engine</span>
                <p className="text-slate-500">PostgreSQL with isolated schema-per-tenant</p>
              </div>
              <span className="font-mono text-slate-600 dark:text-slate-400">
                {settings ? `${settings.databaseHost}:${settings.databasePort}` : "localhost:5432"}
              </span>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Database Name</span>
                <p className="text-slate-500">Main PostgreSQL database</p>
              </div>
              <span className="font-mono text-slate-600 dark:text-slate-400">
                {settings?.databaseName ?? "siddhi_db"}
              </span>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Master Directory Schema</span>
                <p className="text-slate-500">Stores global tenant registry & system users</p>
              </div>
              <span className="font-mono text-slate-600 dark:text-slate-400">
                "{settings?.masterSchema ?? "tenant"}"
              </span>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Email Dispatch Strategy</span>
                <p className="text-slate-500">{settings?.emailProvider ?? "Simulated console logger"}</p>
              </div>
              <span className="rounded-md bg-amber-50 px-2 py-0.5 font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                {settings?.offlineMode ? "No SMTP Required" : "Live SMTP"}
              </span>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">System Version</span>
                <p className="text-slate-500">Current software release</p>
              </div>
              <span className="font-mono text-slate-600 dark:text-slate-400">
                v{settings?.systemVersion ?? "1.4.0"}
              </span>
            </div>
          </div>
        </div>

        {/* Product Owner Identity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
            <ShieldCheck className="size-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-bold text-slate-900 dark:text-white">Product Owner Profile</h2>
          </div>

          <div className="mt-4 space-y-3.5 text-xs">
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                Primary Administrator
              </div>
              <div className="mt-1 font-bold text-slate-900 dark:text-white text-sm">
                {settings?.adminEmail ?? "developer.pravin666@gmail.com"}
              </div>
              <div className="mt-0.5 font-mono text-[11px] text-slate-500">
                Username: {settings?.productOwnerUsername ?? "admin"}
              </div>
            </div>

            <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Administrative Capabilities:</div>
              <ul className="list-disc pl-4 space-y-1">
                <li>Approve self-service store registrations with automated schema setup</li>
                <li>Suspend or unfreeze tenant access instantly</li>
                <li>Execute global PostgreSQL migrations across all active tenant schemas</li>
                <li>Access all stores without tenant token restrictions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Tenant Self-Service Onboarding Integration */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Self-Service Store Registration Link</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Share this onboarding link with new business customers. Registrations will appear in your Store Approvals queue.
            </p>
          </div>

          <button
            onClick={copyRegistrationLink}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
          >
            {copiedLink ? <Check className="size-4 text-emerald-300" /> : <Copy className="size-4" />}
            <span>{copiedLink ? "Link Copied to Clipboard!" : "Copy Public Registration Link"}</span>
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
          {window.location.origin}/register-tenant
        </div>
      </div>

      {/* Offline Deployment & Migration Guide */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
          <HardDrive className="size-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 dark:text-white">Offline Deployment & Setup Checklist</h3>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <span className="grid size-6 place-items-center rounded-full bg-blue-600 text-[11px] text-white">1</span>
              <span>PostgreSQL Service</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Ensure PostgreSQL is running locally on port 5432 with the database named <code className="font-mono text-slate-800 dark:text-slate-200">siddhi_db</code>. The master schema <code className="font-mono">tenant</code> is created automatically on first run.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <span className="grid size-6 place-items-center rounded-full bg-blue-600 text-[11px] text-white">2</span>
              <span>Backend API Server</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Launch the .NET backend API. It includes the Product Owner admin endpoints and handles database schema creation using <code className="font-mono">TenantSchemaMigrator</code> when approving stores.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <span className="grid size-6 place-items-center rounded-full bg-blue-600 text-[11px] text-white">3</span>
              <span>Store Onboarding</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Open <code className="font-mono">/register-tenant</code> to create a store. Log in as Product Owner at <code className="font-mono">/admin/login</code> to approve the store and initialize its accounting ledgers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
