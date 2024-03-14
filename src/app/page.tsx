"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  value: z.string().min(2),
  payment: z.string().min(2).nullable(),
  beneficiary: z.object({
    name: z.string().min(3),
    birthday: z.string(),
  }),
  services: z.array(z.string()),
});

type FormValues = z.infer<typeof FormSchema>;

const PaymentTypes = [
  { value: "debit", label: "Débito" },
  { value: "credit1", label: "Crédito 1x" },
  { value: "credit2", label: "Crédito 2x" },
  { value: "credit3", label: "Crédito 3x" },
  { value: "credit4", label: "Crédito 4x" },
  { value: "credit5", label: "Crédito 5x" },
];

const ServiceTypes = [
  { value: "service1", label: "TOMOGRAFIA" },
  { value: "service2", label: "RADIOGRAFIA PERIAPICAL" },
  { value: "service3", label: "DOCUMENTAÇAO ODONTOLOGICA" },
  { value: "service4", label: "Serviço 4" },
  { value: "service5", label: "Serviço 5" },
];

export default function Home() {
  const { register, handleSubmit, reset } = useForm({});

  const [result, setResult] = useState("");

  const onSubmit = (data: any) => {
    let result = "";
    const tribute = (Number(data.value) * 0.1631).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    for (const ds of data.services) {
      const serviceName = ServiceTypes.find(
        (service) => service.value == ds
      )?.label;

      result += `${serviceName}\n`;
    }

    const payment = PaymentTypes.find(
      (payment) => payment.value === data.payment
    )?.label;

    result += `Valor Aproximado de Tributos Lei 12.741 - 16,51% -  R$${tribute}\n`;
    result += `Forma de Pagamento: ${payment}\n`;

    if (data.beneficiary.name) {
      result += `Beneficiário: ${data.beneficiary.name}\n`;
      result += `DN: ${data.beneficiary.birthday}\n`;
    }

    setResult(result);
    reset({
      services: data.services,
      payment: data.payment,
      value: data.value,
      beneficiary: {
        name: "",
        birthday: "",
      },
    });
  };

  return (
    <main className="flex flex-1 min-h-screen   items-center justify-center gap-8 px-10">
      <form
        className="flex flex-col gap-7 w-full  max-w-smmt-20"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl font-bold text-center">Formulário</h1>

        <h2 className="text-xl font-bold">Serviços</h2>

        <div className="flex flex-col gap-2">
          {ServiceTypes.map((service, i) => (
            <div className="items-top flex space-x-2">
              <input
                type="checkbox"
                value={service.value}
                {...register("services")}
              />
              <div className="grid gap-1.5 leading-none">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {service.label}
                </label>
              </div>
            </div>
          ))}
        </div>

        <Input type="text" placeholder="Valor" {...register("value")} />

        <select
          {...register("payment")}
          className="text-sm ring-offset-black py-2 px-3 bg-background border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Forma de pagamento</option>
          {PaymentTypes.map((payment) => (
            <option key={payment.value} value={payment.value}>
              {payment.label}
            </option>
          ))}
        </select>

        <Input
          type="text"
          placeholder="Beneficiário"
          {...register("beneficiary.name")}
        />

        <Input
          type="text"
          placeholder="Data de Nascimento do Beneficiário"
          {...register("beneficiary.birthday")}
        />

        <Button type="submit">Enviar</Button>
      </form>

      {result && (
        <div className="flex flex-col gap-2  max-w-sm">
          <h2 className="text-xl font-bold">Resultado</h2>
          <pre>{result}</pre>
          <Button onClick={() => setResult("")}>Limpar</Button>
        </div>
      )}
    </main>
  );
}
