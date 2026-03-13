// src/data/familyData.js
export const FUNDADORES = {
  abuelo: {
    id: "g1-gustavo",
    name: "Gustavo Villarreal Carrillo",
    nickname: "El Abuelo Gustavo",
    fallecido: true,
    generation: 1,
    branch: "fundadores",
    emoji: "👴",
    color: "#14532d",
    bio: "Fundador de la familia y de la Ferretería Sieber.",
    negocio: "Ferretería Sieber",
    spouseId: "g1-dora",
  },
  abuela: {
    id: "g1-dora",
    name: "Dora Maury",
    nickname: "La Abuela Dora",
    fallecido: true,
    generation: 1,
    branch: "fundadores",
    emoji: "👵",
    color: "#14532d",
    bio: "Madre de 14 hijos. El corazón y alma de la familia Villarreal.",
    spouseId: "g1-gustavo",
  },
};

export const HIJOS = [
  { id: "g2-01", orden: 1,  shortName: "Dora Irma",       name: "Dora Irma Villarreal Maury",           nickname: "Dora Irma",  fallecido: false, emoji: "👩", branch: "dora-irma",          born: null, location: null, occupation: null, spouseId: null, childrenIds: [], bio: "" },
  { id: "g2-02", orden: 2,  shortName: "Laura",            name: "Laura Villarreal Maury",               nickname: "Laura",      fallecido: true,  emoji: "🕊️", branch: "laura",               born: null, location: null, occupation: null, spouseId: null, childrenIds: [], bio: "" },
  { id: "g2-03", orden: 3,  shortName: "Gustavo",          name: "Gustavo Villarreal Maury",             nickname: "Gustavo",    fallecido: false, emoji: "👨", branch: "gustavo",             born: null, location: null, occupation: null, spouseId: null, childrenIds: [], bio: "" },
  { id: "g2-04", orden: 4,  shortName: "Fernando",         name: "Fernando Villarreal Maury",            nickname: "Fernando",   fallecido: true,  emoji: "🕊️", branch: "fernando",             born: null, location: null, occupation: null, spouseId: null, childrenIds: [], bio: "" },
  { id: "g2-05", orden: 5,  shortName: "Celia",            name: "Celia Villarreal Maury",               nickname: "Celia",      fallecido: false, emoji: "👩", branch: "celia",               born: null, location: null, occupation: null, spouseId: null, childrenIds: [], bio: "" },
  { id: "g2-06", orden: 6,  shortName: "María del Carmen", name: "María del Carmen Villarreal Maury",    nickname: "Carmen",     fallecido: false, emoji: "👩", branch: "maria-del-carmen",    born: null, location: null, occupation: null, spouseId: null, childrenIds: [], bio: "" },
  { id: "g2-07", orden: 7,  shortName: "Yolanda",          name: "Yolanda Villarreal Maury",             nickname: "Yolanda",    fallecido: false, emoji: "👩", branch: "yolanda",             born: null, location: null, occupation: null, spouseId: null, childrenIds: [], bio: "" },
  { id: "g2-08", orden: 8,  shortName: "Margarita",        name: "Margarita Villarreal Maury",           nickname: "Margarita",  fallecido: false, emoji: "👩", branch: "margarita",           born: null, location: null, occupation: null, spouseId: null, childrenIds: [], bio: "" },
  { id: "g2-09", orden: 9,  shortName: "Patricia",         name: "Patricia Villarreal Maury",            nickname: "Patricia",   fallecido: false, emoji: "👩", branch: "patricia",            born: null, location: null, occupation: null, spouseId: null, childrenIds: [], bio: "" },
  { id: "g2-10", orden: 10, shortName: "Leticia",          name: "Leticia Villarreal Maury",             nickname: "Leticia",    fallecido: false, emoji: "👩", branch: "leticia",             born: null, location: null, occupation: null, spouseId: null, childrenIds: [], bio: "" },
  { id: "g2-11", orden: 11, shortName: "Gabriela",         name: "Gabriela Villarreal Maury",            nickname: "Gaby",       fallecido: false, emoji: "👩", branch: "gabriela",            born: null, location: null, occupation: null, spouseId: null, childrenIds: [], bio: "" },
  { id: "g2-12", orden: 12, shortName: "Eduardo",          name: "Eduardo Villarreal Maury",             nickname: "Eduardo",    fallecido: true,  emoji: "🕊️", branch: "eduardo",              born: null, location: null, occupation: null, spouseId: null, childrenIds: [], bio: "" },
  { id: "g2-13", orden: 13, shortName: "Alejandro",        name: "Alejandro Villarreal Maury",           nickname: "Alejandro",  fallecido: false, emoji: "👨", branch: "alejandro",           born: null, location: null, occupation: null, spouseId: null, childrenIds: [], bio: "" },
  { id: "g2-14", orden: 14, shortName: "Mª de los Santos", name: "María de los Santos Villarreal Maury", nickname: "Santos",     fallecido: false, emoji: "👩", branch: "maria-de-los-santos", born: null, location: null, occupation: null, spouseId: null, childrenIds: [], bio: "" },
];

const hijosCompletos = HIJOS.map((h) => ({
  ...h,
  generation: 2,
  color: h.fallecido ? "#94a3b8" : "#ea580c",
  parentIds: ["g1-gustavo", "g1-dora"],
}));

export const familyData = [
  { ...FUNDADORES.abuelo, childrenIds: HIJOS.map((h) => h.id) },
  { ...FUNDADORES.abuela, childrenIds: HIJOS.map((h) => h.id) },
  ...hijosCompletos,
];

export function generarCodigo(branch, index) {
  const rama = branch.replace(/-/g, "").substring(0, 3).toUpperCase();
  const num = String(index).padStart(3, "0");
  return `VR-${rama}-${num}`;
}

export const RAMAS = hijosCompletos
  .filter((h) => !h.fallecido)
  .map((h) => ({ id: h.branch, label: `Rama ${h.shortName}`, parentId: h.id }));