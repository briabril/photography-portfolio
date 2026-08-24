"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowUpRight } from "lucide-react";
import { PanelInput, PanelFieldLabel, PanelEyebrow } from "@/components/panel/PanelControls";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const emailId = useId();
  const passwordId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    router.push("/panel/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-panel-bg px-4">
      <div className="relative w-full max-w-sm">
        <div
          aria-hidden
          className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl border border-panel-border bg-panel-accent/10"
        />
        <form
          onSubmit={handleSubmit}
          className="relative w-full space-y-5 rounded-2xl border border-panel-border bg-panel-surface p-8 shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
        >
          <div>
            <PanelEyebrow>Panel privado</PanelEyebrow>
            <h1 className="mt-3 font-(family-name:--font-display) text-2xl italic text-panel-foreground">
              Acceso al panel
            </h1>
          </div>

          <div className="space-y-1">
            <PanelFieldLabel htmlFor={emailId}>Email</PanelFieldLabel>
            <PanelInput
              id={emailId}
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <PanelFieldLabel htmlFor={passwordId}>Contraseña</PanelFieldLabel>
            <PanelInput
              id={passwordId}
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-panel-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-panel-accent py-2.5 text-sm font-medium text-panel-accent-foreground transition-colors hover:bg-panel-accent-hover disabled:opacity-50"
          >
            {loading ? "Entrando…" : "Entrar"}
            {!loading && (
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
          </button>
        </form>
      </div>
    </main>
  );
}