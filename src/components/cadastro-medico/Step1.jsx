import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const Step1 = ({ data, updateData }) => {
  const handleChange = (e) => {
    updateData({ ...data, [e.target.name]: e.target.value });
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
        <Label htmlFor="crm">CRM</Label>
        <Input
          id="crm"
          name="crm"
          value={data.crm}
          onChange={handleChange}
          placeholder="CRM/SP 123456"
        />
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
      <div>
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
