// src/pages/Perfil.jsx
import { useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

const RELACIONES = [
  "Pareja / Cónyuge",
  "Estrella que no se apaga (pareja) 🕊️",
  "Padre",
  "Madre",
  "Hijo/a",
  "Estrella que no se apaga (hijo/a) 🕊️",
  "Hermano/a",
  "Estrella que no se apaga (hermano/a) 🕊️",
  "Abuelo/a",
  "Nieto/a",
  "Tío/a",
  "Sobrino/a",
  "Primo/a",
  "Otro familiar",
  "Estrella que no se apaga 🕊️",
];

export default function Perfil() {
  const [paso, setPaso] = useState("buscar");
  const [telefono, setTelefono] = useState("");
  const [miembro, setMiembro] = useState(null);
  const [docId, setDocId] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [form, setForm] = useState({});
  const [tab, setTab] = useState("datos"); // datos | conexiones
  const [todosMiembros, setTodosMiembros] = useState([]);
  const [busquedaFamiliar, setBusquedaFamiliar] = useState("");
  const [conexiones, setConexiones] = useState([]); // [{id, nombre, relacion}]
  const [agregando, setAgregando] = useState(null); // miembro seleccionado para agregar

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const buscarMiembro = async () => {
    if (!telefono.trim()) return;
    setBuscando(true);
    try {
      const q = query(collection(db, "miembros"), where("telefono", "==", telefono.trim()));
      const snap = await getDocs(q);
      if (snap.empty) {
        alert("Número no encontrado. ¿Ya te registraste?");
        setBuscando(false);
        return;
      }
      if (snap.docs.length > 1) {
        setMiembro(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setPaso("elegir");
        setBuscando(false);
        return;
      }
      const docData = snap.docs[0];
      setDocId(docData.id);
      setForm(docData.data());
      setConexiones(docData.data().conexiones || []);
      if (docData.data().fotoUrl) setFotoPreview(docData.data().fotoUrl);

      // Cargar todos los miembros para buscar conexiones
      const todos = await getDocs(collection(db, "miembros"));
      setTodosMiembros(todos.docs.map(d => ({ id: d.id, ...d.data() })).filter(m => m.id !== docData.id));

      setPaso("editar");
    } catch (error) {
      console.error(error);
      alert("Error al buscar. Intenta de nuevo.");
    } finally {
      setBuscando(false);
    }
  };

  const elegirMiembro = async (m) => {
    setDocId(m.id);
    setForm(m);
    setConexiones(m.conexiones || []);
    if (m.fotoUrl) setFotoPreview(m.fotoUrl);
    const todos = await getDocs(collection(db, "miembros"));
    setTodosMiembros(todos.docs.map(d => ({ id: d.id, ...d.data() })).filter(x => x.id !== m.id));
    setPaso("editar");
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("La foto debe ser menor a 5MB"); return; }
    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const agregarConexion = (miembroSeleccionado, relacion) => {
    if (conexiones.find(c => c.id === miembroSeleccionado.id)) {
      alert("Ya está agregado como familiar");
      return;
    }
    setConexiones(prev => [...prev, {
      id: miembroSeleccionado.id,
      nombre: miembroSeleccionado.nombre,
      relacion,
    }]);
    setAgregando(null);
    setBusquedaFamiliar("");
  };

  const quitarConexion = (id) => {
    setConexiones(prev => prev.filter(c => c.id !== id));
  };

  const guardar = async () => {
    setGuardando(true);
    try {
      let fotoUrl = form.fotoUrl || "";
      if (foto) {
        const storageRef = ref(storage, `fotos/${docId}`);
        await uploadBytes(storageRef, foto);
        fotoUrl = await getDownloadURL(storageRef);
      }
      await updateDoc(doc(db, "miembros", docId), { ...form, fotoUrl, conexiones });
      setPaso("listo");
    } catch (error) {
      console.error(error);
      alert("Error al guardar. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  const inputClass = "w-full border border-green-200 rounded-xl px-4 py-2.5 text-sm font-sans text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white";
  const labelClass = "block text-xs font-semibold text-green-700 mb-1 font-sans uppercase tracking-wide";

  const familiaresFiltered = todosMiembros.filter(m =>
    m.nombre?.toLowerCase().includes(busquedaFamiliar.toLowerCase()) ||
    m.apodo?.toLowerCase().includes(busquedaFamiliar.toLowerCase())
  ).slice(0, 8);

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-900 font-serif">👤 Mi Perfil</h1>
          <p className="text-green-600 text-sm mt-1 font-sans">Actualiza tu información y conexiones familiares</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">

          {/* ── BUSCAR ── */}
          {paso === "buscar" && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className="text-4xl mb-3">📱</p>
                <p className="text-green-700 font-semibold font-serif text-lg">Ingresa tu WhatsApp</p>
                <p className="text-green-400 text-xs font-sans mt-1">El mismo número que usaste al registrarte</p>
              </div>
              <input type="tel" className={inputClass + " text-center text-lg tracking-widest"}
                placeholder="Ej: 8441234567" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              <button onClick={buscarMiembro} disabled={buscando}
                className={`w-full font-bold py-3 rounded-xl font-sans transition-all ${buscando ? "bg-green-300 text-white cursor-wait" : "bg-orange-500 hover:bg-orange-400 text-white"}`}>
                {buscando ? "Buscando..." : "Buscar mi perfil →"}
              </button>
            </div>
          )}

          {/* ── ELEGIR ── */}
          {paso === "elegir" && Array.isArray(miembro) && (
            <div className="space-y-3">
              <div className="text-center py-2">
                <p className="text-2xl mb-2">👨‍👩‍👧‍👦</p>
                <p className="text-green-700 font-semibold font-serif">¿Quién quiere editar su perfil?</p>
              </div>
              {miembro.map((m) => (
                <button key={m.id} onClick={() => elegirMiembro(m)}
                  className="w-full text-left bg-green-50 hover:bg-orange-50 border border-green-200 hover:border-orange-300 rounded-xl px-4 py-3 transition-all">
                  <p className="font-bold text-green-900 font-serif text-sm">{m.nombre}</p>
                  <p className="text-xs text-green-500 font-sans">
                    {m.generacion?.toUpperCase()} · Rama {m.rama?.replace(/-/g, " ")}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* ── EDITAR ── */}
          {paso === "editar" && (
            <div>
              {/* Foto y nombre */}
              <div className="flex flex-col items-center gap-2 pb-4 border-b border-green-100 mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-200 bg-green-50 flex items-center justify-center">
                  {fotoPreview ? <img src={fotoPreview} alt="foto" className="w-full h-full object-cover" /> : <span className="text-4xl">👤</span>}
                </div>
                <label className="cursor-pointer bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-xl px-4 py-1.5 text-xs font-semibold font-sans">
                  📸 {fotoPreview ? "Cambiar foto" : "Subir foto"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFoto} />
                </label>
                <p className="font-bold text-green-900 font-serif">{form.nombre}</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-green-50 rounded-xl p-1 mb-4">
                {["datos", "conexiones"].map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold font-sans transition-all ${tab === t ? "bg-orange-500 text-white" : "text-green-700 hover:bg-green-100"}`}>
                    {t === "datos" ? "📝 Mis datos" : "🔗 Mi familia"}
                  </button>
                ))}
              </div>

              {/* ── TAB DATOS ── */}
              {tab === "datos" && (
                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>Nombre completo</label>
                    <input type="text" className={inputClass} value={form.nombre || ""} onChange={(e) => update("nombre", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Apodo</label>
                    <input type="text" className={inputClass} value={form.apodo || ""} onChange={(e) => update("apodo", e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Ciudad</label>
                      <input type="text" className={inputClass} value={form.ciudad || ""} onChange={(e) => update("ciudad", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelClass}>Ocupación</label>
                      <input type="text" className={inputClass} value={form.ocupacion || ""} onChange={(e) => update("ocupacion", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Algo sobre ti</label>
                    <textarea className={inputClass + " resize-none"} rows={3} value={form.bio || ""} onChange={(e) => update("bio", e.target.value)} />
                  </div>
                </div>
              )}

              {/* ── TAB CONEXIONES ── */}
              {tab === "conexiones" && (
                <div className="space-y-4">
                  {/* Conexiones existentes */}
                  {conexiones.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-green-700 font-sans uppercase tracking-wide">Mis conexiones</p>
                      {conexiones.map((c) => (
                        <div key={c.id} className="flex items-center gap-3 bg-green-50 rounded-xl px-3 py-2">
                          <span className="text-lg">👤</span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-green-900 font-serif">{c.nombre}</p>
                            <p className="text-xs text-orange-500 font-sans">{c.relacion}</p>
                          </div>
                          <button onClick={() => quitarConexion(c.id)}
                            className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Buscar familiar */}
                  <div>
                    <p className="text-xs font-semibold text-green-700 font-sans uppercase tracking-wide mb-2">Agregar familiar</p>
                    <input type="text" className={inputClass} placeholder="Busca por nombre o apodo..."
                      value={busquedaFamiliar} onChange={(e) => { setBusquedaFamiliar(e.target.value); setAgregando(null); }} />
                  </div>

                  {/* Resultados de búsqueda */}
                  {busquedaFamiliar && (
                    <div className="space-y-2">
                      {familiaresFiltered.length === 0 ? (
                        <p className="text-xs text-green-400 font-sans text-center py-2">No se encontraron resultados</p>
                      ) : (
                        familiaresFiltered.map((m) => (
                          <div key={m.id}>
                            <button onClick={() => setAgregando(agregando?.id === m.id ? null : m)}
                              className={`w-full text-left rounded-xl px-3 py-2 border transition-all ${agregando?.id === m.id ? "bg-orange-50 border-orange-300" : "bg-green-50 border-green-200 hover:border-orange-200"}`}>
                              <p className="text-sm font-semibold text-green-900 font-serif">{m.nombre}</p>
                              <p className="text-xs text-green-500 font-sans">
                                {m.generacion?.toUpperCase()} · Rama {m.rama?.replace(/-/g, " ")}
                              </p>
                            </button>

                            {/* Selector de relación */}
                            {agregando?.id === m.id && (
                              <div className="mt-1 p-2 bg-orange-50 rounded-xl border border-orange-200">
                                <p className="text-xs text-orange-600 font-sans mb-2">¿Qué relación tiene contigo?</p>
                                <div className="flex flex-wrap gap-1">
                                  {RELACIONES.map((r) => (
                                    <button key={r} onClick={() => agregarConexion(m, r)}
                                      className="px-2 py-1 bg-white border border-orange-300 hover:bg-orange-500 hover:text-white text-orange-700 rounded-lg text-xs font-sans transition-all">
                                      {r}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {conexiones.length === 0 && !busquedaFamiliar && (
                    <div className="text-center py-4">
                      <p className="text-3xl mb-2">🔗</p>
                      <p className="text-green-500 text-sm font-sans">Busca a tus familiares arriba para conectarte con ellos</p>
                    </div>
                  )}
                </div>
              )}

              {/* Botón guardar */}
              <div className="flex gap-3 pt-4 mt-4 border-t border-green-100">
                <button onClick={() => setPaso("buscar")} className="flex-1 border border-green-200 text-green-700 font-bold py-3 rounded-xl font-sans hover:bg-green-50">← Atrás</button>
                <button onClick={guardar} disabled={guardando}
                  className={`flex-1 font-bold py-3 rounded-xl font-sans transition-all ${guardando ? "bg-green-300 text-white cursor-wait" : "bg-orange-500 hover:bg-orange-400 text-white"}`}>
                  {guardando ? "Guardando..." : "Guardar ✓"}
                </button>
              </div>
            </div>
          )}

          {/* ── LISTO ── */}
          {paso === "listo" && (
            <div className="text-center space-y-4 py-4">
              <div className="text-5xl mb-2">✅</div>
              <h2 className="text-2xl font-bold text-green-900 font-serif">¡Perfil actualizado!</h2>
              <p className="text-green-600 text-sm font-sans">Tus datos y conexiones familiares quedaron guardados</p>
              {fotoPreview && (
                <div className="flex justify-center">
                  <img src={fotoPreview} alt="foto" className="w-20 h-20 rounded-full object-cover border-4 border-orange-200" />
                </div>
              )}
              {conexiones.length > 0 && (
                <div className="bg-green-50 rounded-xl p-3 text-left">
                  <p className="text-xs text-green-600 font-sans font-semibold mb-2">🔗 Tus conexiones:</p>
                  {conexiones.map((c) => (
                    <p key={c.id} className="text-sm text-green-800 font-sans">• {c.nombre} <span className="text-orange-500">({c.relacion})</span></p>
                  ))}
                </div>
              )}
              <button onClick={() => { setPaso("buscar"); setTelefono(""); setFoto(null); setFotoPreview(null); setConexiones([]); }}
                className="w-full border border-green-200 text-green-700 font-bold py-3 rounded-xl font-sans hover:bg-green-50">
                Actualizar otro perfil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}