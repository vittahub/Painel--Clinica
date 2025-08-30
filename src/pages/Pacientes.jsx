import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { User, Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { useToast } from "../components/ui/use-toast";
import { patients, deletePatient } from "../data/patients";

const Pacientes = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Função para calcular a idade
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

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
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Cabeçalho da tabela */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                <div className="col-span-3">Nome</div>
                <div className="col-span-2">CPF</div>
                <div className="col-span-2">Telefone</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-1">Idade</div>
                <div className="col-span-1">Ações</div>
              </div>
            </div>

            {/* Lista de pacientes */}
            <div className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Nome e Foto */}
                    <div className="col-span-3 flex items-center space-x-3">
                      <img
                        src={patient.image}
                        alt={patient.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {patient.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {patient.address}
                        </p>
                      </div>
                    </div>

                    {/* CPF */}
                    <div className="col-span-2 text-sm text-gray-900">
                      {patient.cpf}
                    </div>

                    {/* Telefone */}
                    <div className="col-span-2 text-sm text-gray-900">
                      {patient.phone}
                    </div>

                    {/* Email */}
                    <div className="col-span-3 text-sm text-gray-900 truncate">
                      {patient.email}
                    </div>

                    {/* Idade */}
                    <div className="col-span-1 text-sm text-gray-900">
                      {calculateAge(patient.birthDate)} anos
                    </div>

                    {/* Ações */}
                    <div className="col-span-1 flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPatient(patient)}
                        className="text-[#2EA9B0] hover:text-[#2EA9B0] hover:bg-[#2EA9B0]/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePatient(patient)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Pacientes;
