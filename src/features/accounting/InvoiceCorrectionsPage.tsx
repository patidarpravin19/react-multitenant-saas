import { useCallback, useEffect, useState, type FormEvent } from "react";
import { apiClient, type PagedData } from "../../services/apiClient";
import { Button } from "../../components/ui/Button";
import { useAccountingAccess } from "./AccountingAccess";
import { CorrectionDocument, type CorrectionNote, type CorrectionSnapshot, type NoteRefund } from "./CorrectionDocument";

type Note = CorrectionNote;
type Source = { id: string; billNumber: string; serialNumber: string; productName?: string; customerName?: string; totalAmount: number; paymentStatus?: string; isActive?: boolean; isSold?: boolean };
const input = "w-full rounded border border-slate-300 bg-transparent p-2";
const money = (n: number) => n.toLocaleString("en-IN", { style: "currency", currency: "INR" });
export function InvoiceCorrectionsPage() {
  const { can } = useAccountingAccess();
  const [notes, setNotes] = useState<Note[]>([]); const [sources, setSources] = useState<Source[]>([]);
  const [kind, setKind] = useState("Sale"); const [search, setSearch] = useState(""); const [source, setSource] = useState("");
  const [refund, setRefund] = useState<Note | null>(null); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const [document, setDocument] = useState<{ note: Note; snapshot: CorrectionSnapshot; refunds: NoteRefund[] } | null>(null);
  const viewNote = async (note: Note) => {
    try { const [snapshot, refunds] = await Promise.all([apiClient.get<CorrectionSnapshot>(`/accounting/snapshots/${note.kind}/${note.sourceId}`), apiClient.get<NoteRefund[]>(`/accounting/corrections/${note.id}/refunds`)]); setDocument({ note, snapshot, refunds }); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not load the note."); }
  };
  const load = useCallback(async () => setNotes(await apiClient.get<Note[]>("/accounting/corrections")), []);
  useEffect(() => { void load().catch(e => setError(e.message)); }, [load]);
  useEffect(() => {
    let cancelled = false;
    const timeout = window.setTimeout(() => {
      const endpoint = kind === "Sale" ? "/sales/accounting/bills" : "/products";
      void apiClient.get<PagedData<Source>>(`${endpoint}?${new URLSearchParams({ page: "1", pageSize: "100", search })}`)
        .then(page => { if (!cancelled) { setSources(page.items.filter(s => kind === "Sale" ? s.paymentStatus !== "Returned" : s.isActive && !s.isSold)); setSource(""); } })
        .catch(e => { if (!cancelled) setError(e.message); });
    }, 250);
    return () => { cancelled = true; window.clearTimeout(timeout); };
  }, [kind, search]);
  const run = async (work: () => Promise<unknown>) => {
    setBusy(true); setError(""); try { await work(); await load(); setRefund(null); setSource(""); }
    catch (e) { setError(e instanceof Error ? e.message : "Action failed."); } finally { setBusy(false); }
  };
  const postNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    void run(() => apiClient.post("/accounting/corrections", { kind, sourceId: source, noteDate: data.get("date"), reason: data.get("reason"), disposition: kind === "Purchase" ? "Supplier" : data.get("disposition") }));
  };
  const postRefund = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const data = new FormData(event.currentTarget); if (!refund) return;
    void run(() => apiClient.post(`/accounting/corrections/${refund.id}/refunds`, { paymentDate: data.get("date"), amount: Number(data.get("amount")), paymentMode: data.get("mode"), reference: data.get("reference") }));
  };
  return <div className="space-y-5"><h1 className="text-2xl font-semibold">Returns & corrections</h1>
    <p>Return or cancel a full serialized unit. The original invoice stays in history; a linked credit/debit note reverses its ledger and GST entries.</p>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    <div className="grid gap-3 md:grid-cols-2"><label>Invoice type<select className={input} value={kind} onChange={e => setKind(e.target.value)}><option>Sale</option><option>Purchase</option></select></label><label>Find invoice or serial<input className={input} value={search} onChange={e => setSearch(e.target.value)} /></label></div>
    {can(kind === "Sale" ? "sales.manage" : "purchases.manage") && <form onSubmit={postNote} className="grid gap-3 rounded border p-4 md:grid-cols-2">
      <label className="md:col-span-2">Invoice unit<select required className={input} value={source} onChange={e => setSource(e.target.value)}><option value="">Choose a unit</option>{sources.map(s => <option key={s.id} value={s.id}>{s.billNumber} · {s.serialNumber} · {s.customerName || s.productName} · {money(s.totalAmount)}</option>)}</select></label>
      <label>Note date<input required type="date" name="date" className={input} defaultValue={new Date().toISOString().slice(0, 10)} /></label>
      {kind === "Sale" && <label>Returned stock<select name="disposition" className={input}><option value="Restock">Restock for resale</option><option value="WriteOff">Write off damaged stock</option></select></label>}
      <label className="md:col-span-2">Reason<textarea required maxLength={400} name="reason" className={input} /></label><Button type="submit" disabled={busy || !source}>Post {kind === "Sale" ? "credit" : "debit"} note</Button>
    </form>}
    <div className="overflow-auto"><table className="w-full text-left text-sm"><thead><tr><th>Note / invoice</th><th>Date</th><th>Reason / stock</th><th>Credit</th><th>Refunded</th><th>Actions</th></tr></thead><tbody>{notes.map(n => <tr key={n.id} className="border-t"><td className="py-3">{n.noteNumber}<div>{n.kind} · {n.billNumber}</div></td><td>{n.noteDate}</td><td>{n.reason}<div>{n.disposition}</div></td><td>{money(n.totalAmount)}</td><td>{money(n.refunded)}</td><td><Button variant="secondary" onClick={() => void viewNote(n)}>View note</Button>{can(n.kind === "Sale" ? "sales.manage" : "purchases.manage") && n.refundAvailable > 0 && <Button onClick={() => setRefund(n)}>Record refund</Button>}</td></tr>)}</tbody></table></div>
    {document && <CorrectionDocument {...document} onClose={() => setDocument(null)} />}
    {refund && <form onSubmit={postRefund} className="grid gap-3 rounded border p-4 md:grid-cols-2"><h2 className="md:col-span-2 font-semibold">{refund.kind === "Sale" ? "Refund customer" : "Refund received from supplier"} · available {money(refund.refundAvailable)}</h2>
      <label>Date<input required name="date" type="date" min={refund.noteDate} defaultValue={new Date().toISOString().slice(0, 10)} className={input} /></label><label>Amount<input required name="amount" type="number" min="0.01" max={refund.refundAvailable} step="1" className={input} /></label>
      <label>Payment method<select name="mode" className={input}><option>Cash</option><option>Bank</option></select></label><label>Reference<input name="reference" maxLength={100} className={input} /></label><Button type="submit" disabled={busy}>Save refund</Button><Button variant="secondary" onClick={() => setRefund(null)}>Cancel</Button>
    </form>}
  </div>;
}
