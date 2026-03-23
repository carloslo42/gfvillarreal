// src/pages/Admin.jsx
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { HIJOS } from "../data/familyData";

const TABS = ["Resumen", "Ramas", "Miembros", "Pendientes"];

export default function Admin() {
  const [tab, setTab] = useState("Resumen");
  const [miembros, setMiembros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const snap = await getDocs(collection(db, "miembros"));
        setMiembros(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const total = miembros.length;
  const conFoto = miembros.filter(m => m.fotoUrl).length;
  const conTelefono = miembros.filter(m => m.telefono).length;

  // Conteo por rama
 const conteoRamas = HIJOS.map(h => ({
  ...h,
  count: miembros.filter(m => m.rama === h.branch || m.rama === h.shortName.toLowerCase()).length,
})).sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...conteoRamas.map(r => r.count), 1);

  const filtered = search
    ? miembros.filter(m =>
        m.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        m.apodo?.toLowerCase().includes(search.toLowerCase()) ||
        m.rama?.toLowerCase().includes(search.toLowerCase())
      )
    : miembros;

  const inputClass = "w-full border border-green-200 rounded-xl px-3 py-2 text-sm font-sans text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white";

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-900 font-serif">⚙️ Panel Admin</h1>
            <p className="text-green-600 text-sm font-sans">La Gran Familia Villarreal</p>
          </div>
          <div className="bg-orange-100 border border-orange-200 rounded-xl px-3 py-2 text-center">
            <p className="text-xs text-orange-600 font-sans">Admin</p>
            <p className="text-sm font-bold text-orange-800 font-sans">CGLV</p>
          </div>
        </div>

        {/* Stats en vivo */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total registrados", value: cargando ? "..." : total },
            { label: "Con foto", value: cargando ? "..." : conFoto },
            { label: "Con teléfono", value: cargando ? "..." : conTelefono },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-green-100 p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-green-700 font-serif">{s.value}</p>
              <p className="text-xs text-green-500 font-sans mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-green-100 rounded-xl p-1 mb-5">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold font-sans transition-all ${
                tab === t ? "bg-orange-500 text-white" : "text-green-700 hover:bg-green-50"
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* ── RESUMEN ── */}
        {tab === "Resumen" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
              <h3 className="font-bold text-green-800 font-serif mb-3">📋 Estado del proyecto</h3>
              <div className="space-y-2">
                {[
                  { label: "App publicada en Vercel", status: "✅ Listo" },
                  { label: "Firebase conectado", status: "✅ Listo" },
                  { label: "Registro con teléfono", status: "✅ Listo" },
                  { label: "Foto de perfil", status: "✅ Listo" },
                  { label: "Calendario en vivo", status: "✅ Listo" },
                  { label: "Marcador de ramas", status: "✅ Listo" },
                  { label: "Ligar registros entre miembros", status: "⏳ Pendiente" },
                  { label: "Feed de noticias", status: "🗓 Fase 2" },
                  { label: "Fotos múltiples por persona", status: "🗓 Fase 2" },
                  { label: "Mapa del clan", status: "🗓 Fase 2" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center text-sm font-sans py-1 border-b border-green-50 last:border-0">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-semibold text-green-600">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── RAMAS (Marcador en vivo) ── */}
        {tab === "Ramas" && (
          <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-green-800 font-serif">🏆 Marcador de Ramas</h3>
              <span className="text-xs text-green-500 font-sans">{total} registros totales</span>
            </div>
            <div className="space-y-3">
              {conteoRamas.map((rama, i) => (
                <div key={rama.id}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-sans w-5 text-center text-green-400">
                      {i === 0 && rama.count > 0 ? "🥇" : i === 1 && rama.count > 0 ? "🥈" : i === 2 && rama.count > 0 ? "🥉" : ""}
                    </span>
                    <span className="text-sm font-semibold text-green-800 font-serif flex-1">
                      {rama.shortName}
                      {rama.fallecido && " †"}
                    </span>
                    <span className="text-sm font-bold text-orange-500 font-sans w-6 text-right">
                      {rama.count}
                    </span>
                  </div>
                  <div className="ml-7 h-2 bg-green-50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${rama.count > 0 ? "bg-orange-400" : "bg-green-100"}`}
                      style={{ width: `${(rama.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {!cargando && total === 0 && (
              <p className="text-center text-green-400 text-sm font-sans mt-4">Aún no hay registros</p>
            )}
          </div>
        )}

        {/* ── MIEMBROS ── */}
        {tab === "Miembros" && (
          <div className="space-y-3">
            <input type="text" className={inputClass} placeholder="Buscar por nombre, apodo o rama..." value={search} onChange={(e) => setSearch(e.target.value)} />
            {cargando ? (
              <p className="text-center text-green-500 font-sans text-sm py-4">Cargando...</p>
            ) : (
              <div className="space-y-2">
                {filtered.map((m) => (
                  <div key={m.id} className="bg-white rounded-xl border border-green-100 px-4 py-3 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0">
                      {m.fotoUrl ? (
                        <img src={m.fotoUrl} alt={m.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg">👤</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-green-900 text-sm font-serif truncate">{m.nombre}</p>
                      <p className="text-xs text-green-500 font-sans">
                        {m.generacion?.toUpperCase()} · Rama {m.rama?.replace(/-/g, " ")}
                        {m.ciudad && ` · ${m.ciudad}`}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {m.fotoUrl && <span className="text-xs bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full font-sans">📸</span>}
                      {m.telefono && <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-sans">📱</span>}
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="text-center text-green-400 text-sm font-sans py-4">No se encontraron resultados</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── PENDIENTES ── */}
        {tab === "Pendientes" && (
          <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <h3 className="font-bold text-green-800 font-serif mb-3">⚠️ Próximos pasos</h3>
            <div className="space-y-3">
              {[
                { prioridad: "Alta", tarea: "Ligar registros entre miembros (pareja, hijos, padres)" },
                { prioridad: "Media", tarea: "Feed de noticias — actividad reciente de la familia" },
                { prioridad: "Media", tarea: "Fotos múltiples por persona (perfil, estado, portada)" },
                { prioridad: "Media", tarea: "Editor de foto con recorte al subir" },
                { prioridad: "Baja", tarea: "Mapa geográfico del clan" },
                { prioridad: "Baja", tarea: "Gamificación — logros por rama" },
              ].map((p) => (
                <div key={p.tarea} className="border border-green-100 rounded-xl p-3 flex items-start gap-2">
                  <span className={`text-[10px] font-bold font-sans px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${
                    p.prioridad === "Alta" ? "bg-red-100 text-red-700" :
                    p.prioridad === "Media" ? "bg-orange-100 text-orange-700" :
                    "bg-green-100 text-green-700"
                  }`}>{p.prioridad}</span>
                  <p className="text-sm text-gray-700 font-sans">{p.tarea}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}