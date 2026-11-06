"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/client";
import { ActionResponse } from "@/types/action-response";
import { changePasswordConfirmSchema } from "@/validation/schemas";
import { compare, hash } from "bcryptjs";

interface ChangePasswordProps {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}

export const changePassword = async ({
  currentPassword,
  password,
  passwordConfirm,
}: ChangePasswordProps): Promise<ActionResponse> => {
  // Verifica se o usuário possui uma sessão ativa válida antes de processar
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Você precisa estar logado para alterar a senha",
    };
  }

  // Validação defensiva no servidor utilizando o Zod
  const changePasswordValidation = changePasswordConfirmSchema.safeParse({
    currentPassword,
    password,
    passwordConfirm,
  });

  if (!changePasswordValidation.success) {
    return {
      success: false,
      message: "Erro na validação dos dados",
      errors: changePasswordValidation.error.issues,
    };
  }

  try {
    // Busca o usuário no banco de dados usando o ID extraído da sessão autenticada
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return {
        success: false,
        message: "Usuário não encontrado",
      };
    }

    // Compara a senha informada com o hash atualmente salvo no banco
    const passwordMatch = await compare(currentPassword, user.password);

    if (!passwordMatch) {
      return {
        success: false,
        message: "Senha atual incorreta",
        errors: [
          {
            path: ["currentPassword"],
            message: "Senha atual incorreta",
            code: "custom",
          },
        ],
      };
    }

    // Criptografa a nova senha com um fator de custo de 10 rodadas e atualiza o registro
    const hashedPassword = await hash(password, 10);
    const passwordUpdated = await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    if (!passwordUpdated) {
      return {
        success: false,
        message: "Não foi possível atualizar a senha",
      };
    }

    return {
      success: true,
      message: "Senha alterada com sucesso",
    };
  } catch (e: unknown) {
    console.error(e);

    return {
      success: false,
      message: "Não foi possível alterar a senha",
    };
  }
};
