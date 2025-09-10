import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { Plus, UserPlus, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "./ui/use-toast";

import { doctors, getDoctorById } from "../data/doctors";
import { patients } from "../data/patients";
import {
  createAppointment,
  getDoctorAgenda,
  updateAppointment,
  listAppointments,
} from "../data/agenda";
import { getClinics, getCurrentClinicId } from "../data/clinics";

const SchedulingModal = ({
  open,
  onOpenChange,
  initialDoctorId,
  initialDate,
  dateDisabled = false,
  initialTime = "",
  timeManual = false,
  initialPatientId = "",
  initialPatientName = "",
  initialPatientPhone = "",
  initialPaymentType = "particular",
  initialHealthPlan = "",
  initialNotes = "",
  initialProcedures = [],
  mode = "create", // "create" | "edit"
  appointmentId = null,
  onCreated,
  onNavigateToNewPatient,
}) => {
  const { toast } = useToast();

  const [formDoctorId, setFormDoctorId] = useState(
    initialDoctorId ? String(initialDoctorId) : ""
  );
  const [formDate, setFormDate] = useState(
    initialDate || new Date().toISOString().split("T")[0]
  );
  const [formTime, setFormTime] = useState(initialTime || "");

  const [formPatientId, setFormPatientId] = useState(
    initialPatientId ? String(initialPatientId) : ""
  );
  const [formPatientQuery, setFormPatientQuery] = useState(
    initialPatientName || ""
  );
  const [formPatientName, setFormPatientName] = useState(
    initialPatientName || ""
  );
  const [formPatientPhone, setFormPatientPhone] = useState(
    initialPatientPhone || ""
  );
  const [showPatientSuggestions, setShowPatientSuggestions] = useState(false);

  const [formPaymentType, setFormPaymentType] = useState(initialPaymentType);
  const [formHealthPlan, setFormHealthPlan] = useState(initialHealthPlan);
  const [formProcedure, setFormProcedure] = useState("");
  const [formProcedures, setFormProcedures] = useState(
    Array.isArray(initialProcedures) ? initialProcedures : []
  );
  const [formNotes, setFormNotes] = useState(initialNotes);
  const [showProcedureSuggestions, setShowProcedureSuggestions] =
    useState(false);
  const procedureInputRef = useRef(null);
  const patientContainerRef = useRef(null);
  const procedureContainerRef = useRef(null);
  // prioridade removida a pedido: manter estrutura simples de procedimentos

  useEffect(() => {
    if (open) {
      setFormDoctorId(initialDoctorId ? String(initialDoctorId) : "");
      setFormDate(initialDate || new Date().toISOString().split("T")[0]);
      setFormTime((prev) => (initialTime ? initialTime : prev));
      setFormPatientId(initialPatientId ? String(initialPatientId) : "");
      setFormPatientQuery(initialPatientName || "");
      setFormPatientName(initialPatientName || "");
      setFormPatientPhone(initialPatientPhone || "");
      setFormPaymentType(initialPaymentType || "particular");
      setFormHealthPlan(initialHealthPlan || "");
      setFormProcedure("");
      setFormProcedures(
        Array.isArray(initialProcedures) ? initialProcedures : []
      );
      setFormNotes(initialNotes || "");
      // prioridade removida
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    open,
    initialDoctorId,
    initialDate,
    initialTime,
    initialPatientId,
    initialPatientName,
    initialPatientPhone,
    initialPaymentType,
    initialHealthPlan,
    initialNotes,
    initialProcedures,
    mode,
    appointmentId,
  ]);

  useEffect(() => {
    if (formPatientId) {
      const p = patients.find((pt) => pt.id === parseInt(formPatientId));
      if (p) {
        setFormPatientQuery(p.name);
        setFormPatientName(p.name);
        setFormPatientPhone(p.phone || "");
      }
    }
  }, [formPatientId]);

  // Fechar dropdowns de sugestões ao clicar fora ou pressionar ESC
  useEffect(() => {
    if (!open) return;
    const handleGlobalPointer = (e) => {
      if (
        patientContainerRef.current &&
        !patientContainerRef.current.contains(e.target)
      ) {
        setShowPatientSuggestions(false);
      }
      if (
        procedureContainerRef.current &&
        !procedureContainerRef.current.contains(e.target)
      ) {
        setShowProcedureSuggestions(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setShowPatientSuggestions(false);
        setShowProcedureSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleGlobalPointer);
    document.addEventListener("touchstart", handleGlobalPointer, {
      passive: true,
    });
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleGlobalPointer);
      document.removeEventListener("touchstart", handleGlobalPointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  // Helpers memorizados
  const selectPatient = useCallback((p) => {
    setFormPatientId(String(p.id));
    setFormPatientName(p.name);
    setFormPatientQuery(p.name);
    setFormPatientPhone(p.phone || "");
    setShowPatientSuggestions(false);
  }, []);

  const removeProcedure = useCallback((name) => {
    setFormProcedures((prev) => prev.filter((x) => x !== name));
  }, []);

  const availableTimes = useMemo(() => {
    const targetDoctorId = formDoctorId ? parseInt(formDoctorId) : null;
    if (!targetDoctorId || !formDate) return [];
    const ag = getDoctorAgenda(targetDoctorId, formDate);
    const times = ag.filter((i) => i.type === "available").map((i) => i.time);
    // No modo edição, garantir que o horário atual esteja listado
    if (mode === "edit" && formTime && !times.includes(formTime)) {
      return [formTime, ...times];
    }
    return times;
  }, [formDoctorId, formDate, formTime, mode]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    try {
      const clinic = getClinics().find((c) => c.id === getCurrentClinicId());
      const resolvedDoctorId = formDoctorId
        ? parseInt(formDoctorId)
        : doctors[0]?.id;
      if (!resolvedDoctorId) {
        toast({ title: "Selecione o médico", duration: 2000 });
        return;
      }
      if (!formDate || !formTime) {
        toast({ title: "Selecione data e horário", duration: 2000 });
        return;
      }
      // Se horário é manual, garantir que não existe agendamento no mesmo horário
      const existing = listAppointments({
        doctorId: resolvedDoctorId,
        date: formDate,
      }).some((a) => a.time === formTime);
      if (existing) {
        toast({
          title: "Horário ocupado",
          description: "Já existe um paciente nesse horário.",
          duration: 2500,
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
      const resolvedDoctor = getDoctorById(resolvedDoctorId);
      if (mode === "edit" && appointmentId) {
        const updated = updateAppointment(appointmentId, {
          clinicId: clinic?.id || 0,
          clinicName: clinic?.name || "",
          doctorId: resolvedDoctorId,
          doctorName: resolvedDoctor?.name || "",
          patientId: finalPatient ? finalPatient.id : 0,
          patientName: finalPatient ? finalPatient.name : formPatientName,
          patientPhone: finalPatient ? finalPatient.phone : formPatientPhone,
          date: formDate,
          time: formTime,
          procedure: formProcedure || undefined, // manter se vazio
          procedures: formProcedures,
          paymentType: formPaymentType,
          healthPlan: formPaymentType === "plano" ? formHealthPlan : "",
          notes: formNotes,
        });
        onOpenChange(false);
        onCreated?.(updated);
        toast({
          title: "Agendamento atualizado!",
          description: `${updated.patientName} - ${formTime}`,
          duration: 2000,
        });
      } else {
        const appt = createAppointment({
          clinicId: clinic?.id || 0,
          clinicName: clinic?.name || "",
          doctorId: resolvedDoctorId,
          doctorName: resolvedDoctor?.name || "",
          patientId: finalPatient ? finalPatient.id : 0,
          patientName: finalPatient ? finalPatient.name : formPatientName,
          patientPhone: finalPatient ? finalPatient.phone : formPatientPhone,
          date: formDate,
          time: formTime,
          procedure: formProcedure || "Consulta",
          procedures: formProcedures,
          status: "confirmado",
          paymentType: formPaymentType,
          healthPlan: formPaymentType === "plano" ? formHealthPlan : "",
          notes: formNotes,
        });
        onOpenChange(false);
        onCreated?.(appt);
        toast({
          title: "Agendamento criado!",
          description: `${appt.patientName} - ${formTime}`,
          duration: 2000,
        });
      }
    } catch (err) {
      toast({
        title: "Erro",
        description: err?.message || "Tente novamente.",
        duration: 2000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar Agendamento" : "Novo Agendamento"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            {/* Linha 1: Médico, Data, Horário */}
            <div className="sm:col-span-6">
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
            <div className="sm:col-span-3">
              <Label>Data</Label>
              <Input
                className="mt-1"
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                disabled={dateDisabled}
              />
            </div>
            <div className="sm:col-span-3">
              <Label>Horário</Label>
              {timeManual ? (
                <Input
                  className="mt-1 focus:ring-2 focus:ring-[#2EA9B0]"
                  type="time"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                />
              ) : (
                <Select value={formTime} onValueChange={setFormTime}>
                  <SelectTrigger className="mt-1 focus:ring-2 focus:ring-[#2EA9B0]">
                    <SelectValue placeholder="Selecione o horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.length === 0 ? (
                      <SelectItem value="no-slots" disabled>
                        Sem horários disponíveis
                      </SelectItem>
                    ) : (
                      availableTimes.map((t) => {
                        const isCurrent = t === formTime;
                        return (
                          <SelectItem key={t} value={t}>
                            {t}
                            {mode === "edit" && isCurrent ? " (atual)" : ""}
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Linha 2: Paciente (nome), +, Telefone */}
            <div className="sm:col-span-12">
              <Label>Paciente</Label>
              <div className="mt-1 grid grid-cols-1 sm:grid-cols-12 gap-x-2 gap-y-2 items-start">
                <div
                  className="relative sm:col-span-7"
                  ref={patientContainerRef}
                >
                  <Input
                    placeholder="Buscar por nome ou CPF"
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
                    formPatientQuery.trim().length >= 1 && (
                      <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-md max-h-56 overflow-auto">
                        {patients
                          .filter((p) => {
                            const q = formPatientQuery.toLowerCase();
                            const name = (p.name || "").toLowerCase();
                            const cpfDigits = String(p.cpf || "").replace(
                              /\D/g,
                              ""
                            );
                            const queryDigits = formPatientQuery.replace(
                              /\D/g,
                              ""
                            );
                            return (
                              name.includes(q) ||
                              (queryDigits.length > 0 &&
                                cpfDigits.includes(queryDigits))
                            );
                          })
                          .slice(0, 8)
                          .map((p) => (
                            <button
                              type="button"
                              key={p.id}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => selectPatient(p)}
                            >
                              <div className="font-medium text-gray-900">
                                {p.name}
                              </div>
                              <div className="text-xs text-gray-500 font-mono">
                                {p.cpf || "CPF não informado"}
                              </div>
                            </button>
                          ))}
                        {patients.filter((p) => {
                          const q = formPatientQuery.toLowerCase();
                          const name = (p.name || "").toLowerCase();
                          const cpfDigits = String(p.cpf || "").replace(
                            /\D/g,
                            ""
                          );
                          const queryDigits = formPatientQuery.replace(
                            /\D/g,
                            ""
                          );
                          return (
                            name.includes(q) ||
                            (queryDigits.length > 0 &&
                              cpfDigits.includes(queryDigits))
                          );
                        }).length === 0 && (
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
                      onOpenChange(false);
                      onNavigateToNewPatient?.();
                    }}
                    title="Cadastrar novo paciente"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="sm:col-span-4 ml-2">
                  <Input
                    type="tel"
                    placeholder="Telefone"
                    value={formPatientPhone}
                    onChange={(e) => setFormPatientPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Linha 3: Procedimento e Prioridade */}
            <div className="sm:col-span-12">
              <Label>Procedimentos</Label>
              <div className="mt-1 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                <div
                  className="relative sm:col-span-9"
                  ref={procedureContainerRef}
                >
                  <Input
                    placeholder="Digite um procedimento"
                    value={formProcedure}
                    ref={procedureInputRef}
                    onFocus={() => setShowProcedureSuggestions(true)}
                    onChange={(e) => {
                      setFormProcedure(e.target.value);
                      setShowProcedureSuggestions(true);
                    }}
                  />
                  {showProcedureSuggestions && (
                    <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-md max-h-56 overflow-auto">
                      {(() => {
                        const all = (
                          getDoctorById(formDoctorId || doctors[0]?.id || "")
                            ?.procedures || []
                        )
                          .slice()
                          .filter(Boolean)
                          .sort((a, b) =>
                            String(a).localeCompare(String(b), "pt-BR", {
                              sensitivity: "base",
                            })
                          );
                        const filtered = all.filter((p) =>
                          String(p)
                            .toLowerCase()
                            .includes(formProcedure.toLowerCase())
                        );
                        return filtered.map((p) => (
                          <button
                            type="button"
                            key={p}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              if (!formProcedures.includes(p)) {
                                setFormProcedures((prev) => [...prev, p]);
                              }
                              setFormProcedure("");
                              setShowProcedureSuggestions(false);
                              // Desfocar o input para tirar a seleção
                              try {
                                procedureInputRef.current?.blur?.();
                              } catch {}
                            }}
                          >
                            {p}
                          </button>
                        ));
                      })()}
                    </div>
                  )}
                </div>
                <div className="sm:col-span-3" />
              </div>
              {formProcedures.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formProcedures.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm"
                    >
                      {p}
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => removeProcedure(p)}
                        aria-label={`Remover ${p}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Linha 4: Forma de pagamento */}
            <div className="sm:col-span-12">
              <Label>Forma de pagamento</Label>
              <div className="mt-1 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                <div className="sm:col-span-4">
                  <Select
                    value={formPaymentType}
                    onValueChange={setFormPaymentType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="particular">Particular</SelectItem>
                      <SelectItem value="plano">Plano de Saúde</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formPaymentType === "plano" && (
                  <div className="sm:col-span-8">
                    <Input
                      placeholder="Nome do plano"
                      value={formHealthPlan}
                      onChange={(e) => setFormHealthPlan(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Linha 5: Observações */}
            <div className="sm:col-span-12">
              <Label>Observações</Label>
              <Textarea
                className="mt-1"
                placeholder="Informações adicionais"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulingModal;
