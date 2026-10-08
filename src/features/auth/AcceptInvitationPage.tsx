import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from "../../components/ui/Button";

export function AcceptInvitationPage() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState(""); const [error, setError] = useState("");
  const [busy, setBusy] = useState(false); const [done, setDone] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "/api";
      await axios.post(`${base.replace(/\/$/, "")}/auth/accept-invitation`, { token: params.get("token"), password },
        { headers: { "X-Tenant-Id": params.get("tenantId") } });
      setDone(true);
    } catch (cause) { setError(axios.isAxiosError(cause) ? cause.response?.data?.message || cause.response?.data?.detail || cause.response?.data?.title || cause.message : "Activation failed."); }
    finally { setBusy(false); }
  };
  return <main className="mx-auto max-w-md space-y-4 p-8"><h1 className="text-2xl font-semibold">Activate your account</h1>
    {done ? <p>Account activated. <Link to="/login" className="underline">Sign in</Link></p> : <form onSubmit={submit} className="space-y-4">
      <label className="block">Choose a password<input className="mt-2 w-full rounded border p-2" type="password" autoComplete="new-password" required minLength={12} value={password} onChange={e => setPassword(e.target.value)} /></label>
      <p className="text-sm">Use at least 12 characters, upper/lowercase letters and a number.</p>
      {error && <p role="alert" className="text-red-700">{error}</p>}<Button type="submit" disabled={busy || !params.get("token") || !params.get("tenantId")}>Activate account</Button>
    </form>}</main>;
}
