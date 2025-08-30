import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Clock,
  User,
  Phone,
  Edit,
  Check,
  X,
  Lock,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useToast } from "../components/ui/use-toast";
import { getDoctorById } from "../data/doctors";
import {
  getDoctorAgenda,
  updateAppointmentStatus,
  removeAppointment,
  blockTimeSlot,
} from "../data/agenda";

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
      value: "nao-confirmado",
      label: "Não Confirmado",
      color: "bg-red-100 text-red-800",
    },
    {
      value: "atendido",
      label: "Atendido",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "cancelado",
      label: "Cancelado",
      color: "bg-gray-100 text-gray-800",
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

  // Filtrar agenda baseado no filtro ativo
  const filteredAgenda = agenda.filter((item) => {
    if (activeFilter === "todos") return true;
    if (activeFilter === "em-espera") return item.status === "em-espera";
    if (activeFilter === "confirmado") return item.status === "confirmado";
    if (activeFilter === "nao-confirmado")
      return item.status === "nao-confirmado";
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
    toast({
      title: "🚧 Funcionalidade em desenvolvimento",
      description:
        "A funcionalidade de agendamento será implementada em breve.",
      duration: 3000,
    });
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
      const updatedAgenda = agenda.map((item) => ({
        ...item,
        type: "blocked",
        reason: reason,
      }));
      setAgenda(updatedAgenda);
      toast({
        title: "Dia bloqueado!",
        description: "A agenda do dia foi bloqueada com sucesso.",
      });
    }
  };

  // Função para editar agendamento
  const editAppointment = (appointment) => {
    toast({
      title: "🚧 Funcionalidade em desenvolvimento",
      description: "A funcionalidade de edição será implementada em breve.",
      duration: 3000,
    });
  };

  // Função para marcar como atendido
  const markAsAttended = (appointment) => {
    handleUpdateAppointmentStatus(appointment.id, "atendido");
  };

  // Função para remover da agenda
  const removeFromAgenda = (appointment) => {
    const updatedAgenda = removeAppointment(agenda, appointment.id);
    setAgenda(updatedAgenda);
    toast({
      title: "Agendamento removido!",
      description: "O agendamento foi removido da agenda com sucesso.",
      duration: 2000,
    });
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
              <p className="text-gray-600">
                {doctor.specialty}
              </p>
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
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-40"
                />
              </div>

              <Button
                onClick={() => setShowNewAppointment(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
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
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {item.patient.name}
                            </h3>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Phone className="h-3 w-3" />
                              <span>{item.patient.phone}</span>
                            </div>
                          </div>
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
                        <span className="text-sm text-gray-600 font-medium">
                          {item.procedure}
                        </span>
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
                            onClick={() => markAsAttended(item)}
                            className="p-2 text-green-600 hover:text-green-700"
                            title="Marcar como Atendido"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromAgenda(item)}
                            className="p-2 text-red-600 hover:text-red-700"
                            title="Remover da Agenda"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {item.type === "available" && (
                        <>
                          <Button
                            onClick={() => scheduleNewPatient(item)}
                            className="bg-purple-500 hover:bg-purple-600 text-white"
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
                            <X className="h-4 w-4" />
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

                      {item.type === "appointment" &&
                        item.status === "atendido" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-2"
                            title="Prontuário"
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
    </>
  );
};

export default AgendaMedico;
