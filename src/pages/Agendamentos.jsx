import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { UserCheck, Plus, Search, Calendar } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { doctors } from "../data/doctors";

const Agendamentos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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

            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Novo Agendamento</span>
            </Button>
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
                      {doctor.workingHours.startTime} -{" "}
                      {doctor.workingHours.endTime}
                      <br />
                      <span className="font-medium">Intervalo:</span>{" "}
                      {doctor.workingHours.interval}min
                    </div>

                    <Button
                      onClick={() => handleViewSchedule(doctor)}
                      className="bg-[#2EA9B0] hover:bg-[#2EA9B0]/90 text-white"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Ver Agenda
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Agendamentos;
