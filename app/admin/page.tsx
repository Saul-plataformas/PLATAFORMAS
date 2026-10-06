"use client";

import { useState, useEffect } from "react";
import { 
  Users, Layers, Server, Plus, Trash2, Key, RefreshCw, 
  ExternalLink, ShieldCheck, CheckCircle2, AlertTriangle, Sun, Moon 
} from "lucide-react";

export default function AdminConsole() {
  const [activeTab, setActiveTab] = useState<"clients" | "proxies" | "products">("clients");
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [proxies, setProxies] = useState<any[]>([]);

  // Modales
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showProxyModal, setShowProxyModal] = useState(false);

  // Formularios
  const [clientForm, setClientForm] = useState({
    full_name: "",
    email: "",
    password: "",
    platform_id: "",
    proxy_id: "",
    days: 30
  });

  const [productForm, setProductForm] = useState({
    name: "",
    badge: "Activo • Entrega Inmediata",
    description: "",
    tags: "IA, Pro",
    accent_color: "amber",
    access_url: "https://chatgpt.com"
  });

  const [proxyForm, setProxyForm] = useState({
    name: "",
    host: "",
    port: 8080,
    username: "",
    password: "",
    max_users: 5
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/licenses/manage");
      const data = await res.json();
      if (data.platforms) setPlatforms(data.platforms);
      if (data.subscriptions) setSubscriptions(data.subscriptions);
      if (data.proxies) setProxies(data.proxies);
    } catch (err) {
      console.error(err);
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
      setClientForm({ full_name: "", email: "", password: "", platform_id: "", proxy_id: "", days: 30 });
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
      setProductForm({ name: "", badge: "Activo • Entrega Inmediata", description: "", tags: "IA, Pro", accent_color: "amber", access_url: "https://chatgpt.com" });
      fetchData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleCreateProxy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/v1/licenses/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE_PROXY",
          ...proxyForm
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setShowProxyModal(false);
      setProxyForm({ name: "", host: "", port: 8080, username: "", password: "", max_users: 5 });
      fetchData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (id: string, type: "subscription" | "platform" | "proxy") => {
    if (!confirm("¿Eliminar este registro permanentemente?")) return;
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
      alert("Error actualizando días");
    }
  };

  return (
    <div className={`min-h-screen p-6 md:p-10 font-sans transition-colors duration-300 ${
      isDark ? "bg-[#0A0D14] text-stone-100" : "bg-[#FDFBF7] text-stone-900"
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabecera Combinada */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 ${
          isDark ? "border-white/10" : "border-stone-200"
        }`}>
          <div>
            <div className="flex items-center gap-2 text-amber-600 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> NexusGate Admin Console
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight">Gestión de Licencias & Proxies</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Alternador de Modo */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2.5 rounded-xl border transition-all ${
                isDark ? "bg-white/5 border-white/10 text-amber-300" : "bg-white border-stone-200 text-stone-700 shadow-sm"
              }`}
              title="Cambiar tema"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => { setShowClientModal(true); handleGeneratePassword(); }}
              className={`text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
                isDark ? "bg-stone-100 text-stone-950 hover:bg-white" : "bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-sm"
              }`}
            >
              <Plus className="w-4 h-4" /> Nuevo Cliente
            </button>

            <button
              onClick={() => setShowProxyModal(true)}
              className={`text-xs font-medium px-4 py-2.5 rounded-xl border transition-all ${
                isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-stone-200 hover:bg-stone-50 shadow-sm"
              }`}
            >
              <Server className="w-4 h-4 text-cyan-600 inline mr-1" /> Añadir Proxy
            </button>

            <button
              onClick={() => setShowProductModal(true)}
              className={`text-xs font-medium px-4 py-2.5 rounded-xl border transition-all ${
                isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-stone-200 hover:bg-stone-50 shadow-sm"
              }`}
            >
              <Plus className="w-4 h-4 text-emerald-600 inline mr-1" /> Añadir Servicio
            </button>

            <button onClick={fetchData} className={`p-2.5 rounded-xl border ${
              isDark ? "bg-white/5 border-white/10" : "bg-white border-stone-200 shadow-sm"
            }`}>
              <RefreshCw className={`w-4 h-4 opacity-70 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <div className={`flex gap-2 border-b ${isDark ? "border-white/10" : "border-stone-200"}`}>
          <button
            onClick={() => setActiveTab("clients")}
            className={`pb-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "clients" ? "border-amber-600 text-amber-600 font-semibold" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Users className="w-4 h-4" /> Clientes ({subscriptions.length})
          </button>
          <button
            onClick={() => setActiveTab("proxies")}
            className={`pb-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "proxies" ? "border-amber-600 text-amber-600 font-semibold" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Server className="w-4 h-4" /> Proxies & Nodos ({proxies.length})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "products" ? "border-amber-600 text-amber-600 font-semibold" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Layers className="w-4 h-4" /> Servicios Activos ({platforms.length})
          </button>
        </div>

        {/* CONTENIDO 1: Clientes */}
        {activeTab === "clients" && (
          <div className={`border rounded-2xl overflow-hidden shadow-sm ${
            isDark ? "bg-[#111622]/80 border-white/10" : "bg-white border-stone-200"
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className={`border-b text-xs uppercase tracking-wider ${
                  isDark ? "bg-[#0E131E] border-white/10 text-stone-400" : "bg-stone-50 border-stone-200 text-stone-500"
                }`}>
                  <tr>
                    <th className="p-4">Cliente (Nombre Real)</th>
                    <th className="p-4">Contraseña</th>
                    <th className="p-4">Servicio</th>
                    <th className="p-4">Nodo / Proxy</th>
                    <th className="p-4">Días Restantes</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-stone-100"}`}>
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center opacity-50">
                        No hay clientes registrados en Supabase.
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map((sub) => (
                      <tr key={sub.id} className={isDark ? "hover:bg-white/5" : "hover:bg-stone-50"}>
                        <td className="p-4">
                          <div className="font-semibold">{sub.clients?.full_name}</div>
                          <div className="text-xs opacity-60">{sub.clients?.email}</div>
                        </td>
                        <td className="p-4">
                          <code className={`px-2 py-1 rounded font-mono text-xs ${
                            isDark ? "bg-white/10 text-amber-300" : "bg-stone-100 text-amber-800"
                          }`}>
                            {sub.clients?.password_hash}
                          </code>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                            isDark ? "bg-white/5 border-white/10 text-stone-200" : "bg-stone-100 border-stone-200 text-stone-800"
                          }`}>
                            {sub.platforms?.name || "Sin Asignar"}
                          </span>
                        </td>
                        <td className="p-4">
                          {sub.proxies ? (
                            <span className="text-xs font-mono opacity-80">
                              {sub.proxies.name} ({sub.proxies.host}:{sub.proxies.port})
                            </span>
                          ) : (
                            <span className="text-xs opacity-40">Directo</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-emerald-600">{sub.days_remaining} días</span>
                            <div className="flex gap-1">
                              <button onClick={() => handleAddDays(sub.id, sub.days_remaining, 15)} className="px-1.5 py-0.5 border rounded text-[10px] opacity-70 hover:opacity-100">+15</button>
                              <button onClick={() => handleAddDays(sub.id, sub.days_remaining, 30)} className="px-1.5 py-0.5 border rounded text-[10px] opacity-70 hover:opacity-100">+30</button>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {sub.status === "active" && sub.days_remaining > 0 ? (
                            <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Activo
                            </span>
                          ) : (
                            <span className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                              <AlertTriangle className="w-3.5 h-3.5" /> Expirado
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDelete(sub.id, "subscription")}
                            className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                            title="Eliminar Cliente"
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

        {/* CONTENIDO 2: Proxies */}
        {activeTab === "proxies" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proxies.map((prx) => (
              <div key={prx.id} className={`border rounded-2xl p-6 relative ${
                isDark ? "bg-[#111622]/80 border-white/10" : "bg-white border-stone-200 shadow-sm"
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      prx.is_full ? "bg-rose-500/10 text-rose-600 border-rose-500/20" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    }`}>
                      {prx.is_full ? "Lleno" : "Disponible"}
                    </span>
                    <h3 className="text-base font-serif font-bold mt-2">{prx.name}</h3>
                  </div>
                  <button onClick={() => handleDelete(prx.id, "proxy")} className="text-rose-500 p-1.5 hover:bg-rose-500/10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className={`p-3 rounded-xl border mb-3 font-mono text-xs space-y-1 ${
                  isDark ? "bg-white/5 border-white/5" : "bg-stone-50 border-stone-200"
                }`}>
                  <div>Host: <span className="font-semibold">{prx.host}</span></div>
                  <div>Puerto: <span className="font-semibold">{prx.port}</span></div>
                </div>

                <div className="space-y-1.5 border-t pt-3 border-stone-200/40">
                  <div className="flex justify-between text-xs opacity-75">
                    <span>Cupos ocupados:</span>
                    <span className="font-bold">{prx.used_slots} / {prx.max_users}</span>
                  </div>
                  <div className="w-full bg-stone-200/50 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${prx.is_full ? "bg-rose-500" : "bg-amber-600"}`}
                      style={{ width: `${Math.min(100, (prx.used_slots / prx.max_users) * 100)}%` }}
                    />
                  </div>
                  <div className="text-right text-[11px] text-emerald-600 font-semibold">
                    {prx.available_slots} libres
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONTENIDO 3: Servicios */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((p) => (
              <div key={p.id} className={`border rounded-2xl p-6 relative ${
                isDark ? "bg-[#111622]/80 border-white/10" : "bg-white border-stone-200 shadow-sm"
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                      {p.badge}
                    </span>
                    <h3 className="text-lg font-serif font-bold mt-2">{p.name}</h3>
                  </div>
                  <button onClick={() => handleDelete(p.id, "platform")} className="text-rose-500 p-1.5 hover:bg-rose-500/10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs opacity-70 mb-4 line-clamp-2">{p.description}</p>
                <div className="text-xs border-t pt-3 border-stone-200/40 flex justify-between items-center opacity-60">
                  <span>URL:</span>
                  <a href={p.access_url} target="_blank" rel="noreferrer" className="text-amber-600 hover:underline flex items-center gap-1">
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2xl w-full max-w-md p-6 shadow-2xl ${
            isDark ? "bg-[#111622] border-white/10" : "bg-white border-stone-200"
          }`}>
            <h2 className="text-lg font-serif font-bold mb-1">Generar Acceso Cliente</h2>
            <p className="text-xs opacity-60 mb-5">Ingresa los datos para registrar la suscripción.</p>

            <form onSubmit={handleCreateClient} className="space-y-3.5 text-sm">
              <div>
                <label className="text-xs font-semibold block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={clientForm.full_name}
                  onChange={(e) => setClientForm({ ...clientForm, full_name: e.target.value })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  placeholder="cliente@correo.com"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold">Contraseña Asignada</label>
                  <button type="button" onClick={handleGeneratePassword} className="text-amber-600 text-xs hover:underline flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Nueva clave
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={clientForm.password}
                  onChange={(e) => setClientForm({ ...clientForm, password: e.target.value })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm font-mono text-amber-600 outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Servicio / Herramienta</label>
                <select
                  required
                  value={clientForm.platform_id}
                  onChange={(e) => setClientForm({ ...clientForm, platform_id: e.target.value })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-600"
                >
                  <option value="">Selecciona la herramienta...</option>
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id} className="text-black">{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Asignar Proxy</label>
                <select
                  value={clientForm.proxy_id}
                  onChange={(e) => setClientForm({ ...clientForm, proxy_id: e.target.value })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-600"
                >
                  <option value="">Sin proxy (Conexión Directa)</option>
                  {proxies.map((prx) => (
                    <option key={prx.id} value={prx.id} disabled={prx.is_full} className="text-black">
                      {prx.name} ({prx.available_slots} libres) {prx.is_full ? "[LLENO]" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Días de Vigencia</label>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 30, 60].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setClientForm({ ...clientForm, days: d })}
                      className={`py-1.5 rounded-lg text-xs font-semibold border ${
                        clientForm.days === d ? "bg-amber-600 text-white border-amber-600" : "border-stone-300 opacity-60"
                      }`}
                    >
                      {d} días
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="flex-1 py-2.5 rounded-xl border opacity-60 hover:opacity-100 text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-sm"
                >
                  Crear Acceso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Nuevo Proxy */}
      {showProxyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2xl w-full max-w-md p-6 shadow-2xl ${
            isDark ? "bg-[#111622] border-white/10" : "bg-white border-stone-200"
          }`}>
            <h2 className="text-lg font-serif font-bold mb-1">Añadir Servidor Proxy</h2>
            <p className="text-xs opacity-60 mb-5">Configura el host y el límite de cuentas.</p>

            <form onSubmit={handleCreateProxy} className="space-y-3.5 text-sm">
              <div>
                <label className="text-xs font-semibold block mb-1">Nombre Identificador</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Proxy US Residencial 1"
                  value={proxyForm.name}
                  onChange={(e) => setProxyForm({ ...proxyForm, name: e.target.value })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-xs font-semibold block mb-1">Host / IP</label>
                  <input
                    type="text"
                    required
                    placeholder="198.51.100.112"
                    value={proxyForm.host}
                    onChange={(e) => setProxyForm({ ...proxyForm, host: e.target.value })}
                    className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Puerto</label>
                  <input
                    type="number"
                    required
                    value={proxyForm.port}
                    onChange={(e) => setProxyForm({ ...proxyForm, port: Number(e.target.value) })}
                    className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Capacidad Máxima de Cuentas</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  required
                  value={proxyForm.max_users}
                  onChange={(e) => setProxyForm({ ...proxyForm, max_users: Number(e.target.value) })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProxyModal(false)}
                  className="flex-1 py-2.5 rounded-xl border opacity-60 hover:opacity-100 text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-sm"
                >
                  Guardar Proxy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Nuevo Servicio */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2xl w-full max-w-md p-6 shadow-2xl ${
            isDark ? "bg-[#111622] border-white/10" : "bg-white border-stone-200"
          }`}>
            <h2 className="text-lg font-serif font-bold mb-1">Añadir Nuevo Servicio</h2>
            <p className="text-xs opacity-60 mb-5">Se mostrará en la vitrina pública.</p>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-sm">
              <div>
                <label className="text-xs font-semibold block mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. ChatGPT Pro / Runway Gen-3"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Descripción Breve</label>
                <textarea
                  required
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">URL de Destino</label>
                <input
                  type="url"
                  required
                  value={productForm.access_url}
                  onChange={(e) => setProductForm({ ...productForm, access_url: e.target.value })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-2.5 rounded-xl border opacity-60 hover:opacity-100 text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-sm"
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
