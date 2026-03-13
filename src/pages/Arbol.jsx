// src/pages/Arbol.jsx
import { useState } from "react";
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
        className="w-11 h-11 rounded-full flex items-center justify-center text-xl mb-1 shadow-inner"
        style={{ background: bgColor + "22", border: `2px solid ${bgColor}` }}
      >
        <span>{member.emoji || "👤"}</span>
      </div>
      <p className="text-[11px] font-bold text-center leading-tight" style={{ color: member.fallecido ? "#94a3b8" : "#166534" }}>
        {member.shortName || member.name.split(" ")[0]}
      </p>
      {member.fallecido && <span className="text-[9px] text-slate-400 font-sans">†</span>}
      {member.nickname && !member.fallecido && (
        <span className="text-[9px] text-orange-400 italic font-sans">"{member.nickname}"</span>
      )}
    </button>
  );
}

function DetailPanel({ member, onClose }) {
  if (!member) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl leading-none font-sans">×</button>
        <div className="flex flex-col items-center mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2"
            style={{ background: (member.color || "#ea580c") + "22", border: `3px solid ${member.color || "#ea580c"}` }}
          >
            {member.emoji || "👤"}
          </div>
          <h2 className="text-xl font-bold text-green-900 text-center font-serif">{member.name}</h2>
          {member.nickname && !member.fallecido && (
            <p className="text-orange-500 italic text-sm font-sans">"{member.nickname}"</p>
          )}
          {member.fallecido && (
            <span className="mt-1 text-xs bg-slate-100 text-slate-500 px-3 py-0.5 rounded-full font-sans">In memoriam †</span>
          )}
        </div>
        <div className="space-y-2 text-sm font-sans border-t border-green-100 pt-3">
          {member.generation === 1 && member.negocio && (
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
          {member.location && (
            <div className="flex justify-between">
              <span className="text-green-700 font-semibold">Ciudad</span>
              <span className="text-gray-700">{member.location}</span>
            </div>
          )}
          {member.occupation && (
            <div className="flex justify-between">
              <span className="text-green-700 font-semibold">Ocupación</span>
              <span className="text-gray-700">{member.occupation}</span>
            </div>
          )}
          {member.generation === 2 && (
            <div className="flex justify-between">
              <span className="text-green-700 font-semibold">Orden</span>
              <span className="text-gray-700">Hijo #{member.orden} de 14</span>
            </div>
          )}
          {member.branch && (
            <div className="flex justify-between">
              <span className="text-green-700 font-semibold">Rama</span>
              <span className="text-gray-700 capitalize">{member.branch.replace(/-/g, " ")}</span>
            </div>
          )}
        </div>
        {member.bio && (
          <p className="mt-3 text-sm text-gray-500 italic border-t border-green-50 pt-3 font-sans">{member.bio}</p>
        )}
        {(!member.born && !member.location && !member.occupation && !member.bio) && (
          <p className="mt-3 text-sm text-gray-400 text-center font-sans">Perfil pendiente de completar</p>
        )}
      </div>
    </div>
  );
}

export default function Arbol() {
  const [selected, setSelected] = useState(null);
  const abuelo = familyData.find((m) => m.id === "g1-gustavo");
  const abuela = familyData.find((m) => m.id === "g1-dora");
  const hijos = HIJOS.map((h) => familyData.find((m) => m.id === h.id) || h);
  const hijosVivos = hijos.filter((h) => !h.fallecido);
  const hijosFallecidos = hijos.filter((h) => h.fallecido);

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-900 font-serif">🌳 Árbol Familiar Villarreal</h1>
          <p className="text-green-600 text-sm mt-1 font-sans">Haz clic en cualquier miembro para ver su perfil</p>
        </div>

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

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-green-300" />
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest font-sans bg-green-100 px-3 py-1 rounded-full border border-green-200">G2 · Los 14 Hijos</span>
            <div className="h-px flex-1 bg-green-300" />
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-3">
            {hijosVivos.map((h) => (
              <MemberNode key={h.id} member={h} onClick={setSelected} selected={selected} />
            ))}
          </div>
          {hijosFallecidos.length > 0 && (
            <div className="mt-4">
              <p className="text-center text-xs text-slate-400 font-sans mb-2">In memoriam</p>
              <div className="flex flex-wrap justify-center gap-3">
                {hijosFallecidos.map((h) => (
                  <MemberNode key={h.id} member={h} onClick={setSelected} selected={selected} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6 py-8 border-2 border-dashed border-green-200 rounded-2xl bg-white/50">
          <p className="text-green-400 text-lg mb-1">🌱</p>
          <p className="text-green-600 font-semibold font-serif">G3 · Nietos</p>
          <p className="text-green-400 text-xs font-sans mt-1">Se agregarán conforme la familia se registre</p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { label: "Generaciones", value: "G1 – G4" },
            { label: "Hijos fundadores", value: "14" },
            { label: "Fallecidos", value: "4 †" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-green-100 p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-green-800 font-serif">{s.value}</p>
              <p className="text-xs text-green-500 font-sans mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <DetailPanel member={selected} onClose={() => setSelected(null)} />
    </div>
  );
}