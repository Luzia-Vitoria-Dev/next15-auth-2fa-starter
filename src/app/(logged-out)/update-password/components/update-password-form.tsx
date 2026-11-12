"use client";

import { Button } from "@/components/ui/button";
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
  updatePasswordConfirmSchema,
  UpdatePasswordConfirmSchema,
} from "@/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updatePassword } from "./action";
import { toast } from "sonner";

export default function UpdatePasswordForm({ token }: { token: string }) {
  // Inicialização do formulário conectando o resolver do Zod ao ChangePasswordConfirm
  const form = useForm<UpdatePasswordConfirmSchema>({
    resolver: zodResolver(updatePasswordConfirmSchema),
    defaultValues: {
      token, // Inicializa o token oculto no estado do formulário
      password: "",
      passwordConfirm: "",
    },
  });

  // Função de submissão
  const handleSubmit = async (data: UpdatePasswordConfirmSchema) => {
    const response = await updatePassword(data);

    console.log(response);
    if (!response.success) {
      if (Array.isArray(response.errors)) {
        response.errors.forEach((issue) => {
          issue.path.forEach((path) => {
            form.setError(path as keyof UpdatePasswordConfirmSchema, {
              message: issue.message,
            });
          });
        });
      } else {
        // Se o erro não for de campo (ex: Token inválido/expirado), recarrega a página para exibir o card de expiração
        window.location.reload();
      }
    }

    if (response.success) {
      form.reset();
      toast.success(response.message, {
        style: { background: "green", color: "#fff" },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {/* Desabilita todos os campos internos de uma só vez durante o processamento assíncrono */}
        <fieldset
          className="flex flex-col gap-4"
          disabled={form.formState.isSubmitting}
        >
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

          {/* CAMPO: CONFIRMAÇÃO DE SENHA */}
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
            <FormMessage>{form.formState.errors.root?.message}</FormMessage>
          )}
        </fieldset>
      </form>
    </Form>
  );
}
