"use server";

import { signIn } from "@/auth";
import { ActionResponse } from "@/types/action-response";
import { loginSchema } from "@/validation/schemas";
import { AuthError } from "next-auth";

interface LoginWithCredentialsProps {
  email: string;
  password: string;
}

export const loginWithCredentials = async ({
  email,
  password,
}: LoginWithCredentialsProps): Promise<ActionResponse> => {
  // -----------------------------------------------------------------------
  // Validação Defensiva Server-Side
  // -----------------------------------------------------------------------
  const loginValidation = loginSchema.safeParse({
    email,
    password,
  });

  if (!loginValidation.success) {
    return {
      success: false,
      message: "Erro na validação dos dados",
      errors: loginValidation.error?.issues,
    };
  }

  try {
    // Executa a autenticação via NextAuth com redirect desativado para tratamento de erro no client
    await signIn("credentials", { email, password, redirect: false });
  } catch (e: unknown) {
    console.error(e);

    // Captura erros específicos lançados pelo NextAuth (ex: credenciais inválidas)
    if (e instanceof AuthError) {
      return {
        success: false,
        message: "Erro ao realizar o login",
        errors: [
          {
            path: ["root"], // Direciona o erro para o escopo global do formulário
            // message: "Erro ao realizar o login. Tente novamente mais tarde",
            message: e.cause?.err?.message ?? "Erro ao realizar o login",
            code: "custom",
          },
        ],
      };
    }

    if (e instanceof Error) {
      return {
        success: false,
        message: e.message,
      };
    }

    return {
      success: false,
      message: "Erro de login",
    };
  }

  return {
    success: true,
    message: "Login realizado com sucesso",
  };
};
