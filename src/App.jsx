import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Medicos from "./pages/Medicos";
import Agendamentos from "./pages/Agendamentos";
import Pacientes from "./pages/Pacientes";
import NovoPaciente from "./pages/NovoPaciente";
import NovoMedico from "./pages/NovoMedico";
import EditarMedico from "./pages/EditarMedico";
import AgendaMedico from "./pages/AgendaMedico";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>

        git 
          <Route index element={<Dashboard />} />
          <Route path="agendamentos" element={<Agendamentos />} />
          <Route path="medicos" element={<Medicos />} />
          <Route path="medicos/novo" element={<NovoMedico />} />
          <Route path="medicos/:id/editar" element={<EditarMedico />} />
          <Route path="medicos/:id/agenda" element={<AgendaMedico />} />
          <Route path="pacientes" element={<Pacientes />} />
          <Route path="pacientes/novo" element={<NovoPaciente />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
