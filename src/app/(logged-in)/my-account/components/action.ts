"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/client";
import { ActionResponse } from "@/types/action-response";

export const get2faSecret = async (): Promise<ActionResponse> => {
  // Recupera e valida a sessão atual no servidor
  const session = await auth();

  if (!session?.user?.id) {
    return {
      message: "Não autorizado",
      success: false,
    };
  }

  // Verifica se o usuário existe na base de dados
  const user = await prisma.user.findFirst({ where: { id: session.user.id } });

  if (!user) {
    return {
      message: "Usuário não encontrado",
      success: false,
    };
  }

  // Retorno provisório para validação do fluxo de clique no front-end
  return {
    message: "Chegamos até o método get2faSecret",
    success: true,
  };
};
