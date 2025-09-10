import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Clock,
  User,
  Phone,
  Edit,
  UserCheck,
  Eraser,
  Lock,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { ClockPlus } from "../components/layout/Icons";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import DatePicker from "../components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import SchedulingModal from "../components/SchedulingModal";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useToast } from "../components/ui/use-toast";
import { getDoctorById, doctors } from "../data/doctors";
import {
  getDoctorAgenda,
  updateAppointmentStatus,
  removeAppointment,
  blockTimeSlot,
  deleteAppointment,
} from "../data/agenda";
import { patients } from "../data/patients";
import { getClinics, getCurrentClinicId } from "../data/clinics";

const AgendaMedico = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [activeFilter, setActiveFilter] = useState("todos");
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showBlockTime, setShowBlockTime] = useState(false);
  const [agenda, setAgenda] = useState([]);

  // Form de agendamento
  const [formDoctorId, setFormDoctorId] = useState("");
  const [formPatientId, setFormPatientId] = useState("");
  const [formPatientName, setFormPatientName] = useState("");
  const [formPatientQuery, setFormPatientQuery] = useState("");
  const [showPatientSuggestions, setShowPatientSuggestions] = useState(false);
  const [formPaymentType, setFormPaymentType] = useState("particular");
  const [formHealthPlan, setFormHealthPlan] = useState("");
  const [formProcedure, setFormProcedure] = useState("");
  const [formProcedures, setFormProcedures] = useState([]);
  const [formNotes, setFormNotes] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formPatientPhone, setFormPatientPhone] = useState("");
  const [modalMode, setModalMode] = useState("create");
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [modalInitialTime, setModalInitialTime] = useState("");
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [appointmentPendingRemoval, setAppointmentPendingRemoval] =
    useState(null);

  // Dados do médico (vindos da navegação ou buscados por ID)
  const doctor = location.state?.doctor || getDoctorById(id);

  // Status disponíveis para os agendamentos
  const statusOptions = [
    {
      value: "em-espera",
      label: "Em Espera",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "confirmado",
      label: "Confirmado",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "agendado",
      label: "Agendado",
      color: "bg-gray-100 text-gray-800",
    },
    {
      value: "atendido",
      label: "Atendido",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "cancelado",
      label: "Cancelado",
      color: "bg-red-100 text-red-800",
    },
    {
      value: "reagendado",
      label: "Reagendado",
      color: "bg-purple-100 text-purple-800",
    },
  ];

  // Carregar agenda quando a data ou médico mudar
  useEffect(() => {
    if (doctor && selectedDate) {
      const agendaData = getDoctorAgenda(doctor.id, selectedDate);
      setAgenda(agendaData);
    }
  }, [doctor, selectedDate]);

  // Realtime removido a pedido

  // Sincronizar nome do paciente quando selecionado
  useEffect(() => {
    if (formPatientId) {
      const p = patients.find((pt) => pt.id === parseInt(formPatientId));
      if (p) {
        setFormPatientName(p.name);
        setFormPatientQuery(`${p.name} - ${p.cpf || ""}`);
        setFormPatientPhone(p.phone || "");
      } else {
        setFormPatientName("");
      }
    }
  }, [formPatientId]);

  // Filtrar agenda baseado no filtro ativo
  const filteredAgenda = agenda.filter((item) => {
    if (activeFilter === "todos") return true;
    if (activeFilter === "em-espera") return item.status === "em-espera";
    if (activeFilter === "confirmado") return item.status === "confirmado";
    if (activeFilter === "agendado") return item.status === "agendado";
    if (activeFilter === "atendido") return item.status === "atendido";
    if (activeFilter === "cancelado") return item.status === "cancelado";
    if (activeFilter === "reagendado") return item.status === "reagendado";
    return true;
  });

  // Função para atualizar status de um agendamento
  const handleUpdateAppointmentStatus = (id, newStatus) => {
    const updatedAgenda = updateAppointmentStatus(agenda, id, newStatus);
    setAgenda(updatedAgenda);
    toast({
      title: "Status atualizado!",
      description: "O status do agendamento foi alterado com sucesso.",
      duration: 2000,
    });
  };

  // Função para agendar novo paciente
  const scheduleNewPatient = (timeSlot) => {
    // Abrir modal já com horário selecionado
    setFormTime(timeSlot.time);
    setModalInitialTime(timeSlot.time);
    setFormDoctorId(String(doctor.id));
    setFormPatientPhone("");
    setFormPatientId("");
    setFormPatientName("");
    setFormPatientQuery("");
    setFormPaymentType("particular");
    setFormHealthPlan("");
    setFormProcedure("");
    setFormProcedures([]);
    setFormNotes("");
    setModalMode("create");
    setEditingAppointmentId(null);
    setShowNewAppointment(true);
  };

  // Função para bloquear horário
  const handleBlockTimeSlot = (timeSlot) => {
    const reason = prompt("Motivo do bloqueio:");
    if (reason) {
      const updatedAgenda = blockTimeSlot(agenda, timeSlot, reason);
      setAgenda(updatedAgenda);
      toast({
        title: "Horário bloqueado!",
        description: "O horário foi bloqueado com sucesso.",
        duration: 2000,
      });
    }
  };

  // Função para bloquear agenda do dia
  const blockEntireDay = () => {
    const reason = prompt("Motivo do bloqueio do dia:");
    if (reason) {
      const updatedAgenda = agenda.map((item) => {
        if (item.type === "available") {
          return {
            ...item,
            type: "blocked",
            reason: reason,
          };
        }
        return item; // mantém agendamentos e bloqueios existentes como estão
      });
      setAgenda(updatedAgenda);
      toast({
        title: "Dia bloqueado!",
        description:
          "Somente os horários vazios foram bloqueados. Agendamentos foram mantidos.",
      });
    }
  };

  // 'Novo Horário': abrir o mesmo modal, mas com horário manual (sem sugestões)
  const handleNewSlotClick = () => {
    setModalMode("create");
    setEditingAppointmentId(null);
    setFormDoctorId(String(doctor.id));
    setFormTime(""); // horário será digitado manualmente
    setModalInitialTime(""); // garantir que o modal também tenha horário vazio
    setFormPatientId("");
    setFormPatientName("");
    setFormPatientQuery("");
    setFormPatientPhone("");
    setFormPaymentType("particular");
    setFormHealthPlan("");
    setFormProcedure("");
    setFormProcedures([]);
    setFormNotes("");
    setShowNewAppointment(true);
  };

  const availableTimes = (() => {
    const targetDoctorId = formDoctorId ? parseInt(formDoctorId) : doctor?.id;
    if (!targetDoctorId || !selectedDate) return [];
    const ag = getDoctorAgenda(targetDoctorId, selectedDate);
    return ag.filter((i) => i.type === "available").map((i) => i.time);
  })();

  const handleCreateAppointment = (e) => {
    e?.preventDefault?.();
    try {
      const clinics = getClinics();
      const currentClinicId = getCurrentClinicId();
      const clinic = clinics.find((c) => c.id === currentClinicId);
      const resolvedDoctorId = formDoctorId
        ? parseInt(formDoctorId)
        : doctor.id;
      const resolvedDoctor = getDoctorById(resolvedDoctorId);

      if (!selectedDate || !formTime) {
        toast({
          title: "Selecione data e horário",
          description: "Escolha um horário disponível para o agendamento.",
          duration: 2000,
        });
        return;
      }

      const finalPatient = formPatientId
        ? patients.find((p) => p.id === parseInt(formPatientId))
        : null;

      if (!finalPatient && !formPatientName.trim()) {
        toast({
          title: "Informe o paciente",
          description: "Selecione um paciente ou digite o nome.",
          duration: 2000,
        });
        return;
      }

      const appt = createAppointment({
        clinicId: clinic?.id || 0,
        clinicName: clinic?.name || "",
        doctorId: resolvedDoctorId,
        doctorName: resolvedDoctor?.name || "",
        patientId: finalPatient ? finalPatient.id : 0,
        patientName: finalPatient ? finalPatient.name : formPatientName,
        date: selectedDate,
        time: formTime,
        procedure: formProcedure || "Consulta",
        procedures: formProcedures,
        status: "confirmado",
        paymentType: formPaymentType,
        healthPlan: formPaymentType === "plano" ? formHealthPlan : "",
        notes: formNotes,
      });

      // Atualizar agenda local
      const updatedAgenda = getDoctorAgenda(doctor.id, selectedDate);
      setAgenda(updatedAgenda);

      setShowNewAppointment(false);
      toast({
        title: "Agendamento criado!",
        description: `${appt.patientName} - ${formTime}`,
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Erro ao agendar",
        description: "Tente novamente.",
        duration: 2000,
      });
    }
  };

  // Função para editar agendamento (abre o modal pré-preenchido)
  const editAppointment = (appointment) => {
    setModalMode("edit");
    setEditingAppointmentId(appointment.id);
    setFormDoctorId(String(doctor.id));
    setFormTime(appointment.time);
    setModalInitialTime(appointment.time);
    setFormPatientId(
      appointment.patientId ? String(appointment.patientId) : ""
    );
    setFormPatientName(appointment.patient?.name || "");
    setFormPatientQuery(
      appointment.patient?.name
        ? `${appointment.patient.name} - ${appointment.patient.phone || ""}`
        : ""
    );
    setFormPatientPhone(appointment.patient?.phone || "");
    setFormProcedures(
      Array.isArray(appointment.procedures)
        ? appointment.procedures
        : appointment.procedure
        ? [appointment.procedure]
        : []
    );
    setFormProcedure("");
    setFormPaymentType(appointment.paymentType || "particular");
    setFormHealthPlan(appointment.healthPlan || "");
    setFormNotes(appointment.notes || "");
    setShowNewAppointment(true);
  };

  // Função para marcar como atendido
  const markAsAttended = (appointment) => {
    handleUpdateAppointmentStatus(appointment.id, "atendido");
  };

  // Abrir diálogo de confirmação para remover paciente
  const askRemoveFromAgenda = (appointment) => {
    setAppointmentPendingRemoval(appointment);
    setConfirmRemoveOpen(true);
  };

  // Remover paciente (liberar horário)
  const removeFromAgenda = () => {
    if (!appointmentPendingRemoval) return;
    try {
      deleteAppointment(appointmentPendingRemoval.id);
      const updated = getDoctorAgenda(doctor.id, selectedDate);
      setAgenda(updated);
      toast({
        title: "Paciente removido",
        description: "O horário foi liberado.",
        duration: 2000,
      });
    } catch (e) {
      toast({
        title: "Erro ao remover",
        description: "Tente novamente.",
        duration: 2000,
      });
    } finally {
      setConfirmRemoveOpen(false);
      setAppointmentPendingRemoval(null);
    }
  };

  // Função para formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  // Função para obter cor do status
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(
      (option) => option.value === status
    );
    return statusOption ? statusOption.color : "bg-gray-100 text-gray-800";
  };

  // Função para obter label do status
  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find(
      (option) => option.value === status
    );
    return statusOption ? statusOption.label : status;
  };

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Médico não encontrado
        </h3>
        <Button onClick={() => navigate(-1)}>Voltar</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Agenda - {doctor.name} - VittaHub Clínicas</title>
        <meta
          name="description"
          content={`Agenda do dia para ${doctor.name} - ${doctor.specialty}`}
        />
      </Helmet>

      <div className="space-y-6">
        {/* Header Global */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pb-6 -mx-6 px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {doctor.name}
              </h1>
              <p className="text-gray-600">{doctor.specialty}</p>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>

              <div className="flex items-center space-x-2">
                <DatePicker value={selectedDate} onChange={setSelectedDate} />
              </div>

              <Button
                onClick={handleNewSlotClick}
                className="flex items-center space-x-2"
              >
                <ClockPlus className="h-4 w-4" />
                <span>Novo Horário</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Header da Agenda */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Agenda do Dia</h2>

          <div className="flex items-center space-x-3">
            <Button
              key="todos"
              variant={activeFilter === "todos" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("todos")}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                activeFilter === "todos"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              Todos
            </Button>
            {statusOptions.map((status) => (
              <Button
                key={status.value}
                variant={activeFilter === status.value ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(status.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                  activeFilter === status.value
                    ? status.color
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {status.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista da Agenda */}
        <div className="space-y-3">
          {filteredAgenda.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum horário disponível
              </h3>
              <p className="text-gray-500">
                {activeFilter !== "todos"
                  ? "Nenhum agendamento encontrado com este status."
                  : "Não há horários configurados para este dia ou o médico não trabalha neste dia."}
              </p>
            </div>
          ) : (
            filteredAgenda.map((item) => (
              <Card key={item.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="grid grid-cols-5 gap-6 items-center">
                    {/* Horário */}
                    <div className="text-center">
                      <div className="font-bold text-lg text-gray-900">
                        {item.time}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.duration}min
                      </div>
                    </div>

                    {/* Paciente */}
                    <div className="flex items-center space-x-3">
                      {item.type === "appointment" ? (
                        <>
                          <img
                            src={item.patient.image}
                            alt={item.patient.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <button
                            type="button"
                            className="text-left"
                            onClick={() => {
                              // abrir modal de agendamento pré-preenchido para re-agendar/editar rápido
                              setModalMode("edit");
                              setEditingAppointmentId(item.id);
                              setFormDoctorId(String(doctor.id));
                              setFormTime(item.time);
                              setFormPatientId(
                                item.patientId ? String(item.patientId) : ""
                              );
                              setFormPatientName(item.patient?.name || "");
                              setFormPatientQuery(
                                item.patient?.name
                                  ? `${item.patient.name} - ${
                                      item.patient.phone || ""
                                    }`
                                  : ""
                              );
                              setFormPatientPhone(item.patient?.phone || "");
                              setFormProcedures(
                                Array.isArray(item.procedures)
                                  ? item.procedures
                                  : item.procedure
                                  ? [item.procedure]
                                  : []
                              );
                              setFormProcedure("");
                              setFormPaymentType(
                                item.paymentType || "particular"
                              );
                              setFormHealthPlan(item.healthPlan || "");
                              setFormNotes(item.notes || "");
                              // prioridade se existir no item futuramente
                              setShowNewAppointment(true);
                            }}
                          >
                            <div>
                              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                {item.patient.name}
                                {item.notes && item.notes.trim() !== "" && (
                                  <span
                                    title="Observações presentes"
                                    className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold"
                                  >
                                    !
                                  </span>
                                )}
                              </h3>
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <Phone className="h-3 w-3" />
                                <span>{item.patient.phone}</span>
                              </div>
                            </div>
                          </button>
                        </>
                      ) : item.type === "available" ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Clock className="h-5 w-5 text-gray-400" />
                          </div>
                          <span className="font-semibold text-gray-900">
                            Horário disponível
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Lock className="h-5 w-5 text-red-500" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">
                              Horário Bloqueado
                            </span>
                            <p className="text-sm text-gray-600">
                              {item.reason}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Procedimento */}
                    <div className="text-center">
                      {item.type === "appointment" ? (
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {String(item.procedure)
                            .split(",")
                            .map((p) => p.trim())
                            .filter(Boolean)
                            .map((p) => (
                              <span
                                key={`${item.id}-${p}`}
                                className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 border border-gray-200"
                              >
                                {p}
                              </span>
                            ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </div>

                    {/* Status */}
                    <div className="text-center">
                      {item.type === "appointment" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="min-w-[120px] rounded-full"
                            >
                              <Badge className={getStatusColor(item.status)}>
                                {getStatusLabel(item.status)}
                              </Badge>
                              <MoreHorizontal className="h-4 w-4 ml-2" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {statusOptions.map((status) => (
                              <DropdownMenuItem
                                key={status.value}
                                onClick={() =>
                                  handleUpdateAppointmentStatus(
                                    item.id,
                                    status.value
                                  )
                                }
                              >
                                <Badge className={status.color}>
                                  {status.label}
                                </Badge>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex items-center justify-center space-x-2">
                      {item.type === "appointment" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editAppointment(item)}
                            className="p-2"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => askRemoveFromAgenda(item)}
                            className="p-2 text-red-600 hover:text-red-700"
                            title="Remover da Agenda"
                          >
                            <Eraser className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsAttended(item)}
                            className="p-2 text-blue-600 hover:text-blue-700"
                            title="Marcar como Atendido"
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {item.type === "available" && (
                        <>
                          <Button
                            onClick={() => scheduleNewPatient(item)}
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Agendar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBlockTimeSlot(item)}
                            className="p-2"
                            title="Bloquear Horário"
                          >
                            <Lock className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {item.type === "blocked" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-2 text-red-600"
                          title="Horário Bloqueado"
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                      )}

                      {item.type === "appointment" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-2 text-gray-600 hover:text-gray-700"
                          title="Ficha do Paciente"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Botões de Ação Adicionais */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={blockEntireDay}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Lock className="h-4 w-4 mr-2" />
            Bloquear Agenda do Dia
          </Button>

          <div className="text-sm text-gray-500">
            Total de agendamentos:{" "}
            {agenda.filter((item) => item.type === "appointment").length}
          </div>
        </div>
      </div>
      {/* Modal de Novo Agendamento (apenas quando vindo do botão Agendar nos slots) */}
      <SchedulingModal
        open={showNewAppointment}
        onOpenChange={setShowNewAppointment}
        initialDoctorId={doctor?.id}
        initialDate={selectedDate}
        dateDisabled={true}
        initialTime={modalInitialTime || formTime}
        timeManual={modalMode === "create" && formTime === ""}
        initialPatientId={formPatientId}
        initialPatientName={formPatientName}
        initialPatientPhone={formPatientPhone}
        initialPaymentType={formPaymentType}
        initialHealthPlan={formHealthPlan}
        initialNotes={formNotes}
        initialProcedures={formProcedures}
        mode={modalMode}
        appointmentId={editingAppointmentId}
        onCreated={() => {
          const updated = getDoctorAgenda(doctor.id, selectedDate);
          setAgenda(updated);
        }}
        onNavigateToNewPatient={() => navigate("/pacientes/novo")}
      />
      {/* Dialogo de confirmação de remoção */}
      <Dialog open={confirmRemoveOpen} onOpenChange={setConfirmRemoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover paciente</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-center">
            <p className="text-gray-700">
              Tem certeza que deseja remover{" "}
              <span className="font-semibold">
                {appointmentPendingRemoval?.patient?.name || "o paciente"}
              </span>{" "}
              deste horário?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              O horário ficará disponível para novos agendamentos.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmRemoveOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={removeFromAgenda}
            >
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AgendaMedico;
