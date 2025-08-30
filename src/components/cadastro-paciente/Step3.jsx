import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const Step3 = ({ data, updateData }) => {
  const handleChange = (e) => {
    updateData("additional", { [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="insuranceName">Nome do Convênio</Label>
          <Input
            id="insuranceName"
            name="insuranceName"
            value={data.insuranceName}
            onChange={handleChange}
            placeholder="Nome do plano de saúde"
          />
        </div>
        <div>
          <Label htmlFor="insuranceNumber">Número da Carteirinha</Label>
          <Input
            id="insuranceNumber"
            name="insuranceNumber"
            value={data.insuranceNumber}
            onChange={handleChange}
            placeholder="Número de identificação"
          />
        </div>
        <div>
          <Label htmlFor="insuranceValidity">Validade</Label>
          <Input
            id="insuranceValidity"
            name="insuranceValidity"
            type="date"
            value={data.insuranceValidity}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="responsibleName">Nome do Responsável (se houver)</Label>
        <Input
          id="responsibleName"
          name="responsibleName"
          value={data.responsibleName}
          onChange={handleChange}
          placeholder="Digite o nome do responsável"
        />
      </div>
      <div>
        <Label htmlFor="medicalNotes">Observações Médicas</Label>
        <Textarea
          id="medicalNotes"
          name="medicalNotes"
          value={data.medicalNotes}
          onChange={handleChange}
          placeholder="Alergias, condições preexistentes, etc."
        />
      </div>
    </div>
  );
};

export default Step3;
