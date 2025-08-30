import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { User, Plus, Search, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { useToast } from "../components/ui/use-toast";
import { patients, deletePatient } from "../data/patients";

const Pacientes = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar pacientes baseado no termo de busca
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.cpf.includes(searchTerm)
  );

  const handleEditPatient = (patient) => {
    // Implementar lógica de edição
    console.log("Editar paciente:", patient.id);
  };

  const handleDeletePatient = (patient) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o paciente ${patient.name}?`
      )
    ) {
      const deletedPatient = deletePatient(patient.id);
      if (deletedPatient) {
        toast({
          title: "Paciente Excluído!",
          description: `${patient.name} foi removido com sucesso.`,
          variant: "success",
        });
        // Forçar re-render da página
        window.location.reload();
      } else {
        toast({
          title: "Erro ao Excluir",
          description: "Não foi possível excluir o paciente.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Pacientes - VittaHub Clínicas</title>
        <meta
          name="description"
          content="Lista de pacientes cadastrados na clínica"
        />
      </Helmet>

      <div className="space-y-6">
        {/* Header Global */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pb-6 -mx-6 px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Pacientes
              </h1>
              <p className="text-gray-600">Gerencie os pacientes da clínica</p>
            </div>

            <Link to="/pacientes/novo">
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Novo Paciente</span>
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
              placeholder="Buscar pacientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lista de Pacientes */}
        {filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum paciente encontrado
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Tente ajustar os termos de busca."
                : "Comece cadastrando o primeiro paciente."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={patient.image}
                      alt={patient.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {patient.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        CPF: {patient.cpf}
                      </p>
                      <div className="space-y-1 text-sm text-gray-500">
                        <p>{patient.phone}</p>
                        <p className="truncate">{patient.email}</p>
                        <p className="truncate">{patient.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Nascimento:</span>{" "}
                      {new Date(patient.birthDate).toLocaleDateString("pt-BR")}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPatient(patient)}
                        className="text-[#2EA9B0] hover:text-[#2EA9B0] hover:bg-[#2EA9B0]/10"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePatient(patient)}
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

export default Pacientes;
