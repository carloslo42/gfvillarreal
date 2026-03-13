// src/pages/Landing.jsx
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
        <div className="text-[20rem] absolute -top-20 -left-20 leading-none">🌳</div>
        <div className="text-[12rem] absolute bottom-10 right-10 leading-none">🌿</div>
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 backdrop-blur rounded-full p-5 border border-white/20 shadow-2xl">
            <span className="text-7xl">🌳</span>
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold mb-2 leading-tight font-serif">
          <span className="text-orange-400">La Gran</span>
          <br />
          <span className="text-white">Familia Villarreal</span>
        </h1>

        <p className="text-green-200 text-lg mt-3 mb-2 font-sans">
          Plataforma familiar privada
        </p>

        <div className="mt-4 mb-8 inline-block bg-white/10 border border-white/20 rounded-2xl px-6 py-3">
          <p className="text-green-100 text-sm font-sans">
            En honor a{" "}
            <span className="text-orange-300 font-semibold">Gustavo Villarreal Carrillo †</span>{" "}
            y{" "}
            <span className="text-orange-300 font-semibold">Dora Maury †</span>
          </p>
          <p className="text-green-300 text-xs mt-1 font-sans">14 hijos · Ferretería Sieber</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/arbol")}
            className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all hover:scale-105 text-lg font-sans"
          >
            🌳 Ver el Árbol Familiar
          </button>
          <button
            onClick={() => navigate("/registro")}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold px-8 py-3 rounded-xl shadow transition-all hover:scale-105 text-lg font-sans"
          >
            ✏️ Registrarme
          </button>
        </div>

        <div className="flex gap-6 justify-center mt-6">
          {[
            { label: "🎂 Cumpleaños", path: "/calendario" },
            { label: "📲 Invitación", path: "/invitacion" },
            { label: "⚙️ Admin", path: "/admin" },
          ].map((l) => (
            <button
              key={l.path}
              onClick={() => navigate(l.path)}
              className="text-green-300 hover:text-orange-300 text-sm font-sans transition-colors"
            >
              {l.label}
            </button>
          ))}
        </div>

        <p className="text-green-600 text-xs mt-10 font-sans">
          gfvillarreal.com · Privado y exclusivo para la familia
        </p>
      </div>
    </div>
  );
}