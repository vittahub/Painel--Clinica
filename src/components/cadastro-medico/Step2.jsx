import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const specialtiesList = [
  "Cardiologia",
  "Dermatologia",
  "Ginecologia",
  "Ortopedia",
  "Pediatria",
  "Neurologia",
  "Psiquiatria",
  "Endocrinologia",
  "Oftalmologia",
  "Urologia",
];

const Step2 = ({ data, updateData }) => {
  const handleCheckboxChange = (specialty) => {
    const newData = data.includes(specialty)
      ? data.filter((item) => item !== specialty)
      : [...data, specialty];
    updateData(newData);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Selecione as Especialidades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {specialtiesList.map((specialty) => (
            <div key={specialty} className="flex items-center space-x-2">
              <Checkbox
                id={specialty}
                checked={data.includes(specialty)}
                onCheckedChange={() => handleCheckboxChange(specialty)}
              />
              <Label htmlFor={specialty} className="font-normal cursor-pointer">
                {specialty}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Step2;
