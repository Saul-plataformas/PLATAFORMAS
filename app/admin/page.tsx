"use client";

import { useState, useEffect } from "react";
import { 
  Users, Layers, Plus, Trash2, Key, RefreshCw, 
  ExternalLink, Calendar, CheckCircle2, AlertTriangle, ShieldCheck 
} from "lucide-react";

export default function AdminConsole() {
  const [activeTab, setActiveTab] = useState<"clients" | "products">("clients");
  const [loading, setLoading] = useState(true);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  // Modales
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  // Formulario Nuevo Cliente
  const [clientForm, setClientForm] = useState({
    full_name: "",
    email: "",
    password: "",
    platform_id: "",
    days: 30
  });

  // Formulario Nuevo Producto
  const [productForm, setProductForm] = useState({
    name: "",
    badge: "Activo • Entrega Inmediata",
    description: "",
    tags: "IA, Productividad",
    accent_color: "cyan",
    access_url: "https://chatgpt.com"
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/licenses/manage");
      const data = await res.json();
      if (data.platforms) setPlatforms(data.platforms);
      if (data.subscriptions) setSubscriptions(data.subscriptions);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let pass = "";
    for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    setClientForm({ ...clientForm, password: pass });
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/v1/licenses/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setShowClientModal(false);
      setClientForm({ full_name: "", email: "", password: "", platform_id: "", days: 30 });
      fetchData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/v1/licenses/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE_PLATFORM",
          ...productForm,
          tags: productForm.tags.split(",").map(t => t.trim())
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setShowProductModal(false);
      setProductForm({ name: "", badge: "Activo • Entrega Inmediata", description: "", tags: "IA, Productividad", accent_color: "cyan", access_url: "https://chatgpt.com" });
      fetchData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (id: string, type: "subscription" | "platform") => {
    if (!confirm(`¿Eliminar este ${type === "platform" ? "producto" : "acceso"} de forma permanente?`)) return;
    try {
      const res = await fetch(`/api/v1/licenses/manage?type=${type}&id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar");
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddDays = async (id: string, currentDays: number, delta: number) => {
    const newDays = Math.max(0, currentDays + delta);
    try {
      await fetch("/api/v1/licenses/manage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, days_remaining: newDays, status: newDays > 0 ? "active" : "expired" })
      });
      fetchData();
    } catch (err: any) {
      alert("Error al actualizar días");
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabecera Principal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> NexusGate Admin Engine
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Centro de Control de Licencias</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowClientModal(true); handleGeneratePassword(); }}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <Plus className="w-4 h-4" /> Nuevo Acceso Cliente
            </button>
            <button
              onClick={() => setShowProductModal(true)}
              className="bg-slate-800 hover:bg-slate-700 border border-white/10 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-400" /> Añadir Servicio
            </button>
            <button onClick={fetchData} className="p-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20">
              <RefreshCw className={`w-4 h-4 text-slate-400 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Selector de Pestañas */}
        <div className="flex gap-2 border-b border-white/5">
          <button
            onClick={() => setActiveTab("clients")}
            className={`pb-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "clients" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="w-4 h-4" /> Clientes & Suscripciones ({subscriptions.length})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "products" ? "border-emerald-400 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-4 h-4" /> Catálogo de Servicios IA ({platforms.length})
          </button>
        </div>

        {/* TABLA 1: Clientes y Suscripciones */}
        {activeTab === "clients" && (
          <div className="bg-[#0B101D] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0F172A] border-b border-white/10 text-slate-400 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Contraseña</th>
                    <th className="p-4">Servicio</th>
                    <th className="p-4">Días Restantes</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No hay clientes registrados en Supabase. Crea el primero arriba.
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-white">{sub.clients?.full_name}</div>
                          <div className="text-xs text-slate-400">{sub.clients?.email}</div>
                        </td>
                        <td className="p-4">
                          <code className="bg-slate-800 px-2 py-1 rounded text-cyan-300 font-mono text-xs">
                            {sub.clients?.password_hash}
                          </code>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-white/10">
                            {sub.platforms?.name || "Sin Asignar"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${sub.days_remaining > 5 ? "text-emerald-400" : "text-amber-400"}`}>
                              {sub.days_remaining} días
                            </span>
                            <div className="flex gap-1">
                              <button onClick={() => handleAddDays(sub.id, sub.days_remaining, 15)} className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-[10px] rounded text-slate-300">+15</button>
                              <button onClick={() => handleAddDays(sub.id, sub.days_remaining, 30)} className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-[10px] rounded text-slate-300">+30</button>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {sub.status === "active" && sub.days_remaining > 0 ? (
                            <span className="text-xs text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Activo
                            </span>
                          ) : (
                            <span className="text-xs text-rose-400 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Expirado
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDelete(sub.id, "subscription")}
                            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                            title="Eliminar Acceso"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TABLA 2: Catálogo de Servicios */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((p) => (
              <div key={p.id} className="bg-[#0B101D] border border-white/10 rounded-2xl p-6 relative group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-cyan-500/20">
                      {p.badge}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2">{p.name}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id, "platform")}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-all"
                    title="Eliminar Producto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tags?.map((t: string, i: number) => (
                    <span key={i} className="text-[11px] bg-slate-900 border border-white/5 text-slate-400 px-2 py-0.5 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-slate-500 border-t border-white/5 pt-3 flex justify-between items-center">
                  <span>URL Destino:</span>
                  <a href={p.access_url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                    {p.access_url.replace("https://", "")} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL: Nuevo Cliente */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D1322] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-1">Generar Nuevo Acceso</h2>
            <p className="text-xs text-slate-400 mb-6">Crea las credenciales que se entregarán al comprador.</p>

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={clientForm.full_name}
                  onChange={(e) => setClientForm({ ...clientForm, full_name: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Correo de Acceso</label>
                <input
                  type="email"
                  required
                  placeholder="cliente@correo.com"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-300">Contraseña Asignada</label>
                  <button type="button" onClick={handleGeneratePassword} className="text-cyan-400 text-xs hover:underline flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Generar otra
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={clientForm.password}
                    onChange={(e) => setClientForm({ ...clientForm, password: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-cyan-300 font-mono focus:border-cyan-400 outline-none"
                  />
                  <Key className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Servicio / Plataforma</label>
                <select
                  value={clientForm.platform_id}
                  onChange={(e) => setClientForm({ ...clientForm, platform_id: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-400 outline-none"
                >
                  <option value="">Selecciona un servicio...</option>
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Días de Vigencia</label>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 30, 60].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setClientForm({ ...clientForm, days: d })}
                      className={`py-1.5 rounded-lg text-xs font-semibold border ${
                        clientForm.days === d ? "bg-cyan-500/20 border-cyan-400 text-cyan-300" : "bg-slate-900 border-white/10 text-slate-400"
                      }`}
                    >
                      {d} días
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  Crear en Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Nuevo Producto */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D1322] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-1">Añadir Nuevo Servicio a la Vitrina</h2>
            <p className="text-xs text-slate-400 mb-6">Aparecerá automáticamente en la página principal.</p>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nombre del Servicio</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Runway Gen-3 / Midjourney"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Etiqueta de Estado (Badge)</label>
                <input
                  type="text"
                  required
                  value={productForm.badge}
                  onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Descripción de la Tarjeta</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Generación de video y efectos visuales de alta gama..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-400 outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Etiquetas (separadas por coma)</label>
                <input
                  type="text"
                  placeholder="Video, 4K, Cinematográfico"
                  value={productForm.tags}
                  onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">URL Oficial de Acceso</label>
                <input
                  type="url"
                  required
                  value={productForm.access_url}
                  onChange={(e) => setProductForm({ ...productForm, access_url: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-400 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Guardar Servicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
