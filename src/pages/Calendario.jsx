// src/pages/Calendario.jsx
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

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
  const [miembros, setMiembros] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const snap = await getDocs(collection(db, "miembros"));
        const datos = snap.docs
          .map(d => d.data())
          .filter(m => m.fechaNacimiento)
          .map(m => {
            const fecha = new Date(m.fechaNacimiento);
            const mes = String(fecha.getMonth() + 1).padStart(2, "0");
            const dia = String(fecha.getDate()).padStart(2, "0");
            return {
              nombre: m.nombre || "—",
              apodo: m.apodo || m.nombre?.split(" ")[0] || "—",
              fecha: `${mes}-${dia}`,
              rama: m.rama || "—",
              generacion: m.generacion || "—",
              emoji: "👤",
              fotoUrl: m.fotoUrl || null,
            };
          })
          .sort((a, b) => a.fecha.localeCompare(b.fecha));
        setMiembros(datos);
      } catch (error) {
        console.error("Error cargando cumpleaños:", error);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const estacion = ESTACIONES[mesActivo];
  const mesStr = String(mesActivo + 1).padStart(2, "0");
  const cumplesMes = miembros.filter((c) => c.fecha.startsWith(mesStr));

  const hoy = `${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  const proximos = miembros
    .filter((c) => c.fecha >= hoy)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-900 font-serif">🎂 Cumpleaños</h1>
          <p className="text-green-600 text-sm mt-1 font-sans">
            {cargando ? "Cargando..." : `${miembros.length} miembros registrados`}
          </p>
        </div>

        {/* Selector de mes */}
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

        {/* Tarjeta mensual */}
        <div className={`bg-gradient-to-br ${estacion.bg} border-2 ${estacion.border} rounded-3xl p-6 shadow-sm mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-sans text-gray-500 uppercase tracking-widest">{estacion.emoji} {estacion.label}</p>
              <h2 className="text-2xl font-bold text-green-900 font-serif">{MESES[mesActivo]}</h2>
              <p className="text-xs text-green-600 font-sans">La Gran Familia Villarreal</p>
            </div>
            <div className="text-5xl opacity-60">{estacion.emoji}</div>
          </div>

          {cargando ? (
            <div className="text-center py-8">
              <p className="text-green-500 font-sans text-sm">Cargando cumpleaños...</p>
            </div>
          ) : cumplesMes.length > 0 ? (
            <div className="space-y-3">
              {cumplesMes.map((c, i) => {
                const dia = c.fecha.split("-")[1];
                return (
                  <div key={i} className="bg-white/70 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-orange-100 border-2 border-orange-300 flex items-center justify-center flex-shrink-0">
                      {c.fotoUrl ? (
                        <img src={c.fotoUrl} alt={c.apodo} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">{c.emoji}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-green-900 text-sm font-serif leading-tight">{c.nombre}</p>
                      <p className="text-xs text-green-600 font-sans">
                        "{c.apodo}" · {c.generacion?.toUpperCase()} · Rama {c.rama?.replace(/-/g," ")}
                      </p>
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
              <p className="text-green-600 font-sans text-sm">
                Sin cumpleaños registrados en {MESES[mesActivo]}
              </p>
              <p className="text-green-400 font-sans text-xs mt-1">
                Aparecerán conforme la familia se registre
              </p>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-white/50 flex items-center justify-between">
            <p className="text-xs text-green-600 font-sans">🌳 gfvillarreal.com</p>
            <p className="text-xs text-green-400 font-sans">{now.getFullYear()}</p>
          </div>
        </div>

        {/* Próximos cumpleaños */}
        {!cargando && proximos.length > 0 && (
          <div className="bg-white rounded-2xl border border-green-100 p-4 shadow-sm">
            <h3 className="text-sm font-bold text-green-800 font-serif mb-3">🔔 Próximos cumpleaños</h3>
            <div className="space-y-2">
              {proximos.map((c, i) => {
                const [mm, dd] = c.fecha.split("-");
                return (
                  <div key={i} className="flex items-center gap-3 text-sm font-sans">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0">
                      {c.fotoUrl ? (
                        <img src={c.fotoUrl} alt={c.apodo} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm">👤</span>
                      )}
                    </div>
                    <span className="flex-1 text-gray-700">{c.apodo}</span>
                    <span className="text-orange-500 font-bold">
                      {dd} {MESES[parseInt(mm) - 1].substring(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!cargando && miembros.length === 0 && (
          <div className="text-center py-6 bg-white rounded-2xl border border-green-100">
            <p className="text-4xl mb-2">🌱</p>
            <p className="text-green-600 font-sans text-sm">Aún no hay registros con fecha de nacimiento</p>
            <p className="text-green-400 font-sans text-xs mt-1">Conforme la familia se registre aparecerán aquí</p>
          </div>
        )}

        <p className="text-center text-xs text-green-400 font-sans mt-6">
          Se actualiza automáticamente con cada nuevo registro 🌳
        </p>
      </div>
    </div>
  );
}