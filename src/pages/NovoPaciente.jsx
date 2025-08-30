import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addPatient } from "../data/patients";

import Step1 from "../components/cadastro-paciente/Step1";
import Step2 from "../components/cadastro-paciente/Step2";
import Step3 from "../components/cadastro-paciente/Step3";

const NovoPaciente = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    personal: {
      fullName: "",
      cpf: "",
      phone: "",
      email: "",
      birthDate: "",
    },
    address: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
    },
    medical: {
      allergies: "",
      medications: "",
      conditions: "",
      emergencyContact: "",
      emergencyPhone: "",
    },
  });

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleSubmit = () => {
    // Preparar dados para salvar
    const patientData = {
      name: formData.personal.fullName,
      cpf: formData.personal.cpf,
      phone: formData.personal.phone,
      email: formData.personal.email,
      birthDate: formData.personal.birthDate,
      address: `${formData.address.street}, ${formData.address.number} - ${formData.address.neighborhood}, ${formData.address.city}, ${formData.address.state}`,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", // Imagem padrão
    };

    // Adicionar paciente usando a função do arquivo de dados
    const newPatient = addPatient(patientData);

    console.log("Paciente cadastrado:", newPatient);
    toast({
      title: "Cadastro Realizado com Sucesso!",
      description: "Os dados do paciente foram salvos.",
      variant: "success",
    });
    navigate("/pacientes");
  };

  const progressValue = (step / 3) * 100;

  const steps = [
    { number: 1, title: "Dados Pessoais", icon: User },
    { number: 2, title: "Endereço", icon: MapPin },
    { number: 3, title: "Informações Médicas", icon: CalendarDays },
  ];

  return (
    <>
      <Helmet>
        <title>Novo Paciente - VittaHub Clínicas</title>
        <meta
          name="description"
          content="Formulário de cadastro de novo paciente em etapas."
        />
      </Helmet>

      <div className="space-y-6">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pb-6 -mx-6 px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/pacientes")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Cadastrar Novo Paciente
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
                data={formData.address}
                updateData={(d) => updateFormData("address", d)}
              />
            )}
            {step === 3 && (
              <Step3
                data={formData.medical}
                updateData={(d) => updateFormData("medical", d)}
              />
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            Voltar
          </Button>
          {step < 3 && <Button onClick={handleNext}>Próximo</Button>}
          {step === 3 && (
            <Button onClick={handleSubmit}>Salvar Cadastro</Button>
          )}
        </div>
      </div>
    </>
  );
};

export default NovoPaciente;
