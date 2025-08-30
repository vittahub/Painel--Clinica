import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";
import {
  ArrowLeft,
  User,
  Stethoscope,
  ClipboardList,
  CalendarDays,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getDoctorById, updateDoctor } from "../data/doctors";

import Step1 from "../components/cadastro-medico/Step1";
import Step2 from "../components/cadastro-medico/Step2";
import Step3 from "../components/cadastro-medico/Step3";
import Step4 from "../components/cadastro-medico/Step4";

const EditarMedico = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    personal: {
      fullName: "",
      crm: "",
      cpf: "",
      phone: "",
      email: "",
    },
    specialties: [],
    procedures: [],
    schedule: {
      interval: 30,
      segunda: { active: false, start: "08:00", end: "18:00" },
      terca: { active: false, start: "08:00", end: "18:00" },
      quarta: { active: false, start: "08:00", end: "18:00" },
      quinta: { active: false, start: "08:00", end: "18:00" },
      sexta: { active: false, start: "08:00", end: "18:00" },
      sabado: { active: false, start: "08:00", end: "12:00" },
      domingo: { active: false, start: "08:00", end: "12:00" },
    },
  });

  // Carregar dados do médico
  useEffect(() => {
    const loadDoctorData = () => {
      const doctor = location.state?.doctor || getDoctorById(id);

      if (doctor) {
        // Converter dados do médico para o formato do formulário
        const convertedData = {
          personal: {
            fullName: doctor.name,
            crm: doctor.crm,
            cpf: doctor.cpf || "",
            phone: doctor.phone,
            email: doctor.email,
          },
          specialties: doctor.specialties || [doctor.specialty],
          procedures: doctor.procedures || [],
          schedule: {
            interval: doctor.workingHours?.interval || 30,
            segunda: {
              active:
                doctor.workingHours?.workingDays?.includes("monday") || false,
              start: doctor.workingHours?.startTime || "08:00",
              end: doctor.workingHours?.endTime || "18:00",
            },
            terca: {
              active:
                doctor.workingHours?.workingDays?.includes("tuesday") || false,
              start: doctor.workingHours?.startTime || "08:00",
              end: doctor.workingHours?.endTime || "18:00",
            },
            quarta: {
              active:
                doctor.workingHours?.workingDays?.includes("wednesday") ||
                false,
              start: doctor.workingHours?.startTime || "08:00",
              end: doctor.workingHours?.endTime || "18:00",
            },
            quinta: {
              active:
                doctor.workingHours?.workingDays?.includes("thursday") || false,
              start: doctor.workingHours?.startTime || "08:00",
              end: doctor.workingHours?.endTime || "18:00",
            },
            sexta: {
              active:
                doctor.workingHours?.workingDays?.includes("friday") || false,
              start: doctor.workingHours?.startTime || "08:00",
              end: doctor.workingHours?.endTime || "18:00",
            },
            sabado: {
              active:
                doctor.workingHours?.workingDays?.includes("saturday") || false,
              start: "08:00",
              end: "12:00",
            },
            domingo: {
              active:
                doctor.workingHours?.workingDays?.includes("sunday") || false,
              start: "08:00",
              end: "12:00",
            },
          },
        };

        setFormData(convertedData);
      } else {
        toast({
          title: "Erro",
          description: "Médico não encontrado.",
          variant: "destructive",
        });
        navigate("/medicos");
      }
      setLoading(false);
    };

    loadDoctorData();
  }, [id, location.state, navigate, toast]);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleSubmit = () => {
    // Converter dados do formulário para o formato do médico
    const workingDays = [];
    if (formData.schedule.segunda.active) workingDays.push("monday");
    if (formData.schedule.terca.active) workingDays.push("tuesday");
    if (formData.schedule.quarta.active) workingDays.push("wednesday");
    if (formData.schedule.quinta.active) workingDays.push("thursday");
    if (formData.schedule.sexta.active) workingDays.push("friday");
    if (formData.schedule.sabado.active) workingDays.push("saturday");
    if (formData.schedule.domingo.active) workingDays.push("sunday");

    const updatedDoctorData = {
      name: formData.personal.fullName,
      crm: formData.personal.crm,
      cpf: formData.personal.cpf,
      phone: formData.personal.phone,
      email: formData.personal.email,
      specialty: formData.specialties[0] || "Especialidade não definida",
      specialties: formData.specialties,
      procedures: formData.procedures,
      workingHours: {
        startTime: formData.schedule.segunda.start,
        endTime: formData.schedule.segunda.end,
        interval: formData.schedule.interval,
        workingDays: workingDays,
      },
    };

    // Atualizar médico no banco de dados simulado
    const updatedDoctor = updateDoctor(parseInt(id), updatedDoctorData);

    if (updatedDoctor) {
      console.log("Médico atualizado:", updatedDoctor);
      toast({
        title: "Médico Atualizado com Sucesso!",
        description: "Os dados do médico foram salvos.",
        variant: "success",
      });
      navigate("/medicos");
    } else {
      toast({
        title: "Erro ao Atualizar",
        description: "Não foi possível atualizar os dados do médico.",
        variant: "destructive",
      });
    }
  };

  const progressValue = (step / 4) * 100;

  const steps = [
    { number: 1, title: "Dados Pessoais", icon: User },
    { number: 2, title: "Especialidades", icon: Stethoscope },
    { number: 3, title: "Procedimentos", icon: ClipboardList },
    { number: 4, title: "Agenda", icon: CalendarDays },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2EA9B0] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do médico...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Editar Médico - VittaHub Clínicas</title>
        <meta
          name="description"
          content="Formulário de edição de médico em etapas."
        />
      </Helmet>

      <div className="space-y-6">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pb-6 -mx-6 px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/medicos")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Editar Médico
              </h1>
              <p className="text-gray-600">
                Atualize as informações do médico.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              {steps.map((s, index) => (
                <React.Fragment key={s.number}>
                  <div className="flex flex-col items-center text-center w-24">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        step >= s.number
                          ? "bg-[#2EA9B0] border-[#2EA9B0] text-white"
                          : "bg-gray-100 border-gray-300"
                      }`}
                    >
                      <s.icon className="w-5 h-5" />
                    </div>
                    <p
                      className={`mt-2 text-sm font-medium ${
                        step >= s.number ? "text-[#2EA9B0]" : "text-gray-500"
                      }`}
                    >
                      {s.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <Progress value={progressValue} className="w-full" />
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <Step1
                data={formData.personal}
                updateData={(d) => updateFormData("personal", d)}
              />
            )}
            {step === 2 && (
              <Step2
                data={formData.specialties}
                updateData={(d) => updateFormData("specialties", d)}
              />
            )}
            {step === 3 && (
              <Step3
                data={formData.procedures}
                updateData={(d) => updateFormData("procedures", d)}
              />
            )}
            {step === 4 && (
              <Step4
                data={formData.schedule}
                updateData={(d) => updateFormData("schedule", d)}
              />
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            Voltar
          </Button>
          {step < 4 && <Button onClick={handleNext}>Próximo</Button>}
          {step === 4 && (
            <Button onClick={handleSubmit}>Salvar Alterações</Button>
          )}
        </div>
      </div>
    </>
  );
};

export default EditarMedico;
