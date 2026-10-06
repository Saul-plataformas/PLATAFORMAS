"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, MessageCircle, ArrowRight, ShieldCheck, Cpu, Globe2, Compass } from "lucide-react";

const MARQUEE_IMAGES_ROW1 = [
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=400",
];

const MARQUEE_IMAGES_ROW2 = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&q=80&w=400",
];

export default function LandingPage() {
  const [platforms, setPlatforms] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/v1/licenses/manage")
      .then((res) => res.json())
      .then((data) => {
        if (data.platforms && data.platforms.length > 0) {
          setPlatforms(data.platforms);
        }
      })
      .catch((err) => console.error("Error al cargar plataformas:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-amber-200 selection:text-stone-950 overflow-x-hidden">
      
      {/* 1. Header Flotante Estilo Editorial / Old Money */}
      <header className="sticky top-5 z-50 max-w-6xl mx-auto px-4">
        <nav className="backdrop-blur-xl bg-white/75 border border-stone-200/80 rounded-2xl px-7 py-3.5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-serif tracking-widest text-base font-semibold uppercase text-stone-900">
              NexusGate <span className="font-sans text-xs text-stone-400 font-normal tracking-normal">Core</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs tracking-wider uppercase font-medium text-stone-500">
            <span className="flex items-center gap-1.5 text-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Servidores Verificados • 18ms
            </span>
            <span className="text-stone-300">|</span>
            <span className="hover:text-stone-900 cursor-pointer transition">Infraestructura</span>
            <span className="hover:text-stone-900 cursor-pointer transition">Garantía</span>
          </div>

          <Link
            href="/portal"
            className="text-xs font-semibold tracking-wide bg-stone-900 hover:bg-stone-800 text-stone-50 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm"
          >
            Portal de Suscriptor <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </nav>
      </header>

      {/* 2. Hero Section con Galería de Imágenes Flotante de Fondo */}
      <section className="relative pt-12 pb-24 px-4 text-center overflow-hidden">
        
        {/* Carrusel de Imágenes en Movimiento (Filtro Claro y Suave) */}
        <div className="absolute inset-0 z-0 flex flex-col justify-center gap-4 opacity-35 pointer-events-none scale-105">
          <div className="flex gap-5 animate-[marquee_45s_linear_infinite] whitespace-nowrap">
            {[...MARQUEE_IMAGES_ROW1, ...MARQUEE_IMAGES_ROW1].map((img, i) => (
              <div key={i} className="w-72 h-40 rounded-2xl overflow-hidden flex-shrink-0 border border-stone-300/60 shadow-md">
                <img src={img} alt="AI Gallery" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="flex gap-5 animate-[marquee-reverse_50s_linear_infinite] whitespace-nowrap">
            {[...MARQUEE_IMAGES_ROW2, ...MARQUEE_IMAGES_ROW2].map((img, i) => (
              <div key={i} className="w-72 h-40 rounded-2xl overflow-hidden flex-shrink-0 border border-stone-300/60 shadow-md">
                <img src={img} alt="AI Gallery" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          {/* Velo degradado color crema para contraste óptimo */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/80 via-[#FDFBF7]/92 to-[#FDFBF7]" />
        </div>

        {/* Contenido Editorial del Hero */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 pt-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-800/15 bg-white/70 backdrop-blur-sm text-stone-700 text-xs font-medium tracking-widest uppercase">
            <Compass className="w-3.5 h-3.5 text-amber-700" /> Licenciamiento Corporativo de Precisión
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight leading-tight text-stone-900">
            Acceso exclusivo y <br />
            <span className="italic font-normal text-amber-900">licenciamiento seguro</span> a herramientas de IA
          </h1>

          <p className="text-sm md:text-base text-stone-600 max-w-2xl mx-auto font-light leading-relaxed">
            Entornos dedicados de alta velocidad para ChatGPT Pro, Gemini Ultra y Claude 3.5. Enrutamiento privado, estabilidad absoluta y entrega directa sin fricciones.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/portal"
              className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-medium text-sm px-7 py-3.5 rounded-xl flex items-center gap-2 shadow-md transition-all hover:shadow-lg"
            >
              Acceder a mi Licencia <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#catalogo"
              className="bg-white/80 hover:bg-white border border-stone-300/80 px-6 py-3.5 rounded-xl text-sm font-medium text-stone-700 transition-all shadow-sm"
            >
              Consultar Catálogo ↓
            </a>
          </div>
        </div>
      </section>

      {/* 3. Métricas de Confianza (Estilo Boutique) */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/60 border border-stone-200/80 rounded-2xl p-6 shadow-sm backdrop-blur-sm text-stone-800">
          <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-stone-200/70 pb-4 md:pb-0 md:pr-4">
            <ShieldCheck className="w-8 h-8 text-amber-800 flex-shrink-0" />
            <div>
              <div className="font-serif font-bold text-lg">99.9% Uptime</div>
              <div className="text-xs text-stone-500">Sesión persistente garantizada</div>
            </div>
          </div>
          <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-stone-200/70 pb-4 md:pb-0 md:pr-4">
            <Cpu className="w-8 h-8 text-amber-800 flex-shrink-0" />
            <div>
              <div className="font-serif font-bold text-lg">Proxy Dedicado</div>
              <div className="text-xs text-stone-500">Enrutamiento libre de caídas</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Globe2 className="w-8 h-8 text-amber-800 flex-shrink-0" />
            <div>
              <div className="font-serif font-bold text-lg">Entrega Inmediata</div>
              <div className="text-xs text-stone-500">Activación asistida 24/7</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Catálogo Conectado a Supabase (Tarjetas Blancas de Cristal) */}
      <section id="catalogo" className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-8 border-b border-stone-200/80 pb-4">
          <div>
            <span className="text-amber-800 text-xs font-semibold uppercase tracking-widest">Colección Seleccionada</span>
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-stone-900 mt-1">Servicios Disponibles</h2>
          </div>
          <span className="text-xs text-stone-400 tracking-wide font-light">Disponibilidad en tiempo real</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((p) => (
            <div
              key={p.id}
              className="bg-white/80 border border-stone-200/90 hover:border-amber-800/40 rounded-2xl p-7 transition-all duration-300 hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200/60 text-amber-900">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-medium tracking-wide px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                    {p.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-serif font-semibold text-stone-900 mb-2">{p.name}</h3>
                <p className="text-sm text-stone-600 mb-5 leading-relaxed font-light">{p.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {p.tags?.map((t: string, i: number) => (
                    <span key={i} className="text-[11px] bg-stone-50 border border-stone-200/80 text-stone-600 px-2.5 py-1 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-stone-100 pt-5">
                <a
                  href={`https://wa.me/59164695256?text=${encodeURIComponent(`Estimados, solicito información sobre la licencia corporativa de ${p.name}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-stone-900 hover:bg-stone-800 text-stone-50 font-medium py-3 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" /> Adquirir Licencia
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pie de Página Minimalista */}
      <footer className="border-t border-stone-200/80 mt-16 py-8 text-center text-xs text-stone-400 tracking-wider">
        © 2026 NEXUSGATE CORE • ARQUITECTURA PRIVADA DE IA
      </footer>
    </div>
  );
}
