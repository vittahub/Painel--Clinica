export const patients = [
  {
    id: 1,
    name: "João Silva",
    phone: "(11) 99999-0001",
    email: "joao.silva@email.com",
    birthDate: "1985-03-15",
    cpf: "123.456.789-00",
    address: "Rua das Flores, 123 - São Paulo, SP",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Maria Santos",
    phone: "(11) 99999-0002",
    email: "maria.santos@email.com",
    birthDate: "1990-07-22",
    cpf: "987.654.321-00",
    address: "Av. Paulista, 456 - São Paulo, SP",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Carlos Oliveira",
    phone: "(11) 99999-0003",
    email: "carlos.oliveira@email.com",
    birthDate: "1978-11-08",
    cpf: "456.789.123-00",
    address: "Rua Augusta, 789 - São Paulo, SP",
    image:
      "https://images.unsplash.com/photo-1472099645785-648ed127bb54?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Ana Pereira",
    phone: "(11) 99999-0004",
    email: "ana.pereira@email.com",
    birthDate: "1992-04-12",
    cpf: "789.123.456-00",
    address: "Rua Oscar Freire, 321 - São Paulo, SP",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
  },
];

export const getPatientById = (id) => {
  return patients.find((patient) => patient.id === parseInt(id));
};

export const addPatient = (patientData) => {
  const newPatient = {
    id: patients.length + 1,
    ...patientData,
  };
  patients.push(newPatient);
  return newPatient;
};

export const updatePatient = (id, updatedData) => {
  const index = patients.findIndex((patient) => patient.id === parseInt(id));
  if (index !== -1) {
    patients[index] = { ...patients[index], ...updatedData };
    return patients[index];
  }
  return null;
};

export const deletePatient = (id) => {
  const index = patients.findIndex((patient) => patient.id === parseInt(id));
  if (index !== -1) {
    const deletedPatient = patients.splice(index, 1)[0];
    return deletedPatient;
  }
  return null;
};
