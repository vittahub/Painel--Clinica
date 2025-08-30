import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {
  UserCheck,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { doctors } from "../data/doctors";
import { patients } from "../data/patients";

const Dashboard = () => {
  // Calcular estatísticas baseadas nos dados
  const totalDoctors = doctors.length;
  const totalPatients = patients.length;

  // Simular dados de agendamentos para hoje
  const todayAppointments = 12;
  const completedAppointments = 8;
  const pendingAppointments = 3;
  const cancelledAppointments = 1;

  // Simular dados de faturamento
  const monthlyRevenue = 45000;
  const previousMonthRevenue = 42000;
  const revenueGrowth = (
    ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) *
    100
  ).toFixed(1);

  return (
    <>
      <Helmet>
        <title>Dashboard - VittaHub Clínicas</title>
        <meta
          name="description"
          content="Painel de controle da clínica com estatísticas e métricas"
        />
      </Helmet>

      <div className="space-y-6">
        {/* Header Global */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pb-6 -mx-6 px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Visão geral da clínica e métricas importantes
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/agendamentos">
                <Button
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Ver Agendamentos</span>
                </Button>
              </Link>
              <Link to="/medicos/novo">
                <Button className="flex items-center space-x-2">
                  <UserCheck className="h-4 w-4" />
                  <span>Novo Médico</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Médicos
              </CardTitle>
              <UserCheck className="h-4 w-4 text-[#2EA9B0]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDoctors}</div>
              <p className="text-xs text-gray-500">Profissionais ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Pacientes
              </CardTitle>
              <Users className="h-4 w-4 text-[#2EA9B0]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPatients}</div>
              <p className="text-xs text-gray-500">Cadastros ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Consultas Hoje
              </CardTitle>
              <Calendar className="h-4 w-4 text-[#2EA9B0]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayAppointments}</div>
              <p className="text-xs text-gray-500">Agendamentos do dia</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Faturamento Mensal
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-[#2EA9B0]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {monthlyRevenue.toLocaleString()}
              </div>
              <p
                className={`text-xs ${
                  revenueGrowth >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {revenueGrowth >= 0 ? "+" : ""}
                {revenueGrowth}% vs mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status dos Agendamentos de Hoje */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-[#2EA9B0]" />
                <span>Status dos Agendamentos de Hoje</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Concluídas</span>
                  </div>
                  <span className="font-semibold">{completedAppointments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Pendentes</span>
                  </div>
                  <span className="font-semibold">{pendingAppointments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Canceladas</span>
                  </div>
                  <span className="font-semibold">{cancelledAppointments}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-[#2EA9B0]" />
                <span>Médicos Mais Ativos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {doctors.slice(0, 3).map((doctor, index) => (
                  <div
                    key={doctor.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#2EA9B0] rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{doctor.name}</p>
                        <p className="text-xs text-gray-500">
                          {doctor.specialty}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {Math.floor(Math.random() * 20) + 10} consultas
                      </p>
                      <p className="text-xs text-gray-500">este mês</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/medicos/novo">
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <UserCheck className="h-6 w-6 text-[#2EA9B0]" />
                  <span>Cadastrar Médico</span>
                </Button>
              </Link>
              <Link to="/pacientes/novo">
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Users className="h-6 w-6 text-[#2EA9B0]" />
                  <span>Cadastrar Paciente</span>
                </Button>
              </Link>
              <Link to="/agendamentos">
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Calendar className="h-6 w-6 text-[#2EA9B0]" />
                  <span>Ver Agendamentos</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
