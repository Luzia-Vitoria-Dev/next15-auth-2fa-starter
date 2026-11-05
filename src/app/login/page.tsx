"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { loginSchema, LoginSchema } from "@/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginWithCredentials } from "./action";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  // Inicialização do formulário conectando o resolver do Zod ao LoginSchema
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Função de submissão
  const handleSubmit = async (data: LoginSchema) => {
    // Invocação da Server Action de login
    const response = await loginWithCredentials(data);

    console.log(response);

    // Se o servidor retornar falha na validação
    if (!response.success) {
      if (Array.isArray(response.errors)) {
        // Mapeia iterativamente os erros do servidor nos inputs do formulário
        response.errors.forEach((issue) => {
          issue.path.forEach((path) => {
            // Mapeia erros customizados (como o "root") para o estado do formulário
            form.setError(path as keyof LoginSchema, {
              message: issue.message,
            });
          });
        });
      }
    }

    // Redireciona o usuário autenticado para a rota protegida
    if (response.success) {
      router.push("/my-account");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {" "}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Acesse sua conta.</CardDescription>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* BOTAO DE SUBMISSAO */}
                <Button type="submit">Entrar</Button>

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
