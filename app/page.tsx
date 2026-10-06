"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, MessageCircle, ArrowRight, Sun, Moon, Sparkle } from "lucide-react";

// Logos e imágenes de marcas líderes de IA y Edición Creativa
const AI_BRANDS_ROW1 = [
  { name: "ChatGPT Pro", tag: "OpenAI", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400" },
  { name: "Claude 3.5 Sonnet", tag: "Anthropic", img: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=400" },
  { name: "Gemini Ultra", tag: "Google DeepMind", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400" },
  { name: "Midjourney v6", tag: "Creative Studio", img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=400" },
  { name: "Runway Gen-3", tag: "Video AI", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400" },
];

const AI_BRANDS_ROW2 = [
  { name: "Photoshop & Firefly", tag: "Adobe Creative", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" },
  { name: "Kling AI", tag: "Cinematic Video", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=400" },
  { name: "Cursor AI", tag: "Coding Suite", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400" },
  { name: "ElevenLabs", tag: "Voice Engine", img: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&q=80&w=400" },
  { name: "Canva Pro Suite", tag: "Design Studio", img: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=400" },
];

export default function LandingPage() {
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    fetch("/api/v1/licenses/manage")
      .then((res) => res.json())
      .then((data) => {
        if (data.platforms && data.platforms.length > 0) {
          setPlatforms(data.platforms);
        }
      })
      .catch((err) => console.error("Error cargando servicios:", err));
  }, []);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 overflow-x-hidden ${
      isDark ? "bg-[#0A0D14] text-stone-100" : "bg-[#FDFBF7] text-stone-900"
    }`}>
      
      {/* 1. Header Limpio y Simplificado */}
      <header className="sticky top-5 z-50 max-w-5xl mx-auto px-4">
        <nav className={`backdrop-blur-xl border rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-sm transition-colors ${
          isDark ? "bg-[#111622]/80 border-white/10" : "bg-white/80 border-stone-200"
        }`}>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-serif tracking-widest text-base font-semibold uppercase">
              NexusGate <span className="font-sans text-xs opacity-50 font-normal tracking-normal">Core</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Botón Modo Claro / Oscuro */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-xl border transition-all ${
                isDark 
                  ? "bg-white/5 border-white/10 text-amber-300 hover:bg-white/10" 
                  : "bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200"
              }`}
              title="Cambiar Modo Claro / Oscuro"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/portal"
              className={`text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
                isDark 
                  ? "bg-stone-100 hover:bg-white text-stone-950 shadow-sm" 
                  : "bg-stone-900 hover:bg-stone-800 text-stone-50 shadow-sm"
              }`}
            >
              Portal de Suscriptor <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </nav>
      </header>

      {/* 2. Hero con Carrusel de Marcas de IA en Rotación */}
      <section className="relative pt-10 pb-20 px-4 text-center overflow-hidden">
        
        {/* Carrusel en Movimiento con Tarjetas de IA */}
        <div className={`absolute inset-0 z-0 flex flex-col justify-center gap-4 pointer-events-none scale-105 transition-opacity ${
          isDark ? "opacity-25" : "opacity-35"
        }`}>
          <div className="flex gap-4 animate-[marquee_45s_linear_infinite] whitespace-nowrap">
            {[...AI_BRANDS_ROW1, ...AI_BRANDS_ROW1].map((item, i) => (
              <div key={i} className={`w-64 h-32 rounded-2xl overflow-hidden flex-shrink-0 border relative shadow-sm ${
                isDark ? "border-white/10 bg-[#161D2E]" : "border-stone-300/70 bg-white"
              }`}>
                <img src={item.img} alt={item.name} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end text-left text-white">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-amber-300">{item.tag}</span>
                  <span className="text-xs font-bold font-serif">{item.name}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 animate-[marquee-reverse_50s_linear_infinite] whitespace-nowrap">
            {[...AI_BRANDS_ROW2, ...AI_BRANDS_ROW2].map((item, i) => (
              <div key={i} className={`w-64 h-32 rounded-2xl overflow-hidden flex-shrink-0 border relative shadow-sm ${
                isDark ? "border-white/10 bg-[#161D2E]" : "border-stone-300/70 bg-white"
              }`}>
                <img src={item.img} alt={item.name} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end text-left text-white">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-cyan-300">{item.tag}</span>
                  <span className="text-xs font-bold font-serif">{item.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Velo translúcido para contraste */}
          <div className={`absolute inset-0 transition-colors ${
            isDark 
              ? "bg-gradient-to-b from-[#0A0D14]/85 via-[#0A0D14]/95 to-[#0A0D14]" 
              : "bg-gradient-to-b from-[#FDFBF7]/85 via-[#FDFBF7]/95 to-[#FDFBF7]"
          }`} />
        </div>

        {/* Textos del Hero */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-6 pt-6">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium tracking-widest uppercase transition-colors ${
            isDark 
              ? "bg-white/5 border-white/10 text-stone-300" 
              : "bg-white/80 border-stone-300/80 text-stone-700 shadow-sm"
          }`}>
            <Sparkle className="w-3.5 h-3.5 text-amber-500" /> Licenciamiento Directo & Exclusivo
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight leading-tight">
            Acceso corporativo y <br />
            <span className="italic font-normal text-amber-600">licenciamiento seguro</span> a herramientas de IA
          </h1>

          <p className={`text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed ${
            isDark ? "text-stone-400" : "text-stone-600"
          }`}>
            Conexión inmediata a modelos líderes de inteligencia artificial y suites de diseño con sesiones estables y soporte directo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/portal"
              className={`text-sm font-medium px-6 py-3 rounded-xl flex items-center gap-2 shadow-sm transition-all ${
                isDark 
                  ? "bg-stone-100 hover:bg-white text-stone-950" 
                  : "bg-stone-900 hover:bg-stone-800 text-stone-50"
              }`}
            >
              Acceder a mi Licencia <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#catalogo"
              className={`text-sm font-medium px-5 py-3 rounded-xl border transition-all ${
                isDark 
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-stone-200" 
                  : "bg-white border-stone-300/80 hover:bg-stone-50 text-stone-700 shadow-sm"
              }`}
            >
              Ver Servicios ↓
            </a>
          </div>
        </div>
      </section>

      {/* 3. Catálogo Conectado a Supabase */}
      <section id="catalogo" className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-end mb-6 border-b pb-4 border-stone-200/50">
          <div>
            <span className="text-amber-600 text-xs font-semibold uppercase tracking-widest">Catálogo Disponible</span>
            <h2 className="text-2xl font-serif font-semibold mt-1">Servicios Activos</h2>
          </div>
          <span className="text-xs opacity-50">Entrega Inmediata</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((p) => (
            <div
              key={p.id}
              className={`border rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between ${
                isDark 
                  ? "bg-[#111622]/80 border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-black/40" 
                  : "bg-white/90 border-stone-200 hover:border-amber-600/40 hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2.5 rounded-xl border ${
                    isDark ? "bg-white/5 border-white/10 text-amber-400" : "bg-stone-50 border-stone-200 text-amber-700"
                  }`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                    isDark ? "bg-white/5 border-white/10 text-stone-300" : "bg-stone-100 border-stone-200 text-stone-700"
                  }`}>
                    {p.badge}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-semibold mb-2">{p.name}</h3>
                <p className={`text-sm mb-4 leading-relaxed font-light ${isDark ? "text-stone-400" : "text-stone-600"}`}>
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {p.tags?.map((t: string, i: number) => (
                    <span key={i} className={`text-[11px] px-2 py-0.5 rounded-md border ${
                      isDark ? "bg-white/5 border-white/5 text-stone-400" : "bg-stone-50 border-stone-200 text-stone-600"
                    }`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 border-stone-200/40">
                <a
                  href={`https://wa.me/59164695256?text=${encodeURIComponent(`Hola, solicito información sobre la licencia de ${p.name}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all ${
                    isDark 
                      ? "bg-white text-stone-950 hover:bg-stone-200 shadow-sm" 
                      : "bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-sm"
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500" /> Solicitar Acceso
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className="border-t mt-12 py-6 text-center text-xs opacity-50 tracking-wider border-stone-200/40">
        © 2026 NEXUSGATE CORE
      </footer>
    </div>
  );
}
