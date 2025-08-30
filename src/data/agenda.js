import { getDoctorById } from "./doctors.js";

// Função para gerar horários baseados nas configurações do médico
export const generateAgendaSlots = (doctorId, date) => {
  const doctor = getDoctorById(doctorId);
  if (!doctor) return [];

  const { workingHours } = doctor;
  const { startTime, endTime, interval } = workingHours;

  // Verificar se é um dia útil para o médico
  const dayOfWeek = new Date(date).getDay();
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

  // Dados simulados de agendamentos existentes
  const existingAppointments = [
    {
      id: 1,
      time: "08:00",
      duration: 30,
      type: "appointment",
      patient: {
        name: "João Silva",
        phone: "(11) 99999-0001",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      },
      procedure: "Consulta de rotina",
      status: "confirmado",
      doctorId: doctorId,
      date: date,
    },
    {
      id: 2,
      time: "08:30",
      duration: 30,
      type: "appointment",
      patient: {
        name: "Maria Santos",
        phone: "(11) 99999-0002",
        image:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      },
      procedure: "Exame de rotina",
      status: "em-espera",
      doctorId: doctorId,
      date: date,
    },
    {
      id: 3,
      time: "09:30",
      duration: 30,
      type: "appointment",
      patient: {
        name: "Carlos Oliveira",
        phone: "(11) 99999-0003",
        image:
          "https://images.unsplash.com/photo-1472099645785-648ed127bb54?w=40&h=40&fit=crop&crop=face",
      },
      procedure: "Retorno",
      status: "nao-confirmado",
      doctorId: doctorId,
      date: date,
    },
    {
      id: 4,
      time: "10:30",
      duration: 30,
      type: "appointment",
      patient: {
        name: "Ana Pereira",
        phone: "(11) 99999-0004",
        image:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      },
      procedure: "Primeira consulta",
      status: "atendido",
      doctorId: doctorId,
      date: date,
    },
  ];

  // Combinar slots base com agendamentos existentes
  const combinedAgenda = [...baseSlots];

  existingAppointments.forEach((appointment) => {
    const slotIndex = combinedAgenda.findIndex(
      (slot) => slot.time === appointment.time
    );
    if (slotIndex !== -1) {
      combinedAgenda[slotIndex] = appointment;
    }
  });

  // Adicionar alguns horários bloqueados para exemplo
  const blockedSlots = [
    {
      id: 5,
      time: "10:00",
      duration: 30,
      type: "blocked",
      reason: "Pausa para almoço",
      doctorId: doctorId,
      date: date,
    },
  ];

  blockedSlots.forEach((blocked) => {
    const slotIndex = combinedAgenda.findIndex(
      (slot) => slot.time === blocked.time
    );
    if (slotIndex !== -1) {
      combinedAgenda[slotIndex] = blocked;
    }
  });

  return combinedAgenda.sort((a, b) => a.time.localeCompare(b.time));
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
