"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Download, ExternalLink, Key, User, CheckCircle2, Lock } from "lucide-react";

export default function SubscriberPortal() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/v1/licenses/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok || !data.valid) {
        throw new Error(data.error || "Credenciales inválidas");
      }

      setSession(data);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 1. Pantalla de Inicio de Sesión si no está autenticado
  if (!session) {
    return (
      <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-center items-center p-4 font-sans">
        <div className="w-full max-w-md bg-[#0D1322] border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-2 border border-cyan-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Cockpit de Licencia</h1>
            <p className="text-xs text-slate-400">Ingresa tus credenciales para acceder a tus herramientas autorizadas.</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Correo de Acceso</label>
              <input
                type="email"
                required
                placeholder="cliente@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Contraseña</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] text-sm disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Ingresar a mi Cockpit ➔"}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              ← Volver al sitio principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Cockpit Dinámico del Cliente
  const daysTotal = 30;
  const daysRemaining = session.suscripcion?.days_remaining || 0;
  const progressPercent = Math.min(100, Math.round((daysRemaining / daysTotal) * 100));

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 p-6 md:p-12 font-sans selection:bg-cyan-500 selection:text-black">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Barra Superior */}
        <div className="flex justify-between items-center border-b border-white/10 pb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-extrabold tracking-wider text-sm">NEXUSGATE // CORE</span>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Sesión segura activa
          </span>
        </div>

        {/* Saludo con NOMBRE REAL y BADGE DINÁMICO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Cockpit de Licencia</span>
            {/* Aquí imprime el nombre real del cliente */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
              Hola, {session.usuario?.full_name || session.usuario?.email}
            </h1>
            <p className="text-sm text-slate-400 mt-1">Aquí tienes todo lo necesario para activar y utilizar tu acceso corporativo.</p>
          </div>

          {/* Insignia dinámica con el servicio real asignado */}
          <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-sm font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            {session.suscripcion?.plan || "Servicio Autorizado"}
          </span>
        </div>

        {/* Tarjetas de Métricas de Días */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-[#0B101D] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Balance de Suscripción</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            
            <div className="text-3xl font-extrabold text-white">
              {daysRemaining} <span className="text-slate-500 text-lg font-normal">/ {daysTotal} días restantes</span>
            </div>

            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">Renovación y enrutamiento administrados automáticamente.</p>
          </div>

          <div className="bg-[#0B101D] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Estado de Acceso</span>
            <div>
              <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-lg">
                <ShieldCheck className="w-5 h-5" /> Activo y Verificado
              </div>
              <p className="text-xs text-slate-500 mt-1">Conectividad directa sin restricciones.</p>
            </div>
          </div>
        </div>

        {/* Tarjeta de Credenciales */}
        <div className="bg-[#0B101D] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <User className="w-4 h-4 text-cyan-400" /> Credenciales Asignadas para {session.suscripcion?.plan}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
              <span className="text-[11px] text-slate-500 block uppercase mb-1">Correo de Usuario</span>
              <code className="text-sm text-cyan-300 font-mono">{email}</code>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
              <span className="text-[11px] text-slate-500 block uppercase mb-1">Contraseña Activa</span>
              <code className="text-sm text-slate-300 font-mono">••••••••••••</code>
            </div>
          </div>
        </div>

        {/* Botón de Descarga y Acceso */}
        <div className="bg-[#0B101D] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base">Extensión de Conexión Automática</h3>
            <p className="text-xs text-slate-400">Descarga el paquete .zip de la extensión para iniciar sesión en 1 clic.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href="/extension.zip"
              download
              className="flex-1 md:flex-initial bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <Download className="w-4 h-4" /> Descargar extensión (.zip)
            </a>
            {session.access_url && (
              <a
                href={session.access_url}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-white/10 hover:text-cyan-400 transition-colors"
                title="Ir a la plataforma oficial"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
