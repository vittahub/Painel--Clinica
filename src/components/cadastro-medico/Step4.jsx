import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const daysOfWeek = [
  { id: "segunda", label: "Segunda-feira" },
  { id: "terca", label: "Terça-feira" },
  { id: "quarta", label: "Quarta-feira" },
  { id: "quinta", label: "Quinta-feira" },
  { id: "sexta", label: "Sexta-feira" },
  { id: "sabado", label: "Sábado" },
  { id: "domingo", label: "Domingo" },
];

const Step4 = ({ data, updateData }) => {
  const handleDayToggle = (dayId) => {
    const newSchedule = { ...data };
    newSchedule[dayId].active = !newSchedule[dayId].active;
    updateData(newSchedule);
  };

  const handleTimeChange = (dayId, field, value) => {
    const newSchedule = { ...data };
    newSchedule[dayId][field] = value;
    updateData(newSchedule);
  };

  const handleIntervalChange = (value) => {
    const newSchedule = { ...data, interval: parseInt(value) };
    updateData(newSchedule);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Defina os Horários de Atendimento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Configuração Global do Intervalo */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="mb-4">
              <Label htmlFor="interval" className="font-medium text-base">
                Intervalo entre Consultas
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Este intervalo define a duração de cada horário na agenda
              </p>
            </div>
            <select
              id="interval"
              value={data.interval || 30}
              onChange={(e) => handleIntervalChange(e.target.value)}
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2EA9B0] focus:border-[#2EA9B0]"
            >
              <option value={15}>15 minutos</option>
              <option value={30}>30 minutos</option>
              <option value={45}>45 minutos</option>
              <option value={60}>1 hora</option>
            </select>
          </div>

          {/* Configuração dos Dias */}
          <div className="space-y-4">
            {daysOfWeek.map((day) => (
              <div
                key={day.id}
                className="p-4 border rounded-lg flex flex-col md:flex-row items-center gap-4"
              >
                <div className="flex items-center space-x-2 w-full md:w-1/4">
                  <Checkbox
                    id={day.id}
                    checked={data[day.id].active}
                    onCheckedChange={() => handleDayToggle(day.id)}
                  />
                  <Label htmlFor={day.id} className="font-medium text-base">
                    {day.label}
                  </Label>
                </div>
                {data[day.id].active && (
                  <div className="flex-1 w-full grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`${day.id}-start`}>Início</Label>
                      <Input
                        id={`${day.id}-start`}
                        type="time"
                        value={data[day.id].start}
                        onChange={(e) =>
                          handleTimeChange(day.id, "start", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${day.id}-end`}>Fim</Label>
                      <Input
                        id={`${day.id}-end`}
                        type="time"
                        value={data[day.id].end}
                        onChange={(e) =>
                          handleTimeChange(day.id, "end", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
                {!data[day.id].active && (
                  <div className="flex-1 text-center text-gray-500">
                    Não atende neste dia
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step4;
