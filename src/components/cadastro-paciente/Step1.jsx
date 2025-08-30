import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const Step1 = ({ data, updateData }) => {
  const handleChange = (e) => {
    updateData("personal", { [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value) => {
    updateData("personal", { gender: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <Label htmlFor="fullName">Nome Completo</Label>
        <Input
          id="fullName"
          name="fullName"
          value={data.fullName}
          onChange={handleChange}
          placeholder="Digite o nome completo"
        />
      </div>
      <div>
        <Label htmlFor="birthDate">Data de Nascimento</Label>
        <Input
          id="birthDate"
          name="birthDate"
          type="date"
          value={data.birthDate}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="gender">Sexo</Label>
        <Select onValueChange={handleSelectChange} value={data.gender}>
          <SelectTrigger id="gender">
            <SelectValue placeholder="Selecione o sexo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="masculino">Masculino</SelectItem>
            <SelectItem value="feminino">Feminino</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          name="cpf"
          value={data.cpf}
          onChange={handleChange}
          placeholder="000.000.000-00"
        />
      </div>
      <div>
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          name="phone"
          value={data.phone}
          onChange={handleChange}
          placeholder="(00) 00000-0000"
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange}
          placeholder="exemplo@email.com"
        />
      </div>
    </div>
  );
};

export default Step1;
