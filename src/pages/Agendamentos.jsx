import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { UserCheck, Plus, Search, Calendar } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../components/ui/use-toast";
import { patients } from "../data/patients";
import { getDoctorById } from "../data/doctors";
import { createAppointment, getDoctorAgenda } from "../data/agenda";
import { doctors } from "../data/doctors";
import { listAppointments } from "../data/agenda";
import { getClinics, getCurrentClinicId } from "../data/clinics";
import { Checkbox } from "../components/ui/checkbox";
import SchedulingModal from "../components/SchedulingModal";

const Agendamentos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showNewAppointment, setShowNewAppointment] = useState(false);
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
  const [formDate, setFormDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [formTime, setFormTime] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const clinics = getClinics();
  const currentClinicId = getCurrentClinicId();

  // Filtrar médicos baseado no termo de busca
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.crm.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewSchedule = (doctor) => {
    navigate(`/medicos/${doctor.id}/agenda`, { state: { doctor } });
  };

  return (
    <>
      <Helmet>
        <title>Agendamentos - VittaHub Clínicas</title>
        <meta
          name="description"
          content="Visualize e gerencie os agendamentos dos médicos"
        />
      </Helmet>

      <div className="space-y-6">
        {/* Header Global */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pb-6 -mx-6 px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Agendamentos
              </h1>
              <p className="text-gray-600">
                Visualize e gerencie os agendamentos dos médicos
              </p>
            </div>
          </div>
        </div>

        {/* Barra de Busca */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar médicos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lista de Médicos */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum médico encontrado
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Tente ajustar os termos de busca."
                : "Não há médicos cadastrados para visualizar agendamentos."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {doctor.specialty}
                      </p>
                      <div className="space-y-1 text-sm text-gray-500">
                        <p>CRM: {doctor.crm}</p>
                        <p>{doctor.phone}</p>
                        <p className="truncate">{doctor.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Horário:</span>{" "}
                      {doctor.workingHours?.startTime || "08:00"} -{" "}
                      {doctor.workingHours?.endTime || "18:00"}
                      <br />
                      <span className="font-medium">Intervalo:</span>{" "}
                      {doctor.workingHours?.interval || 30}min
                    </div>

                    <Button
                      onClick={() => handleViewSchedule(doctor)}
                      className="bg-[#2EA9B0] hover:bg-[#2EA9B0]/90 text-white"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Ver Agenda
                    </Button>
                  </div>

                  {/* Resumo de agendamentos do dia para esta clínica (opcional) */}
                  <div className="mt-4 text-xs text-gray-500">
                    {(() => {
                      const today = new Date().toISOString().split("T")[0];
                      const appts = listAppointments({
                        clinicId: currentClinicId,
                        doctorId: doctor.id,
                        date: today,
                      });
                      return (
                        <span>
                          Hoje: {appts.length} agendamento
                          {appts.length !== 1 ? "s" : ""}
                        </span>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Modal de Novo Agendamento (Página Agendamentos) */}
      <Dialog open={showNewAppointment} onOpenChange={setShowNewAppointment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              try {
                const clinic = clinics.find((c) => c.id === currentClinicId);
                const resolvedDoctorId = formDoctorId
                  ? parseInt(formDoctorId)
                  : filteredDoctors[0]?.id || null;
                if (!resolvedDoctorId) {
                  toast({ title: "Selecione o médico", duration: 2000 });
                  return;
                }
                if (!formDate || !formTime) {
                  toast({ title: "Selecione data e horário", duration: 2000 });
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
                const doctor = getDoctorById(resolvedDoctorId);
                const appt = createAppointment({
                  clinicId: clinic?.id || 0,
                  clinicName: clinic?.name || "",
                  doctorId: resolvedDoctorId,
                  doctorName: doctor?.name || "",
                  patientId: finalPatient ? finalPatient.id : 0,
                  patientName: finalPatient
                    ? finalPatient.name
                    : formPatientName,
                  patientPhone: finalPatient ? finalPatient.phone : "",
                  date: formDate,
                  time: formTime,
                  procedure: formProcedure || "Consulta",
                  procedures: formProcedures,
                  status: "confirmado",
                  paymentType: formPaymentType,
                  healthPlan: formPaymentType === "plano" ? formHealthPlan : "",
                  notes: formNotes,
                });
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
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-1">
                <Label>Médico</Label>
                <Select value={formDoctorId} onValueChange={setFormDoctorId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o médico" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {d.name} — {d.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-1">
                <Label>Data</Label>
                <Input
                  className="mt-1"
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                />
              </div>
              <div className="sm:col-span-1">
                <Label>Horário</Label>
                <div className="mt-1 border rounded-md h-40 overflow-y-auto">
                  {(() => {
                    const id = formDoctorId
                      ? parseInt(formDoctorId)
                      : filteredDoctors[0]?.id || null;
                    if (!id || !formDate)
                      return (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          Selecione médico e data
                        </div>
                      );
                    const times = getDoctorAgenda(id, formDate)
                      .filter((i) => i.type === "available")
                      .map((i) => i.time);
                    if (times.length === 0)
                      return (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          Sem horários disponíveis
                        </div>
                      );
                    return times.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setFormTime(t)}
                        className={`w-full text-left px-3 py-2 border-b last:border-b-0 ${
                          formTime === t
                            ? "bg-[#2EA9B0] text-white"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {t}
                      </button>
                    ));
                  })()}
                </div>
              </div>
              <div className="sm:col-span-1">
                <Label>Tipo de pagamento</Label>
                <Select
                  value={formPaymentType}
                  onValueChange={setFormPaymentType}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="particular">Particular</SelectItem>
                    <SelectItem value="plano">Plano de Saúde</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label>Paciente</Label>
                <div className="mt-1 grid grid-cols-1 sm:grid-cols-12 gap-2 items-start">
                  <div className="relative sm:col-span-7">
                    <Input
                      placeholder="Busque por nome ou CPF"
                      value={formPatientQuery}
                      onFocus={() => setShowPatientSuggestions(true)}
                      onChange={(e) => {
                        const q = e.target.value;
                        setFormPatientQuery(q);
                        setFormPatientId("");
                        setFormPatientName(q);
                        setShowPatientSuggestions(true);
                      }}
                    />
                    {showPatientSuggestions &&
                      formPatientQuery.trim().length >= 2 && (
                        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-md max-h-56 overflow-auto">
                          {patients
                            .filter((p) => {
                              const q = formPatientQuery
                                .toLowerCase()
                                .replace(/[^\da-zá-úüñ ]/gi, "");
                              const name = (p.name || "").toLowerCase();
                              const cpf = (p.cpf || "").replace(/\D/g, "");
                              return (
                                name.includes(q) ||
                                cpf.includes(
                                  formPatientQuery.replace(/\D/g, "")
                                )
                              );
                            })
                            .slice(0, 8)
                            .map((p) => (
                              <button
                                type="button"
                                key={p.id}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  setFormPatientId(String(p.id));
                                  setFormPatientName(p.name);
                                  setFormPatientQuery(
                                    `${p.name} - ${p.cpf || ""}`
                                  );
                                  setShowPatientSuggestions(false);
                                }}
                              >
                                <div className="font-medium text-gray-900">
                                  {p.name}
                                </div>
                                <div className="text-sm text-gray-600 font-mono">
                                  {p.cpf}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {p.phone}
                                </div>
                              </button>
                            ))}
                          {patients.filter(
                            (p) =>
                              p.name
                                .toLowerCase()
                                .includes(formPatientQuery.toLowerCase()) ||
                              (p.cpf || "")
                                .replace(/\D/g, "")
                                .includes(formPatientQuery.replace(/\D/g, ""))
                          ).length === 0 && (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              Nenhum paciente encontrado
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                  <div className="sm:col-span-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setShowNewAppointment(false);
                        navigate("/pacientes/novo");
                      }}
                      title="Cadastrar novo paciente"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="sm:col-span-4">
                    <Input
                      type="tel"
                      placeholder="Telefone"
                      value={
                        patients.find((p) => p.id === parseInt(formPatientId))
                          ?.phone || ""
                      }
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label>Procedimentos</Label>
                <div className="mt-1 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                  <div className="sm:col-span-9">
                    <Select
                      value={formProcedure}
                      onValueChange={setFormProcedure}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um procedimento" />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          getDoctorById(
                            formDoctorId || filteredDoctors[0]?.id || ""
                          )?.procedures || []
                        ).map((proc) => (
                          <SelectItem key={proc} value={proc}>
                            {proc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (
                          formProcedure &&
                          !formProcedures.includes(formProcedure)
                        ) {
                          setFormProcedures((prev) => [...prev, formProcedure]);
                          setFormProcedure("");
                        }
                      }}
                    >
                      + Adicionar
                    </Button>
                  </div>
                </div>
                {formProcedures.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formProcedures.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                      >
                        {p}
                        <button
                          type="button"
                          className="ml-2 text-gray-500"
                          onClick={() =>
                            setFormProcedures((prev) =>
                              prev.filter((x) => x !== p)
                            )
                          }
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="sm:col-span-2">
                <Label>Observações</Label>
                <Textarea
                  className="mt-1"
                  placeholder="Informações adicionais"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Paciente</Label>
                <div className="mt-1 flex items-start space-x-2">
                  <div className="relative w-full">
                    <Input
                      placeholder="Busque por nome ou CPF"
                      value={formPatientQuery}
                      onFocus={() => setShowPatientSuggestions(true)}
                      onChange={(e) => {
                        const q = e.target.value;
                        setFormPatientQuery(q);
                        setFormPatientId("");
                        setFormPatientName(q);
                        setShowPatientSuggestions(true);
                      }}
                    />
                    {showPatientSuggestions &&
                      formPatientQuery.trim().length >= 2 && (
                        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-md max-h-56 overflow-auto">
                          {patients
                            .filter((p) => {
                              const q = formPatientQuery
                                .toLowerCase()
                                .replace(/[^\da-zá-úüñ ]/gi, "");
                              const name = (p.name || "").toLowerCase();
                              const cpf = (p.cpf || "").replace(/\D/g, "");
                              return (
                                name.includes(q) ||
                                cpf.includes(
                                  formPatientQuery.replace(/\D/g, "")
                                )
                              );
                            })
                            .slice(0, 8)
                            .map((p) => (
                              <button
                                type="button"
                                key={p.id}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  setFormPatientId(String(p.id));
                                  setFormPatientName(p.name);
                                  setFormPatientQuery(
                                    `${p.name} - ${p.cpf || ""}`
                                  );
                                  setShowPatientSuggestions(false);
                                }}
                              >
                                <div className="font-medium text-gray-900">
                                  {p.name}
                                </div>
                                <div className="text-sm text-gray-600 font-mono">
                                  {p.cpf}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {p.phone}
                                </div>
                              </button>
                            ))}
                          {patients.filter(
                            (p) =>
                              p.name
                                .toLowerCase()
                                .includes(formPatientQuery.toLowerCase()) ||
                              (p.cpf || "")
                                .replace(/\D/g, "")
                                .includes(formPatientQuery.replace(/\D/g, ""))
                          ).length === 0 && (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              Nenhum paciente encontrado
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => {
                      setShowNewAppointment(false);
                      navigate("/pacientes/novo");
                    }}
                    title="Cadastrar novo paciente"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formPatientId && (
                  <div className="mt-2 text-sm text-gray-600">
                    Telefone:{" "}
                    {patients.find((p) => p.id === parseInt(formPatientId))
                      ?.phone || ""}
                  </div>
                )}
              </div>
              <div className="sm:col-span-2">
                <Label>Observações</Label>
                <Textarea
                  className="mt-1"
                  placeholder="Informações adicionais"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                />
              </div>
              <div>
                <Label>Forma de pagamento</Label>
                <Select
                  value={formPaymentType}
                  onValueChange={setFormPaymentType}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="particular">Particular</SelectItem>
                    <SelectItem value="plano">Plano de Saúde</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formPaymentType === "plano" && (
                <div>
                  <Label>Plano de Saúde</Label>
                  <Input
                    className="mt-1"
                    placeholder="Nome do plano"
                    value={formHealthPlan}
                    onChange={(e) => setFormHealthPlan(e.target.value)}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewAppointment(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Agendamentos;
