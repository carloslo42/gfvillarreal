// src/App.jsx
import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Registro from "./pages/Registro";
import Arbol from "./pages/Arbol";
import Calendario from "./pages/Calendario";
import Admin from "./pages/Admin";
import Invitacion from "./pages/Invitacion";

function NavBar() {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  if (isLanding) return null;

  const links = [
    { to: "/arbol", label: "🌳 Árbol" },
    { to: "/calendario", label: "🎂 Cumpleaños" },
    { to: "/registro", label: "✏️ Registro" },
    { to: "/invitacion", label: "📲 Invitación" },
    { to: "/admin", label: "⚙️ Admin" },
  ];

  return (
    <nav className="bg-green-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="text-2xl">🌳</span>
          <span className="font-bold text-lg tracking-wide">
            <span className="text-orange-400">La Gran</span>{" "}
            <span className="text-white">Familia Villarreal</span>
          </span>
        </NavLink>
        <div className="flex gap-1 flex-wrap">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all font-sans ${
                  isActive ? "bg-orange-500 text-white" : "text-green-100 hover:bg-green-700"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-green-50">
        <NavBar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/arbol" element={<Arbol />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/invitacion" element={<Invitacion />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}