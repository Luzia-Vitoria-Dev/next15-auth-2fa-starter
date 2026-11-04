"use server";

import { loginSchema } from "@/validation/schemas";
import { $ZodIssue } from "zod/v4/core";

interface LoginWithCredentialsProps {
  email: string;
  password: string;
}

interface ActionResponse {
  success: boolean;
  message: string;
  data?: unknown;
  errors?: $ZodIssue[];
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

  console.log("Chegamos até aqui: ", email, password);

  return {
    success: true,
    message: "Login realizado com sucesso.",
  };
};
