"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, MessageCircle, ArrowRight, Shield, Cpu, Zap } from "lucide-react";

export default function LandingPage() {
  const [platforms, setPlatforms] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/v1/licenses/manage")
      .then((res) => res.json())
      .then((data) => {
        if (data.platforms) setPlatforms(data.platforms);
      })
      .catch((err) => console.error("Error al cargar catálogo:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Barra de Navegación Flotante */}
      <header className="sticky top-4 z-50 max-w-6xl mx-auto px-4">
        <nav className="backdrop-blur-xl bg-slate-900/60 border border-white/10 rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-extrabold tracking-wider text-sm">NEXUSGATE // CORE</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Servidores en línea • 18ms
            </span>
          </div>

          <Link
            href="/portal"
            className="text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all"
          >
            Portal de Suscriptor <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </nav>
      </header>

      {/* Hero Principal */}
      <section className="relative pt-20 pb-16 px-4 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" /> INFRAESTRUCTURA PRIVADA • LICENCIAMIENTO 2026
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Acceso corporativo y{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400">
              licenciamiento seguro
            </span>{" "}
            a herramientas de IA
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
            Conectividad garantizada, enrutamiento por proxy dedicado y sesiones persistentes para equipos de alto rendimiento. Activa tus herramientas sin fricción operativa.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/portal"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all"
            >
              Acceder a mi Licencia <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#catalogo"
              className="bg-slate-900/80 hover:bg-slate-800 border border-white/10 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
            >
              Explorar Catálogo ↓
            </a>
          </div>
        </div>
      </section>

      {/* Catálogo Dinámico de Servicios */}
      <section id="catalogo" className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
          <div>
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Catálogo Activo</span>
            <h2 className="text-2xl font-bold text-white mt-1">Herramientas Listas para Despliegue</h2>
          </div>
          <span className="text-xs text-slate-500">Actualizado en tiempo real</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((p) => (
            <div
              key={p.id}
              className="bg-[#0B101D] border border-white/10 hover:border-cyan-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800/80 text-emerald-400 border border-emerald-500/20">
                    {p.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{p.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{p.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {p.tags?.map((t: string, i: number) => (
                    <span key={i} className="text-xs bg-slate-900/60 border border-white/5 text-slate-400 px-2.5 py-1 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5 pt-4">
                <a
                  href={`https://wa.me/591XXXXXXXX?text=${encodeURIComponent(`Hola, me interesa adquirir la licencia de ${p.name}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-slate-900 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-cyan-300 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" /> Solicitar Licencia Directa
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
