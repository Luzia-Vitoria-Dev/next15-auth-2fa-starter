"use server";

import { prisma } from "@/lib/client";
import { ActionResponse } from "@/types/action-response";
import { resetPasswordSchema } from "@/validation/schemas";
import { randomBytes } from "node:crypto";

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

  // Geração do token criptográfico seguro
  const passwordResetToken = randomBytes(32).toString("hex");
  console.log("Token de autorização para reset de senha: ", passwordResetToken);

  // Define a expiração do token para daqui a 60 minutos (3600000 ms)
  const tokenExpiry = new Date(Date.now() + 3600000); // 60 minutos

  // Salva o token gerado vinculado ao ID do usuário na tabela
  const newPasswordResetToken = await prisma.passwordResetToken.create({
    data: { token: passwordResetToken, userId: user.id, tokenExpiry },
  });

  return {
    success: true,
    message: "Solicitação de alteração de senha iniciada com sucesso",
    data: newPasswordResetToken,
  };
};
