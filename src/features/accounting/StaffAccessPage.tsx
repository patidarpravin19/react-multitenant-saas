import { useCallback, useEffect, useState, type FormEvent } from "react";
import { apiClient } from "../../services/apiClient";
import { Button } from "../../components/ui/Button";
import { useAccountingAccess } from "./AccountingAccess";
type Staff = { id: string; userName: string; email: string; mobile: string; isOwner: boolean; isActive: boolean; emailVerified: boolean };
type Grants = { userId: string; permissions: string[] };
const codes = ["catalog.manage", "purchases.manage", "sales.manage", "inventory.manage", "accounting.manage", "accounting.approve", "accounting.dimensions.manage", "accounting.documents.manage", "accounting.assets.manage", "accounting.budgets.manage"];
export function StaffAccessPage() {
  const { isOwner, refresh } = useAccountingAccess(); const [staff, setStaff] = useState<Staff[]>([]); const [grants, setGrants] = useState<Grants[]>([]);
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    if (!isOwner) return;
    const [users, permissions] = await Promise.all([apiClient.get<Staff[]>("/accounting/staff"), apiClient.get<Grants[]>("/accounting-permissions")]);
    setStaff(users); setGrants(permissions);
  }, [isOwner]);
  useEffect(() => { void load().catch(e => setError(e.message)); }, [load]);
  const run = async (work: () => Promise<unknown>) => {
    setBusy(true); setError(""); try { await work(); await refresh(); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Action failed."); } finally { setBusy(false); }
  };
  const invite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = event.currentTarget; const values = Object.fromEntries(new FormData(form));
    void run(async () => { await apiClient.post("/accounting/staff/invitations", values); form.reset(); });
  };
  if (!isOwner) return <p>Only the tenant owner can manage staff and permissions.</p>;
  return <div className="space-y-5"><h1 className="text-2xl font-semibold">Staff access</h1><p>Invite staff by email. Invitations expire after 24 hours; permissions take effect immediately.</p>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    <form onSubmit={invite} className="grid gap-3 rounded border p-4 md:grid-cols-3">{[["userName","Username"],["email","Email"],["mobile","Mobile"]].map(([name,label]) => <label key={name}>{label}<input required name={name} type={name === "email" ? "email" : "text"} maxLength={name === "mobile" ? 20 : name === "userName" ? 64 : 256} className="w-full rounded border bg-transparent p-2" /></label>)}<Button type="submit" disabled={busy}>Send invitation</Button></form>
    <div className="overflow-auto"><table className="w-full text-left text-sm"><thead><tr><th>User</th><th>Status</th><th>Access</th><th>Actions</th></tr></thead><tbody>{staff.map(s => <tr key={s.id} className="border-t"><td className="p-3">{s.userName}<div>{s.email}</div></td><td>{s.isOwner ? "Owner" : !s.emailVerified ? "Invited" : s.isActive ? "Active" : "Disabled"}</td><td><div className="grid gap-2 md:grid-cols-2">{codes.map(code => <label key={code}><input type="checkbox" disabled={busy || s.isOwner || !s.isActive} checked={s.isOwner || (grants.find(g => g.userId === s.id)?.permissions.includes(code) ?? false)} onChange={e => void run(() => apiClient.put(`/accounting-permissions/${s.id}/${code}`,{granted:e.target.checked}))} /> {code}</label>)}</div></td><td>{!s.isOwner && s.emailVerified && <Button disabled={busy} onClick={() => void run(() => apiClient.put(`/accounting/staff/${s.id}/status`,{active:!s.isActive}))}>{s.isActive ? "Disable" : "Enable"}</Button>}
      {!s.emailVerified && <Button disabled={busy} onClick={() => void run(() => apiClient.post("/accounting/staff/invitations",{userName:s.userName,email:s.email,mobile:s.mobile}))}>Resend invitation</Button>}
      {!s.isOwner && s.isActive && s.emailVerified && <Button disabled={busy} variant="secondary" onClick={() => { if (window.confirm(`Transfer ownership to ${s.userName}? You will lose owner access.`)) void run(() => apiClient.post("/accounting/owner/transfer",{userId:s.id})); }}>Transfer ownership</Button>}</td></tr>)}</tbody></table></div>
  </div>;
}
