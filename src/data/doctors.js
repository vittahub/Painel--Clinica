const STORAGE_KEY = "vittahub.doctors";

// Carregar/mesclar com localStorage para persistência entre sessões
const loadDoctorsFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return null;
  } catch {
    return null;
  }
};

const saveDoctorsToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

export let doctors = [
  {
    id: 1,
    name: "Dr. Marcos Santos",
    specialty: "Cardiologia",
    crm: "12345-SP",
    phone: "(11) 99999-0001",
    email: "marcos.santos@vittahub.com",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    workingHours: {
      startTime: "08:00",
      endTime: "18:00",
      interval: 30, // em minutos
      workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    },
  },
  {
    id: 2,
    name: "Dra. Ana Costa",
    specialty: "Dermatologia",
    crm: "23456-SP",
    phone: "(11) 99999-0002",
    email: "ana.costa@vittahub.com",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    workingHours: {
      startTime: "09:00",
      endTime: "17:00",
      interval: 45, // em minutos
      workingDays: ["monday", "wednesday", "friday"],
    },
  },
  {
    id: 3,
    name: "Dr. Carlos Oliveira",
    specialty: "Ortopedia",
    crm: "34567-SP",
    phone: "(11) 99999-0003",
    email: "carlos.oliveira@vittahub.com",
    image:
      "https://images.unsplash.com/photo-1472099645785-648ed127bb54?w=150&h=150&fit=crop&crop=face",
    workingHours: {
      startTime: "07:00",
      endTime: "19:00",
      interval: 60, // em minutos
      workingDays: ["monday", "tuesday", "thursday", "friday"],
    },
  },
];

// Inicializar armazenamento se vazio
const stored = loadDoctorsFromStorage();
if (!stored) {
  saveDoctorsToStorage(doctors);
} else {
  doctors = stored;
}

export const getDoctorById = (id) => {
  return doctors.find((doctor) => doctor.id === parseInt(id));
};

export const addDoctor = (doctorData) => {
  const newDoctor = {
    id: doctors.length > 0 ? Math.max(...doctors.map((d) => d.id)) + 1 : 1,
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face", // Imagem padrão
    ...doctorData,
  };
  doctors.push(newDoctor);
  saveDoctorsToStorage(doctors);
  return newDoctor;
};

export const updateDoctor = (id, updatedData) => {
  const index = doctors.findIndex((doctor) => doctor.id === parseInt(id));
  if (index !== -1) {
    doctors[index] = { ...doctors[index], ...updatedData };
    saveDoctorsToStorage(doctors);
    return doctors[index];
  }
  return null;
};

export const deleteDoctor = (id) => {
  const index = doctors.findIndex((doctor) => doctor.id === parseInt(id));
  if (index !== -1) {
    const deletedDoctor = doctors.splice(index, 1)[0];
    saveDoctorsToStorage(doctors);
    return deletedDoctor;
  }
  return null;
};
