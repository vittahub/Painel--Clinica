import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { addDoctor } from "../data/doctors";

import Step1 from "../components/cadastro-medico/Step1";
import Step2 from "../components/cadastro-medico/Step2";
import Step3 from "../components/cadastro-medico/Step3";
import Step4 from "../components/cadastro-medico/Step4";

const NovoMedico = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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
      interval: 30, // Intervalo padrão de 30 minutos
      segunda: { active: false, start: "08:00", end: "18:00" },
      terca: { active: false, start: "08:00", end: "18:00" },
      quarta: { active: false, start: "08:00", end: "18:00" },
      quinta: { active: false, start: "08:00", end: "18:00" },
      sexta: { active: false, start: "08:00", end: "18:00" },
      sabado: { active: false, start: "08:00", end: "12:00" },
      domingo: { active: false, start: "08:00", end: "12:00" },
    },
  });

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

    const doctorData = {
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

    // Adicionar médico usando a função do arquivo de dados
    const newDoctor = addDoctor(doctorData);

    console.log("Médico cadastrado:", newDoctor);
    toast({
      title: "Cadastro Realizado com Sucesso!",
      description: "Os dados do médico foram salvos.",
      variant: "success",
    });
    navigate("/medicos");
  };

  const progressValue = (step / 4) * 100;

  const steps = [
    { number: 1, title: "Dados Pessoais", icon: User },
    { number: 2, title: "Especialidades", icon: Stethoscope },
    { number: 3, title: "Procedimentos", icon: ClipboardList },
    { number: 4, title: "Agenda", icon: CalendarDays },
  ];

  return (
    <>
      <Helmet>
        <title>Novo Médico - VittaHub Clínicas</title>
        <meta
          name="description"
          content="Formulário de cadastro de novo médico em etapas."
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
                Cadastrar Novo Médico
              </h1>
              <p className="text-gray-600">
                Siga as etapas para concluir o cadastro.
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
            <Button onClick={handleSubmit}>Salvar Cadastro</Button>
          )}
        </div>
      </div>
    </>
  );
};

export default NovoMedico;
