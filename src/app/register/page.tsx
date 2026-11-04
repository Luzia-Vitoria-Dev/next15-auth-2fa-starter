"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod/v4";
import { registerUser } from "./actions";
import { userSchema, UserSchema } from "../../validation/schemas";
import Link from "next/link";

export default function Page() {
  // Inicialização do React Hook Form com resolvedor do Zod
  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  // Função disparada no evento onSubmit após a validação do schema com sucesso
  const handleSubmit = async (data: z.infer<typeof userSchema>) => {
    // console.log("Dados validados com sucesso: ", data);

    // Invocação da Server Action no clique do botão de registro
    const response = await registerUser(data);
    console.log(response);

    // console.log("Resposta da Server Action capturada no browser: ", response);

    // Se o servidor recusar a submissão por erro de validação e retornar insucesso
    if (!response.success) {
      if (Array.isArray(response.errors)) {
        // Mapeia iterativamente os erros do servidor nos inputs do formulário
        response.errors.forEach((issue) => {
          issue.path.forEach((path) => {
            form.setError(path as keyof UserSchema, { message: issue.message });
          });
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* TELA 1: FEEDBACK DE SUCESSO (Renderização Condicional) */}
      {form.formState.isSubmitSuccessful ? (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Conta registrada com sucesso!</CardTitle>
          </CardHeader>
          <CardContent>
            <Button>
              <Link href="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* TELA 2: FORMULÁRIO DE CADASTRO */
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Registrar</CardTitle>
            <CardDescription>
              Crie sua conta, é simples e rápido!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                {/* Desabilita todos os campos internos de uma só vez durante o processamento assíncrono */}
                <fieldset
                  className="flex flex-col gap-4"
                  disabled={form.formState.isSubmitting}
                >
                  {/* CAMPO: EMAIL */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormDescription>
                          Digite o seu melhor e-mail
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* CAMPO: SENHA */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormDescription>
                          A senha deve ter no mínimo 6 caracteres
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* CAMPO: CONFIRMAR SENHA */}
                  <FormField
                    control={form.control}
                    name="passwordConfirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar a senha</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* BOTAO DE SUBMISSAO */}
                  <Button type="submit">Registrar</Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
