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
import { loginSchema, LoginSchema } from "@/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginWithCredentials, preLoginCheck } from "./action";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();

  // Estados para controlar a etapa atual do login e os dígitos do OTP
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  // Inicialização do formulário conectando o resolver do Zod ao LoginSchema
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Submissão inicial (E-mail e Senha)
  const handleSubmit = async (data: LoginSchema) => {
    // Verificar credenciais e o status de 2FA antes de criar a sessão
    const preLoginCheckResponse = await preLoginCheck(data);

    if (!preLoginCheckResponse.success) {
      form.setError("root" as keyof LoginSchema, {
        message: preLoginCheckResponse.message,
      });
    }

    const twoFactorActivated = (
      preLoginCheckResponse?.data as {
        twoFactorActivated?: boolean;
      }
    )?.twoFactorActivated;

    // Se o usuário tiver 2FA ativo, avança para a tela de OTP mantendo e-mail e senha no estado do form
    if (twoFactorActivated) {
      setStep(2);
    } else {
      // Invocação da Server Action de login
      const response = await loginWithCredentials(data);

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
    }
  };

  // Manipulador provisório para submissão do código OTP no Passo 2
  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reúne as credenciais retidas no formulário junto com o código OTP digitado
    const data = {
      email: form.getValues("email"),
      password: form.getValues("password"),
      token: otp,
    };

    const response = await loginWithCredentials(data);

    // Exibe toast vermelho caso o código OTP seja inválido ou expirado
    if (!response.success) {
      toast.error(response.message, {
        style: { background: "red", color: "#fff" },
      });
    }

    // Exibe toast verde de sucesso e redireciona para a área logada
    if (response.success) {
      toast.success(response.message, {
        style: { background: "green", color: "#fff" },
      });
      router.push("/my-account");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* ETAPA 1: Formulário Padrão de Credenciais */}
      {step === 1 && (
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
          {/* Rodapé do Card contendo links para cadastro e recuperação de senha */}
          <CardFooter className="flex-col">
            <div className="text-muted-foreground text-sm">
              Ainda não tem conta?{" "}
              <Link href="/register" className="underline">
                Registre-se
              </Link>
            </div>

            <div className="text-muted-foreground text-sm">
              Esqueceu sua senha?{" "}
              <Link href="/password-reset" className="underline">
                Alterar senha
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* ETAPA 2: Formulário de Verificação OTP (Exibido apenas se 2FA estiver ativo) */}
      {step === 2 && (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>OTP (One-Time Password)</CardTitle>
            <CardDescription>
              Entre com o OTP exibido no seu App de Autenticação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOTPSubmit} className="flex flex-col gap-2">
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {/* Habilita o botão apenas após os 6 dígitos serem digitados */}
              <Button disabled={otp.length !== 6}>Verificar</Button>
              {/* Limpa a senha do formulário por segurança ao cancelar e voltar ao login */}
              <Button
                variant={"outline"}
                onClick={() => {
                  form.setValue("password", "");
                  setStep(1);
                }}
              >
                Cancelar
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
