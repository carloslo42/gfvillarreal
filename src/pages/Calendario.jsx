// src/pages/Calendario.jsx
import { useState } from "react";

const CUMPLEANOS_EJEMPLO = [
  { nombre: "Dora Irma Villarreal Maury", apodo: "Dora Irma", fecha: "03-15", rama: "dora-irma", emoji: "👩", generacion: "G2" },
  { nombre: "Gustavo Villarreal Maury",   apodo: "Gustavo",   fecha: "03-22", rama: "gustavo",   emoji: "👨", generacion: "G2" },
  { nombre: "Celia Villarreal Maury",     apodo: "Celia",     fecha: "04-05", rama: "celia",     emoji: "👩", generacion: "G2" },
];

const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

const ESTACIONES = {
  0:  { emoji: "❄️", label: "Invierno", bg: "from-blue-100 to-blue-50",       border: "border-blue-200" },
  1:  { emoji: "❄️", label: "Invierno", bg: "from-blue-100 to-blue-50",       border: "border-blue-200" },
  2:  { emoji: "🌸", label: "Primavera", bg: "from-pink-100 to-pink-50",      border: "border-pink-200" },
  3:  { emoji: "🌸", label: "Primavera", bg: "from-pink-100 to-pink-50",      border: "border-pink-200" },
  4:  { emoji: "🌸", label: "Primavera", bg: "from-pink-100 to-pink-50",      border: "border-pink-200" },
  5:  { emoji: "☀️", label: "Verano",    bg: "from-yellow-100 to-orange-50",  border: "border-orange-200" },
  6:  { emoji: "☀️", label: "Verano",    bg: "from-yellow-100 to-orange-50",  border: "border-orange-200" },
  7:  { emoji: "☀️", label: "Verano",    bg: "from-yellow-100 to-orange-50",  border: "border-orange-200" },
  8:  { emoji: "🍂", label: "Otoño",     bg: "from-orange-100 to-amber-50",   border: "border-amber-200" },
  9:  { emoji: "🍂", label: "Otoño",     bg: "from-orange-100 to-amber-50",   border: "border-amber-200" },
  10: { emoji: "🍂", label: "Otoño",     bg: "from-orange-100 to-amber-50",   border: "border-amber-200" },
  11: { emoji: "❄️", label: "Invierno", bg: "from-blue-100 to-blue-50",       border: "border-blue-200" },
};

export default function Calendario() {
  const now = new Date();
  const [mesActivo, setMesActivo] = useState(now.getMonth());

  const estacion = ESTACIONES[mesActivo];
  const mesStr = String(mesActivo + 1).padStart(2, "0");
  const cumplesMes = CUMPLEANOS_EJEMPLO.filter((c) => c.fecha.startsWith(mesStr));

  const hoy = `${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  const proximos = CUMPLEANOS_EJEMPLO
    .filter((c) => c.fecha >= hoy)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-900 font-serif">🎂 Tarjeta de Cumpleaños</h1>
          <p className="text-green-600 text-sm mt-1 font-sans">Cumpleañeros del mes · Familia Villarreal</p>
        </div>

        <div className="flex flex-wrap gap-1 justify-center mb-6">
          {MESES.map((mes, i) => (
            <button key={mes} onClick={() => setMesActivo(i)}
              className={`px-2.5 py-1 rounded-lg text-xs font-sans font-semibold transition-all ${
                mesActivo === i ? "bg-orange-500 text-white shadow" : "bg-white text-green-700 border border-green-200 hover:border-orange-300"
              }`}>
              {mes.substring(0, 3)}
            </button>
          ))}
        </div>

        <div className={`bg-gradient-to-br ${estacion.bg} border-2 ${estacion.border} rounded-3xl p-6 shadow-sm mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-sans text-gray-500 uppercase tracking-widest">{estacion.emoji} {estacion.label}</p>
              <h2 className="text-2xl font-bold text-green-900 font-serif">{MESES[mesActivo]}</h2>
              <p className="text-xs text-green-600 font-sans">La Gran Familia Villarreal</p>
            </div>
            <div className="text-5xl opacity-60">{estacion.emoji}</div>
          </div>

          {cumplesMes.length > 0 ? (
            <div className="space-y-3">
              {cumplesMes.map((c) => {
                const dia = c.fecha.split("-")[1];
                return (
                  <div key={c.nombre} className="bg-white/70 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
                    <div className="w-11 h-11 rounded-full bg-orange-100 border-2 border-orange-300 flex items-center justify-center text-xl flex-shrink-0">{c.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-green-900 text-sm font-serif leading-tight">{c.nombre}</p>
                      <p className="text-xs text-green-600 font-sans">"{c.apodo}" · {c.generacion} · Rama {c.rama.replace(/-/g," ")}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold text-orange-500 font-serif">{dia}</p>
                      <p className="text-xs text-gray-400 font-sans">{MESES[mesActivo].substring(0,3)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">🌿</p>
              <p className="text-green-600 font-sans text-sm">Sin cumpleaños registrados en {MESES[mesActivo]}</p>
              <p className="text-green-400 font-sans text-xs mt-1">Los cumpleaños aparecerán conforme la familia se registre</p>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-white/50 flex items-center justify-between">
            <p className="text-xs text-green-600 font-sans">🌳 gfvillarreal.com</p>
            <p className="text-xs text-green-400 font-sans">{new Date().getFullYear()}</p>
          </div>
        </div>

        {proximos.length > 0 && (
          <div className="bg-white rounded-2xl border border-green-100 p-4 shadow-sm">
            <h3 className="text-sm font-bold text-green-800 font-serif mb-3">🔔 Próximos cumpleaños</h3>
            <div className="space-y-2">
              {proximos.map((c) => {
                const [mm, dd] = c.fecha.split("-");
                return (
                  <div key={c.nombre} className="flex items-center gap-3 text-sm font-sans">
                    <span className="text-lg">{c.emoji}</span>
                    <span className="flex-1 text-gray-700">{c.apodo}</span>
                    <span className="text-orange-500 font-bold">{dd} {MESES[parseInt(mm) - 1].substring(0, 3)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-green-400 font-sans mt-6">
          Esta tarjeta se puede compartir por WhatsApp cada mes · Diseño por época del año
        </p>
      </div>
    </div>
  );
}