"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  changePasswordConfirmSchema,
  ChangePasswordConfirmSchema,
} from "@/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { changePassword } from "./action";
import { toast } from "sonner";

export default function Page() {
  // Inicialização do formulário conectando o resolver do Zod ao ChangePasswordConfirm
  const form = useForm<ChangePasswordConfirmSchema>({
    resolver: zodResolver(changePasswordConfirmSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirm: "",
    },
  });

  // Função de submissão
  const handleSubmit = async (data: ChangePasswordConfirmSchema) => {
    const response = await changePassword(data);

    console.log(response);

    // Se o servidor retornar falha na validação
    if (!response.success) {
      if (Array.isArray(response.errors)) {
        // Mapeia iterativamente os erros do servidor nos inputs do formulário
        response.errors.forEach((issue) => {
          issue.path.forEach((path) => {
            // Mapeia erros customizados (como o "root") para o estado do formulário
            form.setError(path as keyof ChangePasswordConfirmSchema, {
              message: issue.message,
            });
          });
        });
      }
    }

    // Dispara a notificação de sucesso flutuante utilizando o Sonner
    if (response.success) {
      form.reset(); // Limpa o formulário após o sucesso
      toast.success(response.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {" "}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Alterar senha</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              {/* Desabilita todos os campos internos de uma só vez durante o processamento assíncrono */}
              <fieldset
                className="flex flex-col gap-4"
                disabled={form.formState.isSubmitting}
              >
                {/* CAMPO: SENHA ATUAL */}
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha atual</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CAMPO: NOVA SENHA */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CAMPO: CONFIRMAÇÃO DA NOVA SENHA */}
                <FormField
                  control={form.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmação da nova senha</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* BOTAO DE SUBMISSAO */}
                <Button type="submit">Alterar senha</Button>

                {/* Exibição condicional de erro global (root) */}
                {!!form.formState.errors.root?.message && (
                  <FormMessage>
                    {form.formState.errors.root?.message}
                  </FormMessage>
                )}
              </fieldset>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
