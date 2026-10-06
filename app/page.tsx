"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, MessageCircle, ArrowRight, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";

// Sets de imágenes para el mosaico interactivo
const MOSAIC_SETS = [
  {
    heroTitle: "NexusGate",
    heroSubtitle: "Acceso exclusivo y licenciamiento seguro a herramientas líderes de IA.",
    c1: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800", // Abstract Wave
    c2: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800", // Valley
    c3: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200", // Tech / Sky wide
    c4: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800", // Diver/Fish
    c5: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800", // White Horse
    centerBg: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1200", // Castle / Moody
    c6: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=800", // Mountain rocks
    c7: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800", // Cat
    c8: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800", // Portrait Blue
    c9: "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&q=80&w=800", // Penguin
    c10: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800", // Classic Flowers
    c11: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800", // Sunrise Beach
  },
  {
    heroTitle: "Studio AI",
    heroSubtitle: "Despliega modelos avanzados con enrutamiento proxy dedicado y cero fricción.",
    c1: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800",
    c2: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&q=80&w=800",
    c3: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    c4: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    c5: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800",
    centerBg: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1200",
    c6: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    c7: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
    c8: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    c9: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800",
    c10: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800",
    c11: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=800",
  }
];

export default function LandingPage() {
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [isDark, setIsDark] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<"inicio" | "ayuda">("inicio");

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

  const data = MOSAIC_SETS[currentSlide];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % MOSAIC_SETS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + MOSAIC_SETS.length) % MOSAIC_SETS.length);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      isDark ? "bg-[#07090E] text-stone-100" : "bg-[#FDFBF7] text-stone-900"
    }`}>
      
      {/* 1. Header Minimalista Tipo Píldora */}
      <header className="sticky top-4 z-50 max-w-7xl mx-auto px-4">
        <nav className={`border rounded-full px-6 py-2.5 flex items-center justify-between backdrop-blur-xl shadow-lg transition-colors ${
          isDark ? "bg-[#0E131F]/90 border-white/10" : "bg-white/90 border-stone-200"
        }`}>
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" /> NexusGate
            </span>
          </div>

          {/* Selector de Pestañas Flotante Central */}
          <div className={`flex items-center gap-1 p-1 rounded-full border text-xs font-semibold ${
            isDark ? "bg-[#161D2E] border-white/10" : "bg-stone-100 border-stone-200"
          }`}>
            <button
              onClick={() => setActiveTab("inicio")}
              className={`px-5 py-1.5 rounded-full transition-all ${
                activeTab === "inicio"
                  ? isDark ? "bg-white text-black shadow-sm" : "bg-stone-900 text-white shadow-sm"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => setActiveTab("ayuda")}
              className={`px-5 py-1.5 rounded-full transition-all ${
                activeTab === "ayuda"
                  ? isDark ? "bg-white text-black shadow-sm" : "bg-stone-900 text-white shadow-sm"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              Ayuda & Soporte
            </button>
          </div>

          {/* Acciones Derecha */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-full border transition-all ${
                isDark ? "bg-white/5 border-white/10 text-amber-300" : "bg-stone-100 border-stone-200 text-stone-700"
              }`}
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

      {/* VISTA 1: INICIO (Mosaico Interactivo) */}
      {activeTab === "inicio" && (
        <main className="max-w-7xl mx-auto px-4 pt-6 pb-20 space-y-16">
          
          {/* CUADRÍCULA MOSAICO ESTILO FLOW / LABS */}
          <section className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 auto-rows-[130px] md:auto-rows-[160px]">
              
              {/* Fila 1 */}
              <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 group relative">
                <img src={data.c1} alt="Card" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-95 group-hover:rotate-1" />
              </div>
              <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 group relative">
                <img src={data.c2} alt="Card" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-95" />
              </div>
              <div className="col-span-2 overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 group relative">
                <img src={data.c3} alt="Card" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-95" />
              </div>
              <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 group relative">
                <img src={data.c4} alt="Card" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-95" />
              </div>
              <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 group relative">
                <img src={data.c5} alt="Card" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-95" />
              </div>

              {/* Fila 2 (CON TARJETA CENTRAL ENORME) */}
              <div className="col-span-2 md:col-span-1 overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 group relative">
                <img src={data.c5} alt="Card" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-95" />
              </div>

              {/* HERO CENTRAL (Card destacada ancha) */}
              <div className="col-span-2 md:col-span-4 row-span-1 overflow-hidden rounded-2xl md:rounded-3xl border border-white/15 relative flex flex-col items-center justify-center text-center p-6 shadow-2xl group">
                <img 
                  src={data.centerBg} 
                  alt="Center Background" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 opacity-40" 
                />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                <div className="relative z-10 space-y-2 max-w-md">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
                    {data.heroTitle}
                  </h1>
                  <p className="text-xs md:text-sm text-stone-200 font-light">
                    {data.heroSubtitle}
                  </p>
                </div>
              </div>

              <div className="col-span-2 md:col-span-1 overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 group relative">
                <img src={data.c6} alt="Card" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-95" />
              </div>

              {/* Fila 3 */}
              <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 group relative">
                <img src={data.c7} alt="Card" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-95" />
              </div>
              <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 group relative">
                <img src={data.c8} alt="Card" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-95" />
              </div>
              <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 group relative">
                <img src={data.c9} alt="Card" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-95" />
              </div>
              <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 group relative">
                <img src={data.c10} alt="Card" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-95" />
              </div>
              <div className="col-span-2 overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 group relative">
                <img src={data.c11} alt="Card" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-95" />
              </div>

            </div>

            {/* Controles del Paginador Inferior (< ••• >) */}
            <div className="flex items-center justify-center gap-3 pt-3">
              <button 
                onClick={prevSlide}
                className={`p-2 rounded-full border transition-all ${
                  isDark ? "bg-[#111622] border-white/10 hover:bg-white/10" : "bg-white border-stone-200 hover:bg-stone-100"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {MOSAIC_SETS.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full cursor-pointer transition-all ${
                      currentSlide === idx 
                        ? "w-6 bg-cyan-400" 
                        : "w-2 bg-stone-500/40 hover:bg-stone-500"
                    }`}
                  />
                ))}
              </div>

              <button 
                onClick={nextSlide}
                className={`p-2 rounded-full border transition-all ${
                  isDark ? "bg-[#111622] border-white/10 hover:bg-white/10" : "bg-white border-stone-200 hover:bg-stone-100"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* CATÁLOGO DE SERVICIOS CONECTADO A SUPABASE */}
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
                      <div className={`p-2.5 rounded-xl border ${
                        isDark ? "bg-white/5 border-white/10 text-cyan-400" : "bg-stone-50 border-stone-200 text-cyan-700"
                      }`}>
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        isDark ? "bg-white/5 border-white/10 text-stone-300" : "bg-stone-100 border-stone-200 text-stone-700"
                      }`}>
                        {p.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-2">{p.name}</h3>
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

                  <div className="border-t pt-4 border-white/5">
                    <a
                      href={`https://wa.me/59164695256?text=${encodeURIComponent(`Hola, me interesa adquirir la licencia de ${p.name}`)}`}
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
      )}

      {/* VISTA 2: AYUDA & SOPORTE TÉCNICO (Estilo Capturas) */}
      {activeTab === "ayuda" && (
        <main className="max-w-4xl mx-auto px-4 pt-8 pb-20 space-y-6">
          <div className="text-center space-y-2 mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Centro de Asistencia & Respuestas Rápidas
            </span>
            <h1 className="text-3xl font-extrabold">¿Cómo podemos ayudarte hoy?</h1>
            <p className="text-xs text-stone-400">Soluciones inmediatas para resolver incidencias de acceso, configuración y dispositivos.</p>
          </div>

          {/* Tarjeta de Privacidad Blindada */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? "bg-[#0D121F] border-white/10" : "bg-white border-stone-200 shadow-sm"
          }`}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base">Se Respeta al 100% tu Privacidad</h3>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Blindaje Total</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Tus conversaciones, documentos subidos, prompts y proyectos son <strong className="text-stone-200">estrictamente privados y confidenciales</strong>. No monitoreamos ni almacenamos tus sesiones y bajo ninguna circunstancia se comparten datos con terceros.
                </p>
              </div>
            </div>
          </div>

          {/* Grid de 4 Casos de Soporte Frecuentes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Caso 1: Dispositivo no autorizado */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
              isDark ? "bg-[#0D121F] border-white/10" : "bg-white border-stone-200 shadow-sm"
            }`}>
              <div>
                <span className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider">Seguridad de Cuenta</span>
                <h4 className="text-base font-bold mt-1 mb-2">Dispositivo No Autorizado</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Solo se permite <strong>un equipo por cuenta</strong>. Si cambiaste de computadora, formateaste tu sistema o cambiaste de navegador, contacta con la palabra <strong>"liberar"</strong> para habilitar tu nuevo equipo.
                </p>
              </div>
              <a
                href="https://wa.me/59164695256?text=liberar"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-xs text-center transition-all"
              >
                Enviar "liberar" por WhatsApp ➔
              </a>
            </div>

            {/* Caso 2: No Inicia Sesión */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
              isDark ? "bg-[#0D121F] border-white/10" : "bg-white border-stone-200 shadow-sm"
            }`}>
              <div>
                <span className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider">Resolución de Conflictos</span>
                <h4 className="text-base font-bold mt-1 mb-2">¿No Inicia Sesión?</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Evita conflictos con tus otras cuentas personales. En <strong>Google Chrome</strong> o <strong>Microsoft Edge</strong>, haz clic en tu foto arriba a la derecha y selecciona <strong>"+ Añadir perfil"</strong> para ingresar con un entorno limpio.
                </p>
              </div>
              <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 pt-2">
                ✓ Aísla cookies y caché de sesiones previas
              </div>
            </div>

            {/* Caso 3: Uso en Android */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
              isDark ? "bg-[#0D121F] border-white/10" : "bg-white border-stone-200 shadow-sm"
            }`}>
              <div>
                <span className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider">Móvil & Tablets</span>
                <h4 className="text-base font-bold mt-1 mb-2">Uso en Teléfonos Android</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Puedes acceder desde tu celular descargando <strong>Kiwi Browser</strong> o <strong>Lemur Browser</strong> desde Google Play Store y cargando la extensión de sesión proporcionada.
                </p>
              </div>
              <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 pt-2">
                ✓ Compatible con smartphones y tablets Android
              </div>
            </div>

            {/* Caso 4: Prompt Engineering */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
              isDark ? "bg-[#0D121F] border-white/10" : "bg-white border-stone-200 shadow-sm"
            }`}>
              <div>
                <span className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider">Capacitación</span>
                <h4 className="text-base font-bold mt-1 mb-2">Soporte Operativo Directo</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  ¿Dudas sobre cómo configurar tu extensión o cómo aprovechar al máximo tu suscripción? Escríbenos directamente y te asistimos paso a paso.
                </p>
              </div>
              <a
                href="https://wa.me/59164695256?text=Hola,%20necesito%20soporte%20tecnico"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5 rounded-xl text-xs text-center transition-all"
              >
                Contactar a Soporte ➔
              </a>
            </div>

          </div>

          {/* Bloque WhatsApp Flotante Destacado */}
          <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
            isDark ? "bg-[#0D121F] border-white/10" : "bg-white border-stone-200 shadow-sm"
          }`}>
            <div>
              <h3 className="font-bold text-base">¿Tienes alguna otra duda o consulta técnica?</h3>
              <p className="text-xs text-stone-400">Atención técnica personalizada directa en Bolivia.</p>
            </div>
            <a
              href="https://wa.me/59164695256"
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-6 py-3 rounded-xl flex items-center gap-2 text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp (+591 64695256)
            </a>
          </div>

        </main>
      )}

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs opacity-50 tracking-wider border-white/10">
        © 2026 NEXUSGATE CORE • INFRAESTRUCTURA PRIVADA
      </footer>

    </div>
  );
}
