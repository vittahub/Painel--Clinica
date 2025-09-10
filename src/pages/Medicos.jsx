import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { UserCheck, Plus, Search, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { useToast } from "../components/ui/use-toast";
import { doctors, deleteDoctor } from "../data/doctors";

const Medicos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar médicos baseado no termo de busca
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.crm.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditDoctor = (doctor) => {
    navigate(`/medicos/${doctor.id}/editar`, { state: { doctor } });
  };

  const handleDeleteDoctor = (doctor) => {
    if (
      window.confirm(`Tem certeza que deseja excluir o médico ${doctor.name}?`)
    ) {
      const deletedDoctor = deleteDoctor(doctor.id);
      if (deletedDoctor) {
        toast({
          title: "Médico Excluído!",
          description: `${doctor.name} foi removido com sucesso.`,
          variant: "success",
        });
        // Forçar re-render da página
        window.location.reload();
      } else {
        toast({
          title: "Erro ao Excluir",
          description: "Não foi possível excluir o médico.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Médicos - VittaHub Clínicas</title>
        <meta
          name="description"
          content="Lista de médicos cadastrados na clínica"
        />
      </Helmet>

      <div className="space-y-6">
        {/* Header Global */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pb-6 -mx-6 px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Médicos</h1>
              <p className="text-gray-600">Gerencie os médicos da clínica</p>
            </div>

            <Link to="/medicos/novo">
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Novo Médico</span>
              </Button>
            </Link>
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
                : "Comece cadastrando o primeiro médico."}
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

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditDoctor(doctor)}
                        className="text-[#2EA9B0] hover:text-[#2EA9B0] hover:bg-[#2EA9B0]/10"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDoctor(doctor)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Apagar
                      </Button>
                    </div>
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

export default Medicos;
