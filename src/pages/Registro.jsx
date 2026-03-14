// src/pages/Registro.jsx
import { useState } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { RAMAS, generarCodigo } from "../data/familyData";

const GENERACIONES = [
  { value: "g2", label: "G2 — Hijo/a directo de Gustavo y Dora" },
  { value: "g3", label: "G3 — Nieto/a" },
  { value: "g4", label: "G4 — Bisnieto/a" },
  { value: "g5", label: "G5 — Tataranieto/a" },
];

const INTERESES = [
  "Música", "Cocina", "Deportes", "Viajes", "Lectura",
  "Tecnología", "Arte", "Cine", "Naturaleza", "Negocios",
];

const MASCOTAS = ["Perro 🐶", "Gato 🐱", "Ave 🐦", "Pez 🐠", "Tortuga 🐢", "Conejo 🐰", "Ninguna", "Otra"];

export default function Registro() {
  const [step, setStep] = useState(1);
  const [codigo, setCodigo] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    nombre: "", apodo: "", fechaNacimiento: "", ciudad: "",
    ocupacion: "", pareja: "", telefono: "", tutorRelacion: "",
    generacion: "", rama: "", intereses: [], mascotas: [], bio: "",
  });

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const toggleItem = (field, item) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(item)
        ? f[field].filter((i) => i !== item)
        : [...f[field], item],
    }));
  };

  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    if (form.telefono) {
      const q = query(collection(db, "miembros"), where("telefono", "==", form.telefono));
      const snap = await getDocs(q);
      if (!snap.empty && !form.tutorRelacion) {
        alert("Este número ya está registrado. Ve a 👤 Mi Perfil para actualizar tus datos.");
        return;
      }
    }
    setStep(2);
  };

  const handleSubmitStep2 = async () => {
    setGuardando(true);
    try {
      const randa = Math.floor(Math.random() * 900) + 100;
      const cod = generarCodigo(form.rama || "vrl", randa);
      await addDoc(collection(db, "miembros"), {
        ...form,
        codigo: cod,
        fechaRegistro: new Date().toISOString(),
      });
      setCodigo(cod);
      setStep(3);
    } catch (error) {
      console.error("Error guardando:", error);
      alert("Error al guardar. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  const handleReset = () => {
    setForm({
      nombre: "", apodo: "", fechaNacimiento: "", ciudad: "",
      ocupacion: "", pareja: "", telefono: "", tutorRelacion: "",
      generacion: "", rama: "", intereses: [], mascotas: [], bio: "",
    });
    setCodigo("");
    setStep(1);
  };

  const inputClass = "w-full border border-green-200 rounded-xl px-4 py-2.5 text-sm font-sans text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white";
  const labelClass = "block text-xs font-semibold text-green-700 mb-1 font-sans uppercase tracking-wide";
  const hintClass = "block text-[10px] text-green-400 font-sans mt-0.5";

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-900 font-serif">✏️ Registro Familiar</h1>
          <p className="text-green-600 text-sm mt-1 font-sans">Únete a La Gran Familia Villarreal</p>
        </div>

        <div className="flex gap-2 mb-6">
          {["Datos básicos", "Intereses", "Confirmación"].map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-2 rounded-full transition-all ${step > i + 1 ? "bg-green-600" : step === i + 1 ? "bg-orange-500" : "bg-green-100"}`} />
              <p className={`text-[10px] mt-1 font-sans text-center ${step === i + 1 ? "text-orange-500 font-bold" : "text-green-400"}`}>{s}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
          {step === 1 && (
            <form onSubmit={handleSubmitStep1} className="space-y-4">
              <div>
                <label className={labelClass}>Nombre completo *</label>
                <input type="text" className={inputClass} placeholder="Ej: Carlos Villarreal Maury" value={form.nombre} onChange={(e) => update("nombre", e.target.value)} required />
              </div>
              <div>
                <label className={labelClass}>Apodo / Como te conocen</label>
                <input type="text" className={inputClass} placeholder="Ej: El Carlitos" value={form.apodo} onChange={(e) => update("apodo", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>WhatsApp de contacto *</label>
                <span className={hintClass}>Si eres menor de edad usa el WhatsApp de quien te registra</span>
                <input type="tel" className={inputClass + " mt-1"} placeholder="Ej: 8441234567" value={form.telefono} onChange={(e) => update("telefono", e.target.value)} required />
              </div>
              <div>
                <label className={labelClass}>¿De quién es ese WhatsApp?</label>
                <span className={hintClass}>Solo si el número es de otra persona</span>
                <select className={inputClass} value={form.tutorRelacion} onChange={(e) => update("tutorRelacion", e.target.value)}>
                  <option value="">Es mi propio número</option>
                  <option value="papa">Papá</option>
                  <option value="mama">Mamá</option>
                  <option value="abuelo">Abuelo/a</option>
                  <option value="tutor">Tutor/a</option>
                  <option value="otro">Otro familiar</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Fecha de nacimiento *</label>
                  <span className={hintClass}>Formato: MM/DD/AAAA</span>
                  <input type="date" className={inputClass + " mt-1"} value={form.fechaNacimiento} onChange={(e) => update("fechaNacimiento", e.target.value)} required />
                </div>
                <div>
                  <label className={labelClass}>Ciudad actual</label>
                  <input type="text" className={inputClass + " mt-5"} placeholder="Ej: Saltillo" value={form.ciudad} onChange={(e) => update("ciudad", e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Ocupación</label>
                <input type="text" className={inputClass} placeholder="Ej: Ingeniero, Maestra..." value={form.ocupacion} onChange={(e) => update("ocupacion", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Pareja / Cónyuge</label>
                <input type="text" className={inputClass} placeholder="Nombre completo de tu pareja" value={form.pareja} onChange={(e) => update("pareja", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Generación *</label>
                <select className={inputClass} value={form.generacion} onChange={(e) => update("generacion", e.target.value)} required>
                  <option value="">Selecciona tu generación</option>
                  {GENERACIONES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Rama familiar *</label>
                <select className={inputClass} value={form.rama} onChange={(e) => update("rama", e.target.value)} required>
                  <option value="">¿A qué rama perteneces?</option>
                  {RAMAS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Algo sobre ti</label>
                <textarea className={inputClass + " resize-none"} rows={3} placeholder="Una frase que te describa..." value={form.bio} onChange={(e) => update("bio", e.target.value)} />
              </div>
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 rounded-xl transition-all font-sans">Siguiente →</button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>¿Cuáles son tus intereses?</label>
                <span className={hintClass}>Puedes seleccionar varios</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {INTERESES.map((i) => (
                    <button key={i} type="button" onClick={() => toggleItem("intereses", i)}
                      className={`px-3 py-1.5 rounded-full text-sm font-sans border transition-all ${form.intereses.includes(i) ? "bg-orange-500 text-white border-orange-500" : "bg-white text-green-700 border-green-200 hover:border-orange-300"}`}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>¿Tienes mascotas?</label>
                <span className={hintClass}>Puedes seleccionar varias</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {MASCOTAS.map((m) => (
                    <button key={m} type="button"
                      onClick={() => {
                        if (m === "Ninguna") {
                          update("mascotas", form.mascotas.includes("Ninguna") ? [] : ["Ninguna"]);
                        } else {
                          const sinNinguna = form.mascotas.filter(x => x !== "Ninguna");
                          setForm(f => ({
                            ...f,
                            mascotas: sinNinguna.includes(m)
                              ? sinNinguna.filter(x => x !== m)
                              : [...sinNinguna, m]
                          }));
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-sans border transition-all ${form.mascotas.includes(m) ? "bg-green-600 text-white border-green-600" : "bg-white text-green-700 border-green-200 hover:border-green-400"}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="flex-1 border border-green-200 text-green-700 font-bold py-3 rounded-xl font-sans hover:bg-green-50">← Atrás</button>
                <button onClick={handleSubmitStep2} disabled={guardando}
                  className={`flex-1 font-bold py-3 rounded-xl font-sans transition-all ${guardando ? "bg-green-300 text-white cursor-wait" : "bg-orange-500 hover:bg-orange-400 text-white"}`}>
                  {guardando ? "Guardando..." : "Registrarme ✓"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="text-5xl mb-2">🎉</div>
              <h2 className="text-2xl font-bold text-green-900 font-serif">¡Bienvenido, {form.nombre.split(" ")[0]}!</h2>
              <p className="text-green-600 text-sm font-sans">Ya eres parte oficial de La Gran Familia Villarreal</p>
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 my-4">
                <p className="text-xs text-green-500 font-sans mb-1">Tu código único</p>
                <p className="text-2xl font-bold text-green-800 font-mono tracking-widest">{codigo}</p>
                <p className="text-xs text-green-400 font-sans mt-1">Guardado en Firebase ✓</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                <p className="text-xs text-orange-600 font-sans font-semibold">📱 Para editar tu perfil después</p>
                <p className="text-sm text-orange-800 font-sans mt-1">Ve a <strong>👤 Mi Perfil</strong> y usa el número: <strong>{form.telefono}</strong></p>
                {form.tutorRelacion && (
                  <p className="text-xs text-orange-500 font-sans mt-1">Número registrado a nombre de: {form.tutorRelacion}</p>
                )}
              </div>
              <div className="text-left space-y-2 text-sm font-sans border-t border-green-100 pt-4">
                {[
                  ["Nombre", form.nombre],
                  ["Apodo", form.apodo || "—"],
                  ["Ciudad", form.ciudad || "—"],
                  ["Pareja", form.pareja || "—"],
                  ["Rama", form.rama.replace(/-/g, " ") || "—"],
                  ["Intereses", form.intereses.join(", ") || "—"],
                  ["Mascotas", form.mascotas.join(", ") || "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-green-700 font-semibold">{k}</span>
                    <span className="text-gray-600 capitalize">{v}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleReset} className="w-full mt-4 border border-green-200 text-green-700 font-bold py-3 rounded-xl font-sans hover:bg-green-50">Registrar otro miembro</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}