import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const proceduresList = [
  "Consulta de Rotina",
  "Eletrocardiograma",
  "Biópsia de Pele",
  "Papanicolau",
  "Infiltração Articular",
  "Vacinação Infantil",
  "Eletroencefalograma",
  "Terapia Cognitivo-Comportamental",
  "Avaliação Hormonal",
  "Exame de Refração",
];

const Step3 = ({ data, updateData }) => {
  const handleCheckboxChange = (procedure) => {
    const newData = data.includes(procedure)
      ? data.filter((item) => item !== procedure)
      : [...data, procedure];
    updateData(newData);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Selecione os Procedimentos Realizados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {proceduresList.map((procedure) => (
            <div key={procedure} className="flex items-center space-x-2">
              <Checkbox
                id={procedure}
                checked={data.includes(procedure)}
                onCheckedChange={() => handleCheckboxChange(procedure)}
              />
              <Label htmlFor={procedure} className="font-normal cursor-pointer">
                {procedure}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Step3;
