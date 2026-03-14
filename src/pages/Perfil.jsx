// src/pages/Perfil.jsx
import { useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

export default function Perfil() {
  const [paso, setPaso] = useState("buscar"); // buscar | editar | listo
  const [codigo, setCodigo] = useState("");
  const [miembro, setMiembro] = useState(null);
  const [docId, setDocId] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [form, setForm] = useState({});

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const buscarMiembro = async () => {
    if (!codigo.trim()) return;
    setBuscando(true);
    try {
      const q = query(collection(db, "miembros"), where("codigo", "==", codigo.trim()));
      const snap = await getDocs(q);
      if (snap.empty) {
        alert("Código no encontrado. Verifica tu código VR-XXX-000");
        setBuscando(false);
        return;
      }
      const docData = snap.docs[0];
      setDocId(docData.id);
      setMiembro(docData.data());
      setForm(docData.data());
      if (docData.data().fotoUrl) setFotoPreview(docData.data().fotoUrl);
      setPaso("editar");
    } catch (error) {
      console.error(error);
      alert("Error al buscar. Intenta de nuevo.");
    } finally {
      setBuscando(false);
    }
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("La foto debe ser menor a 5MB");
      return;
    }
    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
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
      await updateDoc(doc(db, "miembros", docId), { ...form, fotoUrl });
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

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-900 font-serif">👤 Mi Perfil</h1>
          <p className="text-green-600 text-sm mt-1 font-sans">Actualiza tu información y foto</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">

          {/* ── PASO 1: Buscar por código ── */}
          {paso === "buscar" && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-green-700 font-semibold font-serif text-lg">Ingresa tu código familiar</p>
                <p className="text-green-400 text-xs font-sans mt-1">El código que recibiste al registrarte (ej: VR-GUS-123)</p>
              </div>
              <input
                type="text"
                className={inputClass + " text-center font-mono text-lg tracking-widest uppercase"}
                placeholder="VR-XXX-000"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              />
              <button
                onClick={buscarMiembro}
                disabled={buscando}
                className={`w-full font-bold py-3 rounded-xl font-sans transition-all ${buscando ? "bg-green-300 text-white cursor-wait" : "bg-orange-500 hover:bg-orange-400 text-white"}`}
              >
                {buscando ? "Buscando..." : "Buscar mi perfil →"}
              </button>
            </div>
          )}

          {/* ── PASO 2: Editar perfil ── */}
          {paso === "editar" && miembro && (
            <div className="space-y-4">
              {/* Foto */}
              <div className="flex flex-col items-center gap-3 pb-4 border-b border-green-100">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-200 bg-green-50 flex items-center justify-center">
                    {fotoPreview ? (
                      <img src={fotoPreview} alt="foto" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">👤</span>
                    )}
                  </div>
                </div>
                <label className="cursor-pointer bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-xl px-4 py-2 text-xs font-semibold font-sans transition-all">
                  📸 {fotoPreview ? "Cambiar foto" : "Subir foto"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFoto} />
                </label>
                <p className="text-[10px] text-green-400 font-sans">JPG, PNG — máx 5MB</p>
              </div>

              {/* Datos */}
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
                <label className={labelClass}>Pareja / Cónyuge</label>
                <input type="text" className={inputClass} value={form.pareja || ""} onChange={(e) => update("pareja", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Algo sobre ti</label>
                <textarea className={inputClass + " resize-none"} rows={3} value={form.bio || ""} onChange={(e) => update("bio", e.target.value)} />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setPaso("buscar")} className="flex-1 border border-green-200 text-green-700 font-bold py-3 rounded-xl font-sans hover:bg-green-50">← Atrás</button>
                <button onClick={guardar} disabled={guardando}
                  className={`flex-1 font-bold py-3 rounded-xl font-sans transition-all ${guardando ? "bg-green-300 text-white cursor-wait" : "bg-orange-500 hover:bg-orange-400 text-white"}`}>
                  {guardando ? "Guardando..." : "Guardar cambios ✓"}
                </button>
              </div>
            </div>
          )}

          {/* ── PASO 3: Confirmación ── */}
          {paso === "listo" && (
            <div className="text-center space-y-4 py-4">
              <div className="text-5xl mb-2">✅</div>
              <h2 className="text-2xl font-bold text-green-900 font-serif">¡Perfil actualizado!</h2>
              <p className="text-green-600 text-sm font-sans">Tus cambios quedaron guardados en la familia</p>
              {fotoPreview && (
                <div className="flex justify-center">
                  <img src={fotoPreview} alt="foto" className="w-20 h-20 rounded-full object-cover border-4 border-orange-200" />
                </div>
              )}
              <button onClick={() => { setPaso("buscar"); setCodigo(""); setFoto(null); setFotoPreview(null); }}
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