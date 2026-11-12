"use server";

import { prisma } from "@/lib/client";
import { ActionResponse } from "@/types/action-response";
import { updatePasswordConfirmSchema } from "@/validation/schemas";
import { hash } from "bcryptjs";

interface UpdatePasswordProps {
  token: string;
  password: string;
  passwordConfirm: string;
}

export const updatePassword = async ({
  token,
  password,
  passwordConfirm,
}: UpdatePasswordProps): Promise<ActionResponse> => {
  // Validação defensiva no servidor utilizando o Zod
  const updatePasswordConfirmSchemaValidation =
    updatePasswordConfirmSchema.safeParse({
      token,
      password,
      passwordConfirm,
    });

  if (!updatePasswordConfirmSchemaValidation.success) {
    return {
      success: false,
      message: "Erro ao tentar validar a senha",
      errors: updatePasswordConfirmSchemaValidation.error.issues,
    };
  }

  console.log("### TOKEN RECEBIDO NA ACTION: ", token);

  // Revalidação defensiva do token de reset de senha no banco de dados
  let tokenIsValid = false;

  if (token) {
    // Busca na tabela de tokens de recuperação o registro correspondente ao token informado
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: { token },
    });

    // Valida se o registro que foi encontrado, possui token válido e se a data atual é anterior à expiração
    if (
      passwordResetToken &&
      passwordResetToken.token &&
      Date.now() < passwordResetToken.tokenExpiry.getTime()
    ) {
      tokenIsValid = true;
    }

    // Retorna erro caso o token tenha expirado ou não seja encontrado
    if (!tokenIsValid) {
      return {
        success: false,
        message: "Token inválido ou expirado.",
      };
    }

    // Gera o hash seguro da nova senha utilizando bcryptjs (com cost factor 10)
    const hashedPassword = await hash(password, 10);

    // Atualiza a senha do usuário vinculado no banco de dados
    const passwordUpdated = await prisma.user.update({
      where: { id: passwordResetToken?.userId },
      data: { password: hashedPassword },
    });

    if (!passwordUpdated) {
      return {
        success: false,
        message: "Erro ao atualizar a senha do usuário.",
      };
    }

    // Deleta o token de redefinição utilizado para garantir que ele não possa ser reutilizado
    await prisma.passwordResetToken.delete({
      where: { id: passwordResetToken?.id },
    });
  }

  return {
    success: true,
    message: "Senha alterada com sucesso!",
  };
};
