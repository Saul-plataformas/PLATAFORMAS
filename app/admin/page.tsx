"use client";

import { useState, useEffect } from "react";
import { 
  Users, Layers, Server, Plus, Trash2, Key, RefreshCw, 
  ExternalLink, ShieldCheck, CheckCircle2, AlertTriangle, Sun, Moon 
} from "lucide-react";

export default function AdminConsole() {
  const [activeTab, setActiveTab] = useState<"clients" | "accounts" | "proxies" | "products">("clients");
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [proxies, setProxies] = useState<any[]>([]);
  const [masterAccounts, setMasterAccounts] = useState<any[]>([]);

  // Modales
  const [showClientModal, setShowClientModal] = useState(false);
  const [showMasterModal, setShowMasterModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showProxyModal, setShowProxyModal] = useState(false);

  // Formularios
  const [clientForm, setClientForm] = useState({
    full_name: "",
    email: "",
    password: "",
    platform_id: "",
    master_account_id: "",
    proxy_id: "",
    days: 30
  });

  const [masterForm, setMasterForm] = useState({
    platform_id: "",
    account_name: "",
    email: "",
    password: "",
    totp_seed: "",
    max_users: 5
  });

  const [productForm, setProductForm] = useState({
    name: "",
    badge: "Activo • Entrega Inmediata",
    description: "",
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
      if (data.master_accounts) setMasterAccounts(data.master_accounts);
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
      setClientForm({ full_name: "", email: "", password: "", platform_id: "", master_account_id: "", proxy_id: "", days: 30 });
      fetchData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleCreateMaster = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/v1/licenses/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CREATE_MASTER_ACCOUNT", ...masterForm })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setShowMasterModal(false);
      setMasterForm({ platform_id: "", account_name: "", email: "", password: "", totp_seed: "", max_users: 5 });
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
        body: JSON.stringify({ action: "CREATE_PLATFORM", ...productForm })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setShowProductModal(false);
      setProductForm({ name: "", badge: "Activo • Entrega Inmediata", description: "", access_url: "https://chatgpt.com" });
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
        body: JSON.stringify({ action: "CREATE_PROXY", ...proxyForm })
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

  const handleDelete = async (id: string, type: "subscription" | "platform" | "proxy" | "master_account") => {
    if (!confirm("¿Eliminar este registro permanentemente?")) return;
    try {
      const res = await fetch(`/api/v1/licenses/manage?type=${type}&id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar");
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Filtrar cuentas matrices según el servicio seleccionado en el formulario del cliente
  const filteredAccountsForClient = masterAccounts.filter(
    (acc) => acc.platform_id === clientForm.platform_id
  );

  return (
    <div className={`min-h-screen p-6 md:p-10 font-sans transition-colors duration-300 ${
      isDark ? "bg-[#0A0D14] text-stone-100" : "bg-[#FDFBF7] text-stone-900"
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabecera */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 ${
          isDark ? "border-white/10" : "border-stone-200"
        }`}>
          <div>
            <div className="flex items-center gap-2 text-amber-600 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> NexusGate Admin Console
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight">Gestión de Cuentas Matrices & Licencias</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2.5 rounded-xl border transition-all ${
                isDark ? "bg-white/5 border-white/10 text-amber-300" : "bg-white border-stone-200 text-stone-700 shadow-sm"
              }`}
              title="Cambiar tema"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* BOTÓN NUEVO: Añadir Cuenta Matriz */}
            <button
              onClick={() => setShowMasterModal(true)}
              className="text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white shadow-sm"
            >
              <Key className="w-4 h-4" /> + Añadir Cuenta Matriz
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

        {/* Pestañas */}
        <div className={`flex gap-2 border-b ${isDark ? "border-white/10" : "border-stone-200"}`}>
          <button
            onClick={() => setActiveTab("clients")}
            className={`pb-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "clients" ? "border-amber-600 text-amber-600 font-semibold" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Users className="w-4 h-4" /> Clientes ({subscriptions.length})
          </button>

          {/* PESTAÑA NUEVA: Cuentas Matrices con Contador */}
          <button
            onClick={() => setActiveTab("accounts")}
            className={`pb-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "accounts" ? "border-amber-600 text-amber-600 font-semibold" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Key className="w-4 h-4" /> Cuentas Matrices ({masterAccounts.length})
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
            <Layers className="w-4 h-4" /> Servicios ({platforms.length})
          </button>
        </div>

        {/* TAB 1: Clientes */}
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
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Contraseña</th>
                    <th className="p-4">Servicio</th>
                    <th className="p-4">Cuenta Matriz Asignada</th>
                    <th className="p-4">Días Restantes</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-stone-100"}`}>
                  {subscriptions.length === 0 ? (
                    <tr><td colSpan={7} className="p-8 text-center opacity-50">No hay clientes registrados.</td></tr>
                  ) : (
                    subscriptions.map((sub) => (
                      <tr key={sub.id} className={isDark ? "hover:bg-white/5" : "hover:bg-stone-50"}>
                        <td className="p-4">
                          <div className="font-semibold">{sub.clients?.full_name}</div>
                          <div className="text-xs opacity-60">{sub.clients?.email}</div>
                        </td>
                        <td className="p-4">
                          <code className="px-2 py-1 rounded font-mono text-xs bg-stone-100 dark:bg-white/10 text-amber-600">
                            {sub.clients?.password_hash}
                          </code>
                        </td>
                        <td className="p-4 font-semibold text-cyan-600">{sub.platforms?.name}</td>
                        <td className="p-4">
                          {sub.master_accounts ? (
                            <span className="text-xs font-mono font-medium text-amber-500">
                              {sub.master_accounts.account_name} ({sub.master_accounts.email})
                            </span>
                          ) : (
                            <span className="text-xs text-rose-500 italic">Sin cuenta asignada</span>
                          )}
                        </td>
                        <td className="p-4 font-bold text-emerald-600">{sub.days_remaining} días</td>
                        <td className="p-4">
                          <span className="text-xs text-emerald-600 font-medium">Activo</span>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => handleDelete(sub.id, "subscription")} className="text-rose-500 p-1.5 hover:bg-rose-500/10 rounded-lg">
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

        {/* TAB 2: Cuentas Matrices con Contador en Tiempo Real */}
        {activeTab === "accounts" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {masterAccounts.length === 0 ? (
              <div className="col-span-3 p-12 text-center opacity-50 border rounded-2xl">
                No has agregado ninguna cuenta matriz todavía. Haz clic en <strong>+ Añadir Cuenta Matriz</strong> arriba.
              </div>
            ) : (
              masterAccounts.map((acc) => (
                <div key={acc.id} className={`border rounded-2xl p-6 relative ${
                  isDark ? "bg-[#111622]/80 border-white/10" : "bg-white border-stone-200 shadow-sm"
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        {acc.platforms?.name}
                      </span>
                      <h3 className="text-base font-bold mt-2">{acc.account_name}</h3>
                    </div>
                    <button onClick={() => handleDelete(acc.id, "master_account")} className="text-rose-500 p-1.5 hover:bg-rose-500/10 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className={`p-3 rounded-xl border text-xs font-mono space-y-1.5 mb-4 ${
  isDark 
    ? "bg-black/60 border-white/10 text-slate-200" 
    : "bg-stone-100 border-stone-200 text-stone-800"
}`}>
  <div>Email: <span className="font-semibold text-cyan-400">{acc.email}</span></div>
  <div>Clave: <span className="text-slate-400">••••••••••</span></div>
  <div>2FA / TOTP: <span className={acc.totp_seed ? "text-emerald-400 font-semibold" : "text-slate-500"}>
    {acc.totp_seed ? "Configurado ✔" : "No"}
  </span></div>
</div>

                  {/* Contador de Usuarios Asignados */}
                  <div className="space-y-1.5 border-t pt-3 border-stone-200/40">
                    <div className="flex justify-between text-xs">
                      <span className="opacity-75">Clientes en esta cuenta:</span>
                      <span className="font-bold text-amber-600">{acc.used_slots} / {acc.max_users}</span>
                    </div>
                    <div className="w-full bg-stone-200/50 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${acc.is_full ? "bg-rose-500" : "bg-amber-600"}`}
                        style={{ width: `${Math.min(100, (acc.used_slots / acc.max_users) * 100)}%` }}
                      />
                    </div>
                    <div className="text-right text-[11px] text-emerald-600 font-semibold">
                      {acc.available_slots} cupos libres
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

     {/* TAB 3: Proxies */}
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
                    <h3 className="text-base font-bold mt-2">{prx.name}</h3>
                  </div>
                  <button onClick={() => handleDelete(prx.id, "proxy")} className="text-rose-500 p-1.5 hover:bg-rose-500/10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Recuadro de Host y Puerto con contraste corregido */}
                <div className={`p-3 rounded-xl border mb-3 font-mono text-xs space-y-1 ${
                  isDark 
                    ? "bg-black/60 border-white/10 text-slate-200" 
                    : "bg-stone-100 border-stone-200 text-stone-800"
                }`}>
                  <div>Host: <span className="font-semibold text-cyan-400">{prx.host}</span></div>
                  <div>Puerto: <span className="font-semibold text-amber-400">{prx.port}</span></div>
                </div>

                <div className="space-y-1.5 border-t pt-3 border-stone-200/40">
                  <div className="flex justify-between text-xs opacity-75">
                    <span>Cupos ocupados:</span>
                    <span className="font-bold">{prx.used_slots} / {prx.max_users}</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-stone-200"}`}>
                    <div 
                      className={`h-full ${prx.is_full ? "bg-rose-500" : "bg-amber-500"}`}
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

        {/* TAB 4: Servicios */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((p) => (
              <div key={p.id} className={`border rounded-2xl p-6 relative ${
                isDark ? "bg-[#111622]/80 border-white/10" : "bg-white border-stone-200 shadow-sm"
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                      {p.badge}
                    </span>
                    <h3 className="text-lg font-bold mt-2">{p.name}</h3>
                  </div>
                  <button onClick={() => handleDelete(p.id, "platform")} className="text-rose-500 p-1.5 hover:bg-rose-500/10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs opacity-70 mb-4">{p.description}</p>
                <div className="text-xs border-t pt-3 flex justify-between items-center opacity-60">
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

      {/* MODAL 1: Añadir Cuenta Matriz (Multi-cuentas para cualquier servicio) */}
      {showMasterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2xl w-full max-w-md p-6 shadow-2xl ${
            isDark ? "bg-[#111622] border-white/10" : "bg-white border-stone-200"
          }`}>
            <h2 className="text-lg font-bold mb-1">Añadir Cuenta Matriz Original</h2>
            <p className="text-xs opacity-60 mb-5">
              Registra una cuenta comprada (puedes añadir varias al mismo servicio).
            </p>

            <form onSubmit={handleCreateMaster} className="space-y-3.5 text-sm">
              <div>
                <label className="text-xs font-semibold block mb-1">Servicio / Plataforma</label>
                <select
                  required
                  value={masterForm.platform_id}
                  onChange={(e) => setMasterForm({ ...masterForm, platform_id: e.target.value })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-600"
                >
                  <option value="">Selecciona el servicio...</option>
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id} className="text-black">{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Nombre Identificador de la Cuenta</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cuenta 1 / Pool Europa"
                  value={masterForm.account_name}
                  onChange={(e) => setMasterForm({ ...masterForm, account_name: e.target.value })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Correo Oficial</label>
                <input
                  type="email"
                  required
                  placeholder="cuenta_oficial@gmail.com"
                  value={masterForm.email}
                  onChange={(e) => setMasterForm({ ...masterForm, email: e.target.value })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Contraseña Oficial</label>
                <input
                  type="text"
                  required
                  placeholder="Contraseña de la cuenta"
                  value={masterForm.password}
                  onChange={(e) => setMasterForm({ ...masterForm, password: e.target.value })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-600 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Semilla TOTP (2FA / Google Auth) [Opcional]</label>
                <input
                  type="text"
                  placeholder="Ej. JBSWY3DPEHPK3PXP"
                  value={masterForm.totp_seed}
                  onChange={(e) => setMasterForm({ ...masterForm, totp_seed: e.target.value })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-600 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Límite de Clientes para esta Cuenta</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  required
                  value={masterForm.max_users}
                  onChange={(e) => setMasterForm({ ...masterForm, max_users: Number(e.target.value) })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-600"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowMasterModal(false)}
                  className="flex-1 py-2.5 rounded-xl border opacity-60 text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs"
                >
                  Guardar Cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Nuevo Cliente con Selector de Servicio Y Cuenta Específica */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2xl w-full max-w-md p-6 shadow-2xl ${
            isDark ? "bg-[#111622] border-white/10" : "bg-white border-stone-200"
          }`}>
            <h2 className="text-lg font-bold mb-1">Generar Acceso Cliente</h2>
            <p className="text-xs opacity-60 mb-5">Elige el servicio y a qué cuenta específica asignarlo.</p>

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
                <label className="text-xs font-semibold block mb-1">Correo del Cliente</label>
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
                  <label className="text-xs font-semibold">Contraseña del Cliente</label>
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

              {/* 1. SELECCIONAR SERVICIO */}
              <div>
                <label className="text-xs font-semibold block mb-1">1. Selecciona el Servicio</label>
                <select
                  required
                  value={clientForm.platform_id}
                  onChange={(e) => setClientForm({ ...clientForm, platform_id: e.target.value, master_account_id: "" })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-600"
                >
                  <option value="">Selecciona el servicio...</option>
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id} className="text-black">{p.name}</option>
                  ))}
                </select>
              </div>

              {/* 2. SELECCIONAR CUENTA ESPECÍFICA DE ESE SERVICIO */}
              <div>
                <label className="text-xs font-semibold block mb-1">2. Asignar a qué Cuenta Matriz</label>
                <select
                  required
                  disabled={!clientForm.platform_id}
                  value={clientForm.master_account_id}
                  onChange={(e) => setClientForm({ ...clientForm, master_account_id: e.target.value })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-600 disabled:opacity-40"
                >
                  <option value="">
                    {!clientForm.platform_id ? "Primero selecciona un servicio..." : "Selecciona la cuenta matriz..."}
                  </option>
                  {filteredAccountsForClient.map((acc) => (
                    <option key={acc.id} value={acc.id} disabled={acc.is_full} className="text-black">
                      {acc.account_name} ({acc.email}) — [{acc.used_slots}/{acc.max_users} cupos] {acc.is_full ? "[LLENA]" : ""}
                    </option>
                  ))}
                </select>
                {clientForm.platform_id && filteredAccountsForClient.length === 0 && (
                  <p className="text-[11px] text-rose-500 mt-1">Este servicio no tiene cuentas matrices creadas todavía.</p>
                )}
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
                      {prx.name} ({prx.available_slots} libres)
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
                  className="flex-1 py-2.5 rounded-xl border opacity-60 text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs"
                >
                  Crear Acceso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Nuevo Proxy */}
      {showProxyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2xl w-full max-w-md p-6 shadow-2xl ${
            isDark ? "bg-[#111622] border-white/10" : "bg-white border-stone-200"
          }`}>
            <h2 className="text-lg font-bold mb-1">Añadir Servidor Proxy</h2>
            <form onSubmit={handleCreateProxy} className="space-y-3.5 text-sm">
              <div>
                <label className="text-xs font-semibold block mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  placeholder="Proxy US 1"
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
                <label className="text-xs font-semibold block mb-1">Límite de Cuentas</label>
                <input
                  type="number"
                  required
                  value={proxyForm.max_users}
                  onChange={(e) => setProxyForm({ ...proxyForm, max_users: Number(e.target.value) })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none"
                />
              </div>
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowProxyModal(false)} className="flex-1 py-2.5 rounded-xl border opacity-60 text-xs">Cancelar</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-amber-600 text-white font-semibold text-xs">Guardar Proxy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Nuevo Servicio */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2xl w-full max-w-md p-6 shadow-2xl ${
            isDark ? "bg-[#111622] border-white/10" : "bg-white border-stone-200"
          }`}>
            <h2 className="text-lg font-bold mb-1">Añadir Nuevo Servicio</h2>
            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-sm">
              <div>
                <label className="text-xs font-semibold block mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: ChatGPT Pro"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-transparent border rounded-xl px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Descripción</label>
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
                <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 py-2.5 rounded-xl border opacity-60 text-xs">Cancelar</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-amber-600 text-white font-semibold text-xs">Guardar Servicio</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
