"use server";

import { prisma } from "@/lib/client";
import { ActionResponse } from "@/types/action-response";
import { resetPasswordSchema } from "@/validation/schemas";
import { randomBytes } from "crypto";

interface PasswordResetProps {
  email: string;
}

export const passwordReset = async ({
  email,
}: PasswordResetProps): Promise<ActionResponse> => {
  // Validação defensiva no servidor utilizando o Zod
  const resetPasswordValidation = resetPasswordSchema.safeParse({ email });

  if (!resetPasswordValidation.success) {
    return {
      success: false,
      message: "Erro na validação dos dados",
      errors: resetPasswordValidation.error.issues,
    };
  }

  // Verifica se o e-mail informado existe cadastrado na base de dados
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return {
      success: false,
      message: "Usuário não encontrado",
      errors: [
        {
          path: ["email"],
          message: "Usuário não encontrado",
          code: "custom",
        },
      ],
    };
  }

  // Token de autorização para reset de senha
  const passwordResetToken = randomBytes(32).toString("hex");
  console.log("Token de autorização para reset de senha: ", passwordResetToken);

  return {
    success: true,
    message: "Processo de reset de senha",
  };
};
