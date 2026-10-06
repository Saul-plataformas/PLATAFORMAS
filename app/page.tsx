"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, MessageCircle, ArrowRight, Sun, Moon, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";

// Colección 1 de Logos Oficiales de IA & Producción Creativa
const SLIDE_1_LOGOS = {
  heroTitle: "NexusGate",
  heroSubtitle: "Acceso exclusivo y licenciamiento corporativo seguro a herramientas líderes de IA.",
  c1: { name: "ChatGPT", co: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg", tag: "LLM" },
  c2: { name: "Claude 3.5", co: "Anthropic", logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg", tag: "Coding" },
  c3: { name: "Leonardo AI", co: "Creative Engine", logo: "https://cdn.worldvectorlogo.com/logos/leonardo-ai.svg", tag: "Generación" },
  c4: { name: "Gemini Ultra", co: "Google AI", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg", tag: "Multimodal" },
  c5: { name: "Midjourney v6", co: "Visual Arts", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png", tag: "Design" },
  c6: { name: "Photoshop AI", co: "Adobe Firefly", logo: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg", tag: "Creative" },
  c7: { name: "Runway Gen-3", co: "Video Studio", logo: "https://cdn.worldvectorlogo.com/logos/runway-1.svg", tag: "Cinema" },
  c8: { name: "Cursor AI", co: "Anysphere", logo: "https://www.vectorlogo.zone/logos/cursor/cursor-icon.svg", tag: "Dev Suite" },
  c9: { name: "ElevenLabs", co: "Voice Engine", logo: "https://cdn.worldvectorlogo.com/logos/elevenlabs-1.svg", tag: "Audio" },
  c10: { name: "Perplexity", co: "AI Search", logo: "https://cdn.worldvectorlogo.com/logos/perplexity-ai.svg", tag: "Research" },
  c11: { name: "Canva Pro", co: "Design Suite", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg", tag: "Branding" },
};

// Colección 2 de Logos Oficiales de Producción & Suites Creativas
const SLIDE_2_LOGOS = {
  heroTitle: "Creative Studio",
  heroSubtitle: "Infraestructura privada y persistencia de sesión sin cortes para diseñadores y desarrolladores.",
  c1: { name: "Leonardo AI", co: "Canvas Studio", logo: "https://cdn.worldvectorlogo.com/logos/leonardo-ai.svg", tag: "Producción" },
  c2: { name: "Midjourney v6", co: "Imagen 8K", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png", tag: "Visual" },
  c3: { name: "ChatGPT Pro", co: "OpenAI Pro", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg", tag: "GPT-4o" },
  c4: { name: "Kling AI", co: "Cinematic Video", logo: "https://cdn.worldvectorlogo.com/logos/runway-1.svg", tag: "Motion" },
  c5: { name: "Claude 3.5 Sonnet", co: "Anthropic", logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg", tag: "Opus" },
  c6: { name: "Cursor Pro", co: "Code AI", logo: "https://www.vectorlogo.zone/logos/cursor/cursor-icon.svg", tag: "IDE" },
  c7: { name: "Photoshop & Firefly", co: "Adobe Creative", logo: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg", tag: "Edición" },
  c8: { name: "Gemini Pro", co: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg", tag: "DeepMind" },
  c9: { name: "ElevenLabs Prime", co: "Clonación Voz", logo: "https://cdn.worldvectorlogo.com/logos/elevenlabs-1.svg", tag: "Speech" },
  c10: { name: "Canva Studio", co: "Marketing", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg", tag: "Vector" },
  c11: { name: "Runway Pro", co: "VFX & AI", logo: "https://cdn.worldvectorlogo.com/logos/runway-1.svg", tag: "4K Render" },
};

const SLIDES = [SLIDE_1_LOGOS, SLIDE_2_LOGOS];

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
      .catch((err) => console.error("Error al cargar servicios:", err));
  }, []);

  const data = SLIDES[currentSlide];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  // Componente individual de Tarjeta Logo con interacción suave
  const LogoCard = ({ item, className = "" }: { item: any; className?: string }) => (
    <div
      className={`rounded-2xl md:rounded-3xl border p-4 flex flex-col justify-between group transition-all duration-500 ease-out hover:scale-95 cursor-pointer backdrop-blur-md shadow-sm ${
        isDark
          ? "bg-[#0E1424]/80 border-white/10 hover:border-cyan-500/40 hover:bg-[#131B30]"
          : "bg-white/80 border-stone-200 hover:border-cyan-600/40 hover:bg-white"
      } ${className}`}
    >
      <div className="flex justify-between items-start">
        <div
          className={`w-11 h-11 rounded-xl p-2 flex items-center justify-center border transition-transform duration-500 group-hover:scale-110 ${
            isDark ? "bg-white/10 border-white/10" : "bg-stone-50 border-stone-200"
          }`}
        >
          <img src={item.logo} alt={item.name} className="w-full h-full object-contain filter drop-shadow-sm" />
        </div>
        <span
          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            isDark ? "bg-white/5 border-white/10 text-cyan-300" : "bg-stone-100 border-stone-200 text-stone-700"
          }`}
        >
          {item.tag}
        </span>
      </div>

      <div>
        <h4 className="text-sm font-bold tracking-tight text-current truncate">{item.name}</h4>
        <p className="text-[11px] opacity-60 truncate">{item.co}</p>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isDark ? "bg-[#07090E] text-stone-100" : "bg-[#FDFBF7] text-stone-900"
      }`}
    >
      {/* 1. Header Minimalista: Logo + Botón de Asistencia + Sesión */}
      <header className="sticky top-4 z-50 max-w-7xl mx-auto px-4">
        <nav
          className={`border rounded-full px-6 py-2.5 flex items-center justify-between backdrop-blur-xl shadow-lg transition-colors ${
            isDark ? "bg-[#0E131F]/90 border-white/10" : "bg-white/90 border-stone-200"
          }`}
        >
          {/* Logo Principal */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-extrabold tracking-wider text-sm">NexusGate</span>
          </div>

          {/* Acciones Derecha (Asistencia, Tema, Portal) */}
          <div className="flex items-center gap-2.5">
            {/* Botón Directo de Asistencia Técnica */}
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

            {/* Alternador de Modo Claro / Oscuro */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-full border transition-all ${
                isDark ? "bg-white/5 border-white/10 text-amber-300" : "bg-stone-100 border-stone-200 text-stone-700"
              }`}
              title="Cambiar tema"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Botón de Acceso al Cockpit / Portal */}
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

      {/* 2. MOSAICO INTERACTIVO DE LOGOS DE IA & PRODUCCIÓN */}
      <main className="max-w-7xl mx-auto px-4 pt-6 pb-20 space-y-16">
        <section className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 auto-rows-[130px] md:auto-rows-[150px]">
            {/* Fila 1 */}
            <LogoCard item={data.c1} />
            <LogoCard item={data.c2} />
            <LogoCard item={data.c3} className="col-span-2" />
            <LogoCard item={data.c4} />
            <LogoCard item={data.c5} />

            {/* Fila 2 (CON HERO CARD CENTRAL ENORME) */}
            <LogoCard item={data.c6} className="col-span-2 md:col-span-1" />

            {/* Tarjeta Central Destacada */}
            <div
              className={`col-span-2 md:col-span-4 row-span-1 rounded-2xl md:rounded-3xl border relative flex flex-col items-center justify-center text-center p-6 shadow-2xl transition-all duration-700 backdrop-blur-xl ${
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

            <LogoCard item={data.c7} className="col-span-2 md:col-span-1" />

            {/* Fila 3 */}
            <LogoCard item={data.c8} />
            <LogoCard item={data.c9} />
            <LogoCard item={data.c10} />
            <LogoCard item={data.c11} />
            <LogoCard item={data.c3} className="col-span-2" />
          </div>

          {/* Paginador Inferior (< ••• >) */}
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

        {/* 3. CATÁLOGO CONECTADO A SUPABASE EN TIEMPO REAL */}
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
