// src/pages/Admin.jsx
import { useState } from "react";
import { familyData, HIJOS } from "../data/familyData";

const TABS = ["Resumen", "Miembros", "Ramas", "Pendientes"];

export default function Admin() {
  const [tab, setTab] = useState("Resumen");
  const [search, setSearch] = useState("");

  const totalMiembros = familyData.length;
  const activos = familyData.filter((m) => !m.fallecido).length;
  const fallecidos = familyData.filter((m) => m.fallecido).length;
  const hijosActivos = HIJOS.filter((h) => !h.fallecido).length;

  const filtered = search
    ? familyData.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        (m.nickname && m.nickname.toLowerCase().includes(search.toLowerCase()))
      )
    : familyData;

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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total miembros", value: totalMiembros },
            { label: "Activos", value: activos },
            { label: "In memoriam", value: fallecidos },
            { label: "Ramas activas", value: hijosActivos },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-green-100 p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-green-700 font-serif">{s.value}</p>
              <p className="text-xs text-green-500 font-sans mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

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

        {tab === "Resumen" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
              <h3 className="font-bold text-green-800 font-serif mb-3">📋 Estado del proyecto</h3>
              <div className="space-y-2">
                {[
                  { label: "Formulario de Registro",     status: "✅ Listo" },
                  { label: "Árbol Familiar G1-G2",        status: "✅ Listo" },
                  { label: "Tarjeta Mensual Cumpleaños",  status: "✅ Listo" },
                  { label: "Landing Page",                status: "✅ Listo" },
                  { label: "Tarjeta Invitación WhatsApp", status: "✅ Listo" },
                  { label: "Panel Admin",                 status: "✅ Listo" },
                  { label: "Firebase (base de datos)",    status: "⏳ Pendiente" },
                  { label: "Vercel (hosting)",            status: "⏳ Pendiente" },
                  { label: "G3 y G4 (nietos/bisnietos)",  status: "🗓 Fase 2" },
                  { label: "Ancestros G-1, G-2...",       status: "🗓 Fase futura" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center text-sm font-sans py-1 border-b border-green-50 last:border-0">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-semibold text-green-600">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
              <h3 className="font-bold text-green-800 font-serif mb-3">🗺 Roadmap</h3>
              {[
                { fase: "Fase 1", desc: "Registro, árbol G1-G2, landing, calendario, invitación", estado: "✅ Completa" },
                { fase: "Fase 2", desc: "Perfil extendido, pareja, aniversario, Firebase", estado: "⏳ Próxima" },
                { fase: "Fase 3", desc: "Calendario vivo automático", estado: "🗓 Planeada" },
                { fase: "Fase 4", desc: "Árbol visual + estadísticas", estado: "🗓 Planeada" },
                { fase: "Fase 5", desc: "Gamificación y dinámicas", estado: "🗓 Planeada" },
              ].map((f) => (
                <div key={f.fase} className="flex gap-3 text-sm font-sans py-2 border-b border-green-50 last:border-0">
                  <span className="font-bold text-green-700 w-16 flex-shrink-0">{f.fase}</span>
                  <span className="flex-1 text-gray-600">{f.desc}</span>
                  <span className="text-green-600 flex-shrink-0">{f.estado}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Miembros" && (
          <div className="space-y-3">
            <input type="text" className={inputClass} placeholder="Buscar familiar..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="space-y-2">
              {filtered.map((m) => (
                <div key={m.id} className="bg-white rounded-xl border border-green-100 px-4 py-3 flex items-center gap-3 shadow-sm">
                  <span className="text-xl">{m.emoji || "👤"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-green-900 text-sm font-serif truncate">{m.name}</p>
                    <p className="text-xs text-green-500 font-sans">G{m.generation} · {m.branch?.replace(/-/g, " ")}{m.fallecido && " · †"}</p>
                  </div>
                  <span className={`text-xs font-sans px-2 py-0.5 rounded-full ${m.born ? "bg-green-100 text-green-700" : "bg-orange-50 text-orange-400"}`}>
                    {m.born ? "✓ Completo" : "Pendiente"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Ramas" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HIJOS.map((h) => (
              <div key={h.id} className={`bg-white rounded-xl border p-4 shadow-sm ${h.fallecido ? "border-slate-200 opacity-60" : "border-green-100"}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{h.emoji}</span>
                  <div>
                    <p className="font-bold text-green-900 text-sm font-serif">#{h.orden} · {h.shortName}{h.fallecido && " †"}</p>
                    <p className="text-xs text-green-500 font-sans">Rama {h.branch?.replace(/-/g, " ")}</p>
                  </div>
                </div>
                {!h.fallecido && (
                  <div className="mt-2 pt-2 border-t border-green-50 flex justify-between text-xs font-sans text-gray-400">
                    <span>Miembros registrados</span>
                    <span className="font-bold text-orange-500">0</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "Pendientes" && (
          <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <h3 className="font-bold text-green-800 font-serif mb-3">⚠️ Acciones pendientes</h3>
            <div className="space-y-3">
              {[
                { prioridad: "Alta",  tarea: "Ejecutar npm run dev y verificar en localhost:5173", cmd: "npm run dev" },
                { prioridad: "Media", tarea: "Crear cuenta en Firebase para la base de datos", cmd: null },
                { prioridad: "Media", tarea: "Crear cuenta en Vercel para el hosting", cmd: null },
                { prioridad: "Baja",  tarea: "Conectar dominio gfvillarreal.com desde Neubox", cmd: null },
              ].map((p) => (
                <div key={p.tarea} className="border border-green-100 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-bold font-sans px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 flex-shrink-0 mt-0.5">{p.prioridad}</span>
                    <p className="text-sm text-gray-700 font-sans">{p.tarea}</p>
                  </div>
                  {p.cmd && <p className="mt-1 ml-14 text-xs font-mono bg-gray-50 text-gray-600 px-2 py-1 rounded-lg">{p.cmd}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}