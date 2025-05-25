import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { InputForm } from "../../components/Input";
import Button from "../../components/ui/button";

import Logo from "../../assets/logo.svg";
import { createLink } from "../../http/create-link";
import { useState } from "react";
import { CardLinks } from "../../components/CardLinks";

const homeSchema = z.object({
  originalLink: z.string({ required_error: "Campo LINK ORIGINAL é obrigatório" }).regex(/^(https:\/\/|http:\/\/|www\.)/, {
    message: "Informe uma url válida.",
  }),
  shortLink: z.string({ required_error: "Campo LINK ENCURTADO é obrigatório" }).regex(/^[a-z][a-z0-9-]*$/, {
    message: "Informe uma url minúscula, sem espaços/caracter especial.",
  })
});

type HomeSchema = z.infer<typeof homeSchema>;

export function Home() {

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const linksForm = useForm<HomeSchema>({
    resolver: zodResolver(homeSchema),
  });

  const { handleSubmit, reset } = linksForm;

  function isSubmitted(data: boolean) {
    setIsFormSubmitted(data);
  }

  function handleSubmitForm(data: HomeSchema) {
    try {
      createLink({ ...data, reset, isSubmitted });
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className="flex flex-col lg:w-[1180px] md:w-full w-[300px] lg:mt-20 mt-10 lg:gap-8 gap-6 lg:items-stretch items-center ">
      <img src={Logo} alt="Logo" className="w-[120px] h-[30px]" />
      <div className="grid lg:grid-cols-10 lg:gap-5 gap-3 grid-cols-3 items-start">
        <form className="lg:col-span-4 col-span-3 flex flex-col gap-6 lg:p-8 p-6 bg-color-white rounded-lg" onSubmit={handleSubmit(handleSubmitForm)} >
          <h1 className="text-lg font-bold">Novo link</h1>
          <FormProvider {...linksForm}>
            <InputForm titulo="LINK ORIGINAL" placeholder="www.exemplo.com.br" name="originalLink" />
            <InputForm titulo="LINK ENCURTADO" prefixo="brev.ly/" name="shortLink" />
            <Button type="submit" variant="primary" disabled={isFormSubmitted}>Salvar link</Button>
          </FormProvider>
        </form>
        <CardLinks reload={isFormSubmitted} />
      </div>
    </div>
  )
}