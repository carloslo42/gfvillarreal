// src/pages/Arbol.jsx
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { familyData, FUNDADORES, HIJOS } from "../data/familyData";

function MemberNode({ member, onClick, selected }) {
  const isSelected = selected?.id === member.id;
  const bgColor = member.fallecido ? "#e2e8f0" : member.color || "#ea580c";
  return (
    <button
      onClick={() => onClick(member)}
      className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all hover:shadow-lg hover:-translate-y-0.5 min-w-[90px] max-w-[110px] ${
        isSelected ? "border-orange-500 bg-orange-50 shadow-lg scale-105" : "border-green-100 bg-white hover:border-orange-300"
      }`}
    >
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-xl mb-1 shadow-inner overflow-hidden"
        style={{ background: bgColor + "22", border: `2px solid ${bgColor}` }}
      >
        {member.fotoUrl
          ? <img src={member.fotoUrl} alt={member.name} className="w-full h-full object-cover" />
          : <span>{member.emoji || "👤"}</span>
        }
      </div>
      <p className="text-[11px] font-bold text-center leading-tight" style={{ color: member.fallecido ? "#94a3b8" : "#166534" }}>
        {member.shortName || member.nombre?.split(" ")[0] || member.name?.split(" ")[0]}
      </p>
      {member.fallecido && <span className="text-[9px] text-slate-400 font-sans">†</span>}
      {member.nickname && !member.fallecido && (
        <span className="text-[9px] text-orange-400 italic font-sans">"{member.nickname}"</span>
      )}
      {member.generacion && (
        <span className="text-[9px] text-green-400 font-sans">{member.generacion.toUpperCase()}</span>
      )}
    </button>
  );
}

function DetailPanel({ member, onClose }) {
  if (!member) return null;
  const nombre = member.nombre || member.name;
  const ciudad = member.ciudad || member.location;
  const ocupacion = member.ocupacion || member.occupation;
  const bio = member.bio;
  const color = member.color || "#ea580c";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl leading-none font-sans">×</button>
        <div className="flex flex-col items-center mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 overflow-hidden"
            style={{ background: color + "22", border: `3px solid ${color}` }}
          >
            {member.fotoUrl
              ? <img src={member.fotoUrl} alt={nombre} className="w-full h-full object-cover" />
              : <span>{member.emoji || "👤"}</span>
            }
          </div>
          <h2 className="text-xl font-bold text-green-900 text-center font-serif">{nombre}</h2>
          {member.apodo && <p className="text-orange-500 italic text-sm font-sans">"{member.apodo}"</p>}
          {member.nickname && !member.apodo && <p className="text-orange-500 italic text-sm font-sans">"{member.nickname}"</p>}
          {member.fallecido && (
            <span className="mt-1 text-xs bg-slate-100 text-slate-500 px-3 py-0.5 rounded-full font-sans">In memoriam †</span>
          )}
          {member.memoriam && (
            <p className="mt-2 text-xs text-purple-500 font-sans italic text-center">{member.memoriam}</p>
          )}
        </div>
        <div className="space-y-2 text-sm font-sans border-t border-green-100 pt-3">
          {member.negocio && (
            <div className="flex justify-between">
              <span className="text-green-700 font-semibold">Negocio</span>
              <span className="text-gray-700">{member.negocio}</span>
            </div>
          )}
          {member.born && (
            <div className="flex justify-between">
              <span className="text-green-700 font-semibold">Nacimiento</span>
              <span className="text-gray-700">{member.born}</span>
            </div>
          )}
          {member.fallecidoDate && (
            <div className="flex justify-between">
              <span className="text-green-700 font-semibold">Fallecimiento</span>
              <span className="text-gray-700">{member.fallecidoDate}</span>
            </div>
          )}
          {ciudad && (
            <div className="flex justify-between">
              <span className="text-green-700 font-semibold">Ciudad</span>
              <span className="text-gray-700">{ciudad}</span>
            </div>
          )}
          {ocupacion && (
            <div className="flex justify-between">
              <span className="text-green-700 font-semibold">Ocupación</span>
              <span className="text-gray-700">{ocupacion}</span>
            </div>
          )}
          {member.pareja && (
            <div className="flex justify-between">
              <span className="text-green-700 font-semibold">Pareja de</span>
              <span className="text-gray-700">{member.pareja}</span>
            </div>
          )}
          {member.orden && (
            <div className="flex justify-between">
              <span className="text-green-700 font-semibold">Orden</span>
              <span className="text-gray-700">Hijo #{member.orden} de 14</span>
            </div>
          )}
          {(member.branch || member.rama) && (
            <div className="flex justify-between">
              <span className="text-green-700 font-semibold">Rama</span>
              <span className="text-gray-700 capitalize">{(member.branch || member.rama).replace(/-/g, " ")}</span>
            </div>
          )}
          {member.generacion && (
            <div className="flex justify-between">
              <span className="text-green-700 font-semibold">Generación</span>
              <span className="text-gray-700">{member.generacion.toUpperCase()}</span>
            </div>
          )}
        </div>
        {bio && (
          <p className="mt-3 text-sm text-gray-500 italic border-t border-green-50 pt-3 font-sans">{bio}</p>
        )}
      </div>
    </div>
  );
}

const IN_MEMORIAM = [
  {
    id: "memoriam-mariana",
    name: "Mariana Marcela Vázquez Montemayor",
    nickname: "Mariana",
    shortName: "Mariana",
    fallecido: true,
    fallecidoDate: "Mayo 2025",
    emoji: "🕊️",
    color: "#a855f7",
    pareja: "Carlos López Villarreal (G3 · Rama Dora Irma)",
    branch: "dora-irma",
    memoriam: "Las estrellas que no se apagan 💙",
    bio: "Mariana sembró amor en los hijos de Carlos, y ese lazo permanece vivo como parte de su legado.",
    generation: 3,
  },
];

const GEN_COLORS = {
  g3: "#16a34a",
  g4: "#0891b2",
  g5: "#7c3aed",
};

export default function Arbol() {
  const [selected, setSelected] = useState(null);
  const [miembrosFirebase, setMiembrosFirebase] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "miembros")).then((snap) => {
      setMiembrosFirebase(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setCargando(false);
    });
  }, []);

  const abuelo = familyData.find((m) => m.id === "g1-gustavo");
  const abuela = familyData.find((m) => m.id === "g1-dora");
  const hijos = HIJOS.map((h) => familyData.find((m) => m.id === h.id) || h);
  const hijosVivos = hijos.filter((h) => !h.fallecido);
  const hijosFallecidos = hijos.filter((h) => h.fallecido);

  // Agrupar G3+ por rama
  const miembrosPorRama = {};
  miembrosFirebase
    .filter((m) => ["g3", "g4", "g5"].includes(m.generacion))
    .forEach((m) => {
      if (!miembrosPorRama[m.rama]) miembrosPorRama[m.rama] = [];
      miembrosPorRama[m.rama].push({
        ...m,
        color: GEN_COLORS[m.generacion] || "#ea580c",
        shortName: m.apodo || m.nombre?.split(" ")[0],
      });
    });

  const totalRegistrados = miembrosFirebase.length;
  const totalG3mas = miembrosFirebase.filter((m) => ["g3", "g4", "g5"].includes(m.generacion)).length;

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-900 font-serif">🌳 Árbol Familiar Villarreal</h1>
          <p className="text-green-600 text-sm mt-1 font-sans">Haz clic en cualquier miembro para ver su perfil</p>
        </div>

        {/* G1 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-green-300" />
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest font-sans bg-green-100 px-3 py-1 rounded-full border border-green-200">G1 · Fundadores</span>
            <div className="h-px flex-1 bg-green-300" />
          </div>
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-3">
              <MemberNode member={abuelo} onClick={setSelected} selected={selected} />
              <span className="text-pink-400 text-2xl">♥</span>
              <MemberNode member={abuela} onClick={setSelected} selected={selected} />
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-2">
          <div className="w-px h-8 bg-green-400" />
        </div>

        {/* G2 */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-green-300" />
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest font-sans bg-green-100 px-3 py-1 rounded-full border border-green-200">G2 · Los 14