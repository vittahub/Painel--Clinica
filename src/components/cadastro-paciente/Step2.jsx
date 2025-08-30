import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const Step2 = ({ data, updateData }) => {
  const handleChange = (e) => {
    updateData("address", { [e.target.name]: e.target.value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="cep">CEP</Label>
        <Input
          id="cep"
          name="cep"
          value={data.cep}
          onChange={handleChange}
          placeholder="00000-000"
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="street">Logradouro</Label>
        <Input
          id="street"
          name="street"
          value={data.street}
          onChange={handleChange}
          placeholder="Rua, Avenida, etc."
        />
      </div>
      <div>
        <Label htmlFor="number">Número</Label>
        <Input
          id="number"
          name="number"
          value={data.number}
          onChange={handleChange}
          placeholder="Ex: 123"
        />
      </div>
      <div>
        <Label htmlFor="complement">Complemento</Label>
        <Input
          id="complement"
          name="complement"
          value={data.complement}
          onChange={handleChange}
          placeholder="Apto, Bloco, etc."
        />
      </div>
      <div>
        <Label htmlFor="neighborhood">Bairro</Label>
        <Input
          id="neighborhood"
          name="neighborhood"
          value={data.neighborhood}
          onChange={handleChange}
          placeholder="Digite o bairro"
        />
      </div>
      <div>
        <Label htmlFor="city">Cidade</Label>
        <Input
          id="city"
          name="city"
          value={data.city}
          onChange={handleChange}
          placeholder="Digite a cidade"
        />
      </div>
      <div>
        <Label htmlFor="state">Estado</Label>
        <Input
          id="state"
          name="state"
          value={data.state}
          onChange={handleChange}
          placeholder="Digite o estado"
        />
      </div>
    </div>
  );
};

export default Step2;
