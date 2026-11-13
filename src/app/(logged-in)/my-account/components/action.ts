"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/client";
import { ActionResponse } from "@/types/action-response";
import { generateSecret, generateURI } from "otplib";

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

  let twoFactorSecret = user.twoFactorSecret;

  // Se o usuário ainda não tiver um segredo 2FA, gera um novo e o persiste no banco
  if (!twoFactorSecret) {
    twoFactorSecret = generateSecret();
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret },
    });
  }

  // Gera a URI otplib (otpauth://) para configuração em aplicativos autenticadores
  const uri = generateURI({
    issuer: process.env.APP_NAME || "",
    label: user.email,
    secret: twoFactorSecret,
  });

  // Retorno provisório para validação do fluxo de clique no front-end
  return {
    message: "QR code do 2FA gerado com sucesso.",
    success: true,
    data: uri, // Retorna a URI gerada para o front-end
  };
};
