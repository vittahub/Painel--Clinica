const CLINICS_KEY = "vittahub.clinics";
const CURRENT_CLINIC_KEY = "vittahub.currentClinicId";

const defaultClinics = [
  { id: 1, name: "Clínica Vida & Saúde" },
  { id: 2, name: "Centro Ortopédico Avançado" },
  { id: 3, name: "Mente Sã Psicologia" },
  { id: 4, name: "Visão Clara Oftalmologia" },
  { id: 5, name: "Sorriso Perfeito Odontologia" },
  { id: 6, name: "Derma Pelle Dermatologia" },
  { id: 7, name: "VittaHub" },
];

const load = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export const getClinics = () => {
  const existing = load(CLINICS_KEY);
  if (!existing) {
    save(CLINICS_KEY, defaultClinics);
    return defaultClinics;
  }
  return existing;
};

export const getCurrentClinicId = () => {
  const value = load(CURRENT_CLINIC_KEY);
  if (typeof value === "number") return value;
  // fallback para primeira clínica
  save(CURRENT_CLINIC_KEY, 1);
  return 1;
};

export const setCurrentClinicId = (id) => {
  save(CURRENT_CLINIC_KEY, id);
};

