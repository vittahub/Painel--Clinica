import { getDoctorById } from "./doctors.js";

const STORAGE_KEY = "vittahub.appointments";

const loadAppointments = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveAppointments = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
};

export const createAppointment = ({
  clinicId,
  clinicName,
  doctorId,
  doctorName,
  patientId,
  patientName,
  patientPhone = "",
  date,
  time,
  procedure = "Consulta",
  procedures = [],
  status = "confirmado",
  paymentType = "particular",
  healthPlan = "",
  notes = "",
  priority = "normal",
}) => {
  const current = loadAppointments();
  const normalizedProcedures = Array.isArray(procedures)
    ? procedures.filter(Boolean)
    : [];
  const finalProcedure =
    normalizedProcedures.length > 0
      ? normalizedProcedures.join(", ")
      : procedure;
  const newAppt = {
    id: Date.now(),
    clinicId,
    clinicName,
    doctorId,
    doctorName,
    patientId,
    patientName,
    patientPhone,
    date,
    time,
    duration: 30,
    type: "appointment",
    procedure: finalProcedure,
    procedures: normalizedProcedures,
    status,
    paymentType,
    healthPlan,
    notes,
    priority,
  };
  current.push(newAppt);
  saveAppointments(current);

  return newAppt;
};

export const listAppointments = (filter = {}) => {
  const all = loadAppointments();
  return all.filter(
    (a) =>
      (filter.clinicId ? a.clinicId === filter.clinicId : true) &&
      (filter.doctorId ? a.doctorId === filter.doctorId : true) &&
      (filter.patientId ? a.patientId === filter.patientId : true) &&
      (filter.date ? a.date === filter.date : true)
  );
};

// Função para gerar horários baseados nas configurações do médico
// Parse date string (YYYY-MM-DD) in local timezone to avoid UTC shifts
const parseLocalDate = (dateStr) => {
  if (!dateStr) return new Date();
  const parts = String(dateStr)
    .split("-")
    .map((n) => parseInt(n, 10));
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return new Date(y, m - 1, d);
  }
  return new Date(dateStr);
};

export const generateAgendaSlots = (doctorId, date) => {
  const doctor = getDoctorById(doctorId);
  if (!doctor) return [];

  const workingHours = doctor.workingHours || {
    startTime: "08:00",
    endTime: "18:00",
    interval: 30,
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  };
  const { startTime, endTime, interval } = workingHours;

  // Verificar se é um dia útil para o médico (usando fuso local)
  const dayOfWeek = parseLocalDate(date).getDay();
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const currentDay = dayNames[dayOfWeek];

  if (!workingHours.workingDays.includes(currentDay)) {
    return []; // Não trabalha neste dia
  }

  const slots = [];
  let currentTime = new Date(`2000-01-01T${startTime}`);
  const endDateTime = new Date(`2000-01-01T${endTime}`);

  while (currentTime < endDateTime) {
    const timeString = currentTime.toTimeString().slice(0, 5);

    slots.push({
      id: `slot-${doctorId}-${date}-${timeString}`,
      time: timeString,
      duration: interval,
      type: "available",
      doctorId: doctorId,
      date: date,
    });

    // Adicionar intervalo ao tempo atual
    currentTime.setMinutes(currentTime.getMinutes() + interval);
  }

  return slots;
};

// Função para obter agenda de um médico em uma data específica
export const getDoctorAgenda = (doctorId, date) => {
  const baseSlots = generateAgendaSlots(doctorId, date);
  const persisted = listAppointments({ doctorId, date });

  const combinedAgenda = [...baseSlots];

  // Mesclar agendamentos persistidos em seus horários
  persisted.forEach((appointment) => {
    const slotIndex = combinedAgenda.findIndex(
      (slot) => slot.time === appointment.time
    );
    const withPatient = {
      id: appointment.id,
      time: appointment.time,
      duration: 30,
      type: "appointment",
      patientId: appointment.patientId,
      patient: {
        name: appointment.patientName,
        phone: appointment.patientPhone || "",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      },
      procedure: appointment.procedure || "Consulta",
      procedures: appointment.procedures || [],
      status: appointment.status || "confirmado",
      paymentType: appointment.paymentType || "particular",
      healthPlan: appointment.healthPlan || "",
      doctorId: appointment.doctorId,
      date: appointment.date,
      notes: appointment.notes || "",
      priority: appointment.priority || "normal",
    };
    if (slotIndex !== -1) {
      combinedAgenda[slotIndex] = withPatient;
    } else {
      combinedAgenda.push(withPatient);
    }
  });

  return combinedAgenda
    .filter((item) => item.time) // garantir apenas itens com horário válido
    .sort((a, b) => a.time.localeCompare(b.time));
};

// Função para atualizar status de um agendamento
export const updateAppointmentStatus = (agenda, appointmentId, newStatus) => {
  return agenda.map((item) =>
    item.id === appointmentId ? { ...item, status: newStatus } : item
  );
};

// Função para remover agendamento da agenda
export const removeAppointment = (agenda, appointmentId) => {
  return agenda.filter((item) => item.id !== appointmentId);
};

// Função para bloquear horário
export const blockTimeSlot = (agenda, timeSlot, reason) => {
  const blockedSlot = {
    id: `blocked-${Date.now()}`,
    time: timeSlot.time,
    duration: timeSlot.duration,
    type: "blocked",
    reason: reason,
    doctorId: timeSlot.doctorId,
    date: timeSlot.date,
  };

  return agenda.map((item) => (item.id === timeSlot.id ? blockedSlot : item));
};

// Atualizar um agendamento existente (em localStorage)
export const updateAppointment = (appointmentId, updates = {}) => {
  const current = loadAppointments();
  const index = current.findIndex((a) => a.id === appointmentId);
  if (index === -1) {
    throw new Error("Agendamento não encontrado");
  }

  const existing = current[index];

  const newDoctorId =
    updates.doctorId !== undefined ? updates.doctorId : existing.doctorId;
  const newDate = updates.date !== undefined ? updates.date : existing.date;
  const newTime = updates.time !== undefined ? updates.time : existing.time;

  // Checar conflito: não permitir dois agendamentos no mesmo horário/médico/data
  const conflict = current.some(
    (a) =>
      a.id !== appointmentId &&
      a.doctorId === newDoctorId &&
      a.date === newDate &&
      a.time === newTime
  );
  if (conflict) {
    throw new Error("Horário indisponível para este médico");
  }

  const normalizedProcedures = Array.isArray(updates.procedures)
    ? updates.procedures.filter(Boolean)
    : Array.isArray(existing.procedures)
    ? existing.procedures
    : [];

  const finalProcedure =
    normalizedProcedures.length > 0
      ? normalizedProcedures.join(", ")
      : updates.procedure !== undefined
      ? updates.procedure
      : existing.procedure;

  const updated = {
    ...existing,
    ...updates,
    doctorId: newDoctorId,
    date: newDate,
    time: newTime,
    procedures: normalizedProcedures,
    procedure: finalProcedure,
  };

  current[index] = updated;
  saveAppointments(current);
  return updated;
};

// Remover um agendamento definitivamente do armazenamento (libera o horário)
export const deleteAppointment = (appointmentId) => {
  const current = loadAppointments();
  const next = current.filter((a) => a.id !== appointmentId);
  saveAppointments(next);
  return true;
};
