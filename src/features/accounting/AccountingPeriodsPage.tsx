import { useCallback, useEffect, useState, type FormEvent } from "react";
import { CalendarDays, LockKeyhole, RefreshCw } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { apiClient } from "../../services/apiClient";
import { useNotifications } from "../../context/NotificationContext";

type AccountingPeriod = { id: string; name: string; startDate: string; endDate: string; isClosed: boolean; closedAt: string | null };
const inputClass = "min-h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm dark:border-slate-700 dark:bg-slate-950";

export function AccountingPeriodsPage() {
  const notifications = useNotifications();
  const [periods, setPeriods] = useState<AccountingPeriod[]>([]);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(`${new Date().getFullYear()}-01-01`);
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try { setPeriods(await apiClient.get<AccountingPeriod[]>("/accounting-periods")); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load accounting periods."); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const createPeriod = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await apiClient.post<AccountingPeriod>("/accounting-periods", { name, startDate, endDate });
      setName("");
      notifications.success("Accounting period created", "The period is open for posting until it is closed.");
      await load();
    } catch (cause) { notifications.error("Period not created", cause instanceof Error ? cause.message : "Check the dates and try again."); }
    finally { setBusy(false); }
  };

  const closePeriod = async (period: AccountingPeriod) => {
    if (!window.confirm(`Close ${period.name} (${period.startDate} to ${period.endDate})? New journal postings to these dates will be blocked.`)) return;
    setBusy(true);
    try {
      await apiClient.post<AccountingPeriod>(`/accounting-periods/${encodeURIComponent(period.id)}/close`, {});
      notifications.success("Period closed and year-end posted", "Revenue and expenses were closed to retained earnings; the closing journal is available in General Ledger.");
      await load();
    } catch (cause) { notifications.error("Period not closed", cause instanceof Error ? cause.message : "Please try again."); }
    finally { setBusy(false); }
  };

  return <section className="space-y-4">
    <header className="flex flex-wrap items-start justify-between gap-2"><div><h1 className="text-xl font-semibold">Accounting Periods</h1><p className="mt-0.5 text-xs text-slate-500">Define date ranges and close reviewed periods to stop new backdated journal postings.</p></div><Button variant="secondary" onClick={() => void load()}><RefreshCw size={14} /> Refresh</Button></header>
    {error ? <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
    <form onSubmit={(event) => void createPeriod(event)} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[1.2fr_1fr_1fr_auto]">
      <label className="text-xs">Period name<input className={`${inputClass} mt-1`} required maxLength={100} value={name} onChange={event => setName(event.target.value)} placeholder="FY 2026–27" /></label>
      <label className="text-xs">Start date<input className={`${inputClass} mt-1`} type="date" required value={startDate} onChange={event => setStartDate(event.target.value)} /></label>
      <label className="text-xs">End date<input className={`${inputClass} mt-1`} type="date" required min={startDate} value={endDate} onChange={event => setEndDate(event.target.value)} /></label>
      <div className="self-end"><Button type="submit" isLoading={busy}><CalendarDays size={14} /> Create period</Button></div>
    </form>
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><div className="overflow-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-950"><tr><th className="p-3">Name</th><th className="p-3">Start</th><th className="p-3">End</th><th className="p-3">Status</th><th className="p-3">Closed at</th><th className="p-3">Action</th></tr></thead><tbody>{periods.map(period => <tr key={period.id} className="border-t border-slate-100 dark:border-slate-800"><td className="p-3 font-medium">{period.name}</td><td className="p-3">{period.startDate}</td><td className="p-3">{period.endDate}</td><td className="p-3"><span className={period.isClosed ? "rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700" : "rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700"}>{period.isClosed ? "Closed" : "Open"}</span></td><td className="p-3">{period.closedAt ? new Date(period.closedAt).toLocaleString() : "—"}</td><td className="p-3">{period.isClosed ? <span className="text-xs text-slate-500">Locked</span> : <Button type="button" variant="secondary" disabled={busy} onClick={() => void closePeriod(period)}><LockKeyhole size={14} /> Year-end close</Button>}</td></tr>)}{periods.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-slate-500">No accounting periods configured yet.</td></tr> : null}</tbody></table></div></section>
  </section>;
}
