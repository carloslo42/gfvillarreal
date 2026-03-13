// src/pages/Invitacion.jsx
import { useState } from "react";

const VERSIONES = {
  emotivo: {
    label: "💚 Emotivo",
    texto: `🌳 *La Gran Familia Villarreal*

Hola familia! 🥰

Quiero contarles de algo muy especial que estamos construyendo juntos: *nuestra plataforma familiar digital* — un espacio privado y exclusivo para nosotros, los Villarreal.

Allí podrás:
🌳 Ver el árbol familiar completo (G1 hasta G4)
🎂 Saber cuándo es el cumpleaños de cada quien
📸 Tener tu perfil con tu historia y fotos
🏆 Participar en la historia de la Ferretería Sieber

Todo esto en honor a Don Gustavo y Doña Dora 🙏

✨ Solo toma 2 minutos registrarte.

👉 gfvillarreal.com

Con amor, la familia 🌿`,
  },
  directo: {
    label: "⚡ Directo",
    texto: `🌳 *gfvillarreal.com — Ya está lista*

Hola familia Villarreal!

Lanzamos nuestra plataforma digital familiar. Es privada, solo para nosotros.

Qué hay:
✅ Árbol genealógico G1-G4
✅ Calendario de cumpleaños
✅ Tu perfil personal
✅ Historia de la Ferretería Sieber

Regístrate en 2 minutos 👇
🔗 gfvillarreal.com`,
  },
  nostalgico: {
    label: "🕰 Nostálgico",
    texto: `🌳 *Para la familia Villarreal*

¿Recuerdan los calendarios impresos de la familia? Esos donde cada mes aparecían los cumpleañeros con su foto...

Pues los estamos reviviendo, pero en digital. Y mucho mejor.

*La Gran Familia Villarreal* — nuestra plataforma privada — ya está lista.

En ella vive la historia de Don Gustavo Villarreal Carrillo † y Doña Dora Maury † y sus 14 hijos.

Es nuestro árbol. Es nuestra memoria. Es nuestra familia.

🔗 gfvillarreal.com

Regístrate. No somos una red social. Somos familia.`,
  },
};

export default function Invitacion() {
  const [version, setVersion] = useState("emotivo");
  const [copiado, setCopiado] = useState(false);

  const copiar = () => {
    navigator.clipboard.writeText(VERSIONES[version].texto).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  };

  const texto = VERSIONES[version].texto;
  const lineas = texto.split("\n");

  const renderLinea = (linea, i) => {
    const partes = linea.split(/(\*[^*]+\*)/g);
    return (
      <span key={i} className="block leading-relaxed">
        {partes.map((p, j) =>
          p.startsWith("*") && p.endsWith("*") ? (
            <strong key={j}>{p.slice(1, -1)}</strong>
          ) : (
            <span key={j}>{p}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-900 font-serif">📲 Tarjeta de Invitación</h1>
          <p className="text-green-600 text-sm mt-1 font-sans">Para compartir en el grupo de WhatsApp Villarreal</p>
        </div>

        <div className="flex gap-2 mb-4">
          {Object.entries(VERSIONES).map(([key, v]) => (
            <button key={key} onClick={() => setVersion(key)}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold font-sans border transition-all ${
                version === key ? "bg-orange-500 text-white border-orange-500" : "bg-white text-green-700 border-green-200 hover:border-orange-300"
              }`}>
              {v.label}
            </button>
          ))}
        </div>

        <div className="bg-[#e5ddd5] rounded-2xl p-4 mb-4 shadow-inner">
          <p className="text-[10px] text-gray-500 font-sans mb-2 text-center uppercase tracking-widest">Vista previa WhatsApp</p>
          <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm max-w-xs ml-0">
            <div className="text-sm text-gray-800 font-sans space-y-0.5">
              {lineas.map((linea, i) =>
                linea === "" ? <span key={i} className="block h-2" /> : renderLinea(linea, i)
              )}
            </div>
            <p className="text-[10px] text-gray-400 font-sans text-right mt-2">
              {new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })} ✓✓
            </p>
          </div>
        </div>

        <button onClick={copiar}
          className={`w-full font-bold py-3 rounded-xl transition-all font-sans text-lg shadow ${
            copiado ? "bg-green-600 text-white" : "bg-orange-500 hover:bg-orange-400 text-white"
          }`}>
          {copiado ? "✓ ¡Copiado al portapapeles!" : "📋 Copiar mensaje"}
        </button>

        <p className="text-center text-xs text-green-400 font-sans mt-3">
          Pégalo directo en WhatsApp · 3 versiones disponibles
        </p>

        <div className="mt-6 bg-white rounded-xl border border-green-100 p-4 shadow-sm">
          <p className="text-xs text-green-700 font-sans font-semibold mb-1">📊 Nombre votado por la familia</p>
          <p className="text-sm text-gray-600 font-sans">
            <strong className="text-green-800">La Gran Familia Villarreal</strong> — 4 de 5 votos
          </p>
          <p className="text-xs text-green-400 font-sans mt-1">Dominio: gfvillarreal.com (Neubox · vigente hasta Mar 2027)</p>
        </div>
      </div>
    </div>
  );
}