"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema, ResetPasswordSchema } from "@/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { passwordReset } from "./action";
import { toast } from "sonner";

export default function Page() {
  // Inicialização do formulário conectando o resolver do Zod ao LoginSchema
  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Função de submissão
  const handleSubmit = async (data: ResetPasswordSchema) => {
    // Invocação da Server Action de login
    const response = await passwordReset(data);

    // Se o servidor retornar falha na validação
    if (!response.success) {
      // Se houver erros específicos de campos (ex: e-mail não encontrado)
      if (Array.isArray(response.errors)) {
        // Mapeia iterativamente os erros do servidor nos inputs do formulário
        response.errors.forEach((issue) => {
          issue.path.forEach((path) => {
            // Mapeia erros customizados (como o "root") para o estado do formulário
            form.setError(path as keyof ResetPasswordSchema, {
              message: issue.message,
            });
          });
        });
      } else {
        // Erro global na transação/envio de e-mail
        form.setError("root", {
          message: response.message || "Erro inesperado. Tente novamente.",
        });
        toast.error(response.message || "Erro na transação. Tente novamente.");
      }
      return;
    }
    // Sucesso no disparo do e-mail
    toast.success(response.message, {
      style: { background: "green", color: "#fff" },
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* Renderização condicional baseada no sucesso da submissão do formulário */}
      {form.formState.isSubmitSuccessful ? (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Recuperação de senha</CardTitle>
            <CardDescription>
              Um link para redefinição de senha foi enviado para o e-mail
              informado. Acesse sua caixa de entrada e clique no link para criar
              uma nova senha.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Recuperação de senha</CardTitle>
            <CardDescription>
              Esqueceu sua senha? Sem problemas. Informe seu e-mail para
              recuperá-la.
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
          {/* Rodapé do Card contendo links para cadastro e recuperação de senha */}
          <CardFooter className="flex-col">
            <div className="text-muted-foreground text-sm">
              Ainda não tem conta?{" "}
              <Link href="/register" className="underline">
                Registre-se
              </Link>
            </div>

            <div className="text-muted-foreground text-sm">
              Já tem uma conta?{" "}
              <Link href="/login" className="underline">
                Entrar
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
