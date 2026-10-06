"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, MessageCircle, Sun, Moon, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";

// Configuración de Marcas con sus Colores Oficiales e Isotipos Centrales
const BRAND_STYLES: Record<string, { bg: string; border: string; text: string; badgeBg: string; badgeText: string; icon: React.ReactNode }> = {
  chatgpt: {
    bg: "bg-gradient-to-br from-[#10A37F] to-[#0A6B53]",
    border: "border-[#10A37F]/60",
    text: "text-white",
    badgeBg: "bg-black/25",
    badgeText: "text-emerald-100",
    icon: (
      <svg viewBox="0 0 24 24" className="w-16 h-16 md:w-20 md:h-20 fill-white drop-shadow-md">
        <path d="M22.28 9.37a5.99 5.99 0 0 0-.52-4.93 6.07 6.07 0 0 0-6.6-2.73A6.08 6.08 0 0 0 10.3 0a6.07 6.07 0 0 0-5.8 4.25 6.06 6.06 0 0 0-3.9 2.84 6.06 6.06 0 0 0 .73 7.15 6 6 0 0 0 .52 4.93 6.07 6.07 0 0 0 6.6 2.73A6.04 6.04 0 0 0 13.24 24a6.07 6.07 0 0 0 5.8-4.25 6.06 6.06 0 0 0 3.9-2.84 6.06 6.06 0 0 0-.66-7.54ZM13.7 22.38a4.57 4.57 0 0 1-2.9-.66l.15-.08 4.8-2.77a.75.75 0 0 0 .38-.65v-6.78l2.03 1.17v5.6a4.58 4.58 0 0 1-4.46 4.17Zm-8.4-3.4a4.54 4.54 0 0 1-.67-2.92l.14.09 4.8 2.77a.74.74 0 0 0 .76 0l5.88-3.39v2.35l-4.85 2.8a4.58 4.58 0 0 1-6.06-1.7ZM2.25 9.77a4.54 4.54 0 0 1 2.23-2.27v5.7a.73.73 0 0 0 .38.65l5.87 3.39-2.03 1.17-4.85-2.8a4.58 4.58 0 0 1-1.6-5.84Zm15.93 1.7-5.88-3.4 2.03-1.16 4.85 2.8a4.58 4.58 0 0 1 1.6 5.83 4.55 4.55 0 0 1-2.22 2.28v-5.7a.74.74 0 0 0-.38-.65Zm2.7-2.65-.15-.08-4.8-2.78a.74.74 0 0 0-.75 0L9.3 9.35V7l4.85-2.8a4.58 4.58 0 0 1 6.72 4.62ZM8.03 10.4 10.06 9.23l4.85 2.8v2.34l-4.85 2.8-2.03-1.17V10.4Z"/>
      </svg>
    ),
  },
  claude: {
    bg: "bg-gradient-to-br from-[#D97706] to-[#92400E]",
    border: "border-[#D97706]/60",
    text: "text-white",
    badgeBg: "bg-black/25",
    badgeText: "text-amber-100",
    icon: (
      <svg viewBox="0 0 24 24" className="w-16 h-16 md:w-20 md:h-20 fill-white drop-shadow-md">
        <path d="m14.73 3.6-6.4 16.8h3.3l1.3-3.6h5.8l1.3 3.6h3.3L16.93 3.6h-2.2Zm-1.1 10.8 2.2-6.2 2.2 6.2h-4.4ZM2.53 16.2l3.4-9.1h3.1l-3.4 9.1H2.53Z"/>
      </svg>
    ),
  },
  leonardo: {
    bg: "bg-gradient-to-br from-[#A21CAF] via-[#701A75] to-[#4C0519]",
    border: "border-fuchsia-400/50",
    text: "text-white",
    badgeBg: "bg-black/30",
    badgeText: "text-fuchsia-200",
    icon: (
      <svg viewBox="0 0 24 24" className="w-16 h-16 md:w-20 md:h-20 fill-white drop-shadow-lg">
        <path d="M12 2L2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  gemini: {
    bg: "bg-gradient-to-br from-[#1D4ED8] via-[#2563EB] to-[#1E3A8A]",
    border: "border-blue-400/60",
    text: "text-white",
    badgeBg: "bg-black/25",
    badgeText: "text-blue-100",
    icon: (
      <svg viewBox="0 0 24 24" className="w-16 h-16 md:w-20 md:h-20 fill-white drop-shadow-md">
        <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12Z"/>
      </svg>
    ),
  },
  midjourney: {
    bg: "bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0284C7]",
    border: "border-sky-400/50",
    text: "text-white",
    badgeBg: "bg-black/30",
    badgeText: "text-sky-200",
    icon: (
      <svg viewBox="0 0 24 24" className="w-16 h-16 md:w-20 md:h-20 fill-white drop-shadow-md">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 15-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9Z"/>
      </svg>
    ),
  },
  photoshop: {
    bg: "bg-gradient-to-br from-[#001E36] to-[#001122]",
    border: "border-[#00A8FF]/60",
    text: "text-white",
    badgeBg: "bg-[#00A8FF]/20",
    badgeText: "text-[#00A8FF]",
    icon: (
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#001428] border-2 border-[#00A8FF] flex items-center justify-center font-black text-4xl md:text-5xl text-[#00A8FF] shadow-2xl font-sans tracking-tight">
        Ps
      </div>
    ),
  },
  runway: {
    bg: "bg-gradient-to-br from-[#7C3AED] to-[#4C1D95]",
    border: "border-purple-400/50",
    text: "text-white",
    badgeBg: "bg-black/30",
    badgeText: "text-purple-200",
    icon: (
      <svg viewBox="0 0 24 24" className="w-16 h-16 md:w-20 md:h-20 fill-white drop-shadow-md">
        <path d="M4 4h4v16H4V4Zm6 0h4v16h-4V4Zm6 0h4v16h-4V4Z"/>
      </svg>
    ),
  },
  cursor: {
    bg: "bg-gradient-to-br from-[#0284C7] to-[#0369A1]",
    border: "border-sky-300/50",
    text: "text-white",
    badgeBg: "bg-black/25",
    badgeText: "text-sky-100",
    icon: (
      <svg viewBox="0 0 24 24" className="w-16 h-16 md:w-20 md:h-20 fill-white drop-shadow-md">
        <path d="M3 2l10 17 3-6 6-3L3 2Z"/>
      </svg>
    ),
  },
  elevenlabs: {
    bg: "bg-gradient-to-br from-[#EA580C] to-[#C2410C]",
    border: "border-orange-300/50",
    text: "text-white",
    badgeBg: "bg-black/25",
    badgeText: "text-orange-100",
    icon: (
      <div className="flex gap-2 items-center justify-center h-16 md:h-20">
        <span className="w-3.5 md:w-4 h-12 bg-white rounded-full animate-pulse shadow-md" />
        <span className="w-3.5 md:w-4 h-16 bg-white rounded-full shadow-md" />
        <span className="w-3.5 md:w-4 h-10 bg-white/90 rounded-full shadow-md" />
      </div>
    ),
  },
  perplexity: {
    bg: "bg-gradient-to-br from-[#0F766E] to-[#115E59]",
    border: "border-teal-300/50",
    text: "text-white",
    badgeBg: "bg-black/25",
    badgeText: "text-teal-100",
    icon: (
      <svg viewBox="0 0 24 24" className="w-16 h-16 md:w-20 md:h-20 fill-white drop-shadow-md">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 14.93V15a1 1 0 0 1 2 0v1.93A8 8 0 0 1 7.07 13H9a1 1 0 0 1 0 2H7.07A8 8 0 0 1 11 8.07V10a1 1 0 0 1 2 0V8.07A8 8 0 0 1 18.93 12H17a1 1 0 0 1 0-2h1.93A8 8 0 0 1 13 16.93Z"/>
      </svg>
    ),
  },
  canva: {
    bg: "bg-gradient-to-br from-[#00C4CC] via-[#00A3A8] to-[#7D2AE8]",
    border: "border-cyan-200/50",
    text: "text-white",
    badgeBg: "bg-black/25",
    badgeText: "text-cyan-100",
    icon: (
      <span className="font-serif italic font-black text-6xl md:text-7xl text-white select-none drop-shadow-lg">
        C
      </span>
    ),
  },
};

const SLIDES = [
  {
    heroTitle: "NexusGate",
    heroSubtitle: "Acceso corporativo y licenciamiento persistente a modelos líderes de Inteligencia Artificial.",
    c1: { id: "chatgpt", name: "ChatGPT Pro", tag: "OpenAI" },
    c2: { id: "claude", name: "Claude 3.5", tag: "Anthropic" },
    c3: { id: "leonardo", name: "Leonardo AI", tag: "Production" },
    c4: { id: "gemini", name: "Gemini Ultra", tag: "Google" },
    c5: { id: "midjourney", name: "Midjourney v6", tag: "Creative" },
    c6: { id: "photoshop", name: "Photoshop AI", tag: "Adobe" },
    c7: { id: "runway", name: "Runway Gen-3", tag: "Cinema" },
    c8: { id: "cursor", name: "Cursor AI", tag: "Dev" },
    c9: { id: "elevenlabs", name: "ElevenLabs", tag: "Voice" },
    c10: { id: "perplexity", name: "Perplexity", tag: "Search" },
    c11: { id: "canva", name: "Canva Pro", tag: "Design" },
  },
  {
    heroTitle: "Creative Core",
    heroSubtitle: "Suites de producción visual, animación y desarrollo enrutadas por proxies dedicados.",
    c1: { id: "canva", name: "Canva Pro", tag: "Design" },
    c2: { id: "leonardo", name: "Leonardo AI", tag: "Production" },
    c3: { id: "midjourney", name: "Midjourney v6", tag: "Creative" },
    c4: { id: "chatgpt", name: "ChatGPT Pro", tag: "OpenAI" },
    c5: { id: "claude", name: "Claude 3.5", tag: "Anthropic" },
    c6: { id: "runway", name: "Runway Gen-3", tag: "Cinema" },
    c7: { id: "cursor", name: "Cursor AI", tag: "Dev" },
    c8: { id: "photoshop", name: "Photoshop AI", tag: "Adobe" },
    c9: { id: "gemini", name: "Gemini Ultra", tag: "Google" },
    c10: { id: "elevenlabs", name: "ElevenLabs", tag: "Voice" },
    c11: { id: "perplexity", name: "Perplexity", tag: "Search" },
  }
];

export default function LandingPage() {
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [isDark, setIsDark] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const data = SLIDES[currentSlide];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  // Tarjeta de Color Oficial con Isotipo Prominente
  const FullColorCard = ({ item, className = "" }: { item: any; className?: string }) => {
    const brand = BRAND_STYLES[item.id] || BRAND_STYLES.chatgpt;

    return (
      <div
        className={`rounded-2xl md:rounded-3xl border p-4 flex flex-col items-center justify-between relative group transition-all duration-500 ease-out hover:scale-95 cursor-pointer shadow-xl overflow-hidden ${brand.bg} ${brand.border} ${brand.text} ${className}`}
      >
        {/* Etiqueta superior */}
        <div className="w-full flex justify-end">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-sm ${brand.badgeBg} ${brand.badgeText}`}>
            {item.tag}
          </span>
        </div>

        {/* Isotipo Centrado en Tamaño Completo */}
        <div className="flex-1 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 py-1">
          {brand.icon}
        </div>

        {/* Nombre de la Herramienta al pie */}
        <div className="text-center w-full">
          <h4 className="text-sm md:text-base font-bold tracking-tight truncate drop-shadow-sm">
            {item.name}
          </h4>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isDark ? "bg-[#07090E] text-stone-100" : "bg-[#FDFBF7] text-stone-900"
      }`}
    >
      {/* 1. Header Minimalista */}
      <header className="sticky top-4 z-50 max-w-7xl mx-auto px-4">
        <nav
          className={`border rounded-full px-6 py-2.5 flex items-center justify-between backdrop-blur-xl shadow-lg transition-colors ${
            isDark ? "bg-[#0E131F]/90 border-white/10" : "bg-white/90 border-stone-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-extrabold tracking-wider text-sm">NexusGate</span>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="https://wa.me/59164695256?text=Hola,%20solicito%20asistencia%20tecnica%20con%20mi%20licencia"
              target="_blank"
              rel="noreferrer"
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 transition-all ${
                isDark
                  ? "bg-white/5 border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-stone-300 hover:text-emerald-300"
                  : "bg-stone-50 border-stone-200 hover:bg-emerald-50 hover:border-emerald-200 text-stone-700 hover:text-emerald-700"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" /> Asistencia 24/7
            </a>

            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-full border transition-all ${
                isDark ? "bg-white/5 border-white/10 text-amber-300" : "bg-stone-100 border-stone-200 text-stone-700"
              }`}
              title="Cambiar tema"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/portal"
              className={`text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 transition-all shadow-sm ${
                isDark ? "bg-white text-black hover:bg-stone-200" : "bg-stone-900 text-white hover:bg-stone-800"
              }`}
            >
              Iniciar Sesión ➔
            </Link>
          </div>
        </nav>
      </header>

      {/* 2. Mosaico Interactivo a Color Completo */}
      <main className="max-w-7xl mx-auto px-4 pt-6 pb-20 space-y-16">
        <section className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 auto-rows-[160px] md:auto-rows-[180px]">
            {/* Fila 1 */}
            <FullColorCard item={data.c1} />
            <FullColorCard item={data.c2} />
            <FullColorCard item={data.c3} className="col-span-2" />
            <FullColorCard item={data.c4} />
            <FullColorCard item={data.c5} />

            {/* Fila 2 (Con Tarjeta Central Destacada) */}
            <FullColorCard item={data.c6} className="col-span-2 md:col-span-1" />

            <div
              className={`col-span-2 md:col-span-4 row-span-1 rounded-2xl md:rounded-3xl border relative flex flex-col items-center justify-center text-center p-6 shadow-2xl transition-all duration-700 backdrop-blur-2xl ${
                isDark
                  ? "bg-gradient-to-br from-[#0F1626] to-[#0A0E18] border-white/15"
                  : "bg-gradient-to-br from-white to-stone-100 border-stone-200"
              }`}
            >
              <div className="space-y-2 max-w-md relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Infraestructura 2026
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-current">{data.heroTitle}</h1>
                <p className="text-xs md:text-sm opacity-75 font-light leading-relaxed">{data.heroSubtitle}</p>
              </div>
            </div>

            <FullColorCard item={data.c7} className="col-span-2 md:col-span-1" />

            {/* Fila 3 */}
            <FullColorCard item={data.c8} />
            <FullColorCard item={data.c9} />
            <FullColorCard item={data.c10} />
            <FullColorCard item={data.c11} />
            <FullColorCard item={data.c3} className="col-span-2" />
          </div>

          {/* Paginador Inferior */}
          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              onClick={prevSlide}
              className={`p-2 rounded-full border transition-all ${
                isDark ? "bg-[#111622] border-white/10 hover:bg-white/10" : "bg-white border-stone-200 hover:bg-stone-100"
              }`}
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {SLIDES.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full cursor-pointer transition-all ${
                    currentSlide === idx ? "w-6 bg-cyan-400" : "w-2 bg-stone-500/40 hover:bg-stone-500"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className={`p-2 rounded-full border transition-all ${
                isDark ? "bg-[#111622] border-white/10 hover:bg-white/10" : "bg-white border-stone-200 hover:bg-stone-100"
              }`}
              title="Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* 3. Catálogo Conectado a Supabase */}
        <section id="catalogo" className="space-y-6 pt-4">
          <div className="flex justify-between items-end border-b pb-4 border-white/10">
            <div>
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Catálogo Activo</span>
              <h2 className="text-2xl font-bold mt-1">Servicios Disponibles</h2>
            </div>
            <span className="text-xs opacity-50">Entrega Inmediata</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platforms.map((p) => (
              <div
                key={p.id}
                className={`border rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between ${
                  isDark
                    ? "bg-[#0D121F] border-white/10 hover:border-cyan-500/40 shadow-xl"
                    : "bg-white border-stone-200 hover:border-cyan-600/40 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div
                      className={`p-2.5 rounded-xl border ${
                        isDark ? "bg-white/5 border-white/10 text-cyan-400" : "bg-stone-50 border-stone-200 text-cyan-700"
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        isDark
                          ? "bg-white/5 border-white/10 text-stone-300"
                          : "bg-stone-100 border-stone-200 text-stone-700"
                      }`}
                    >
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                  <p className={`text-sm mb-4 leading-relaxed font-light ${isDark ? "text-stone-400" : "text-stone-600"}`}>
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {p.tags?.map((t: string, i: number) => (
                      <span
                        key={i}
                        className={`text-[11px] px-2 py-0.5 rounded-md border ${
                          isDark
                            ? "bg-white/5 border-white/5 text-stone-400"
                            : "bg-stone-50 border-stone-200 text-stone-600"
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 border-white/5">
                  <a
                    href={`https://wa.me/59164695256?text=${encodeURIComponent(
                      `Hola, me interesa adquirir la licencia de ${p.name}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`w-full font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all shadow-sm ${
                      isDark
                        ? "bg-cyan-500 text-black hover:bg-cyan-400"
                        : "bg-stone-900 text-white hover:bg-stone-800"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" /> Solicitar Acceso Directo
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Minimalista */}
      <footer className="border-t py-6 text-center text-xs opacity-50 tracking-wider border-white/10">
        © 2026 NEXUSGATE CORE • INFRAESTRUCTURA PRIVADA
      </footer>
    </div>
  );
}
