"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/client";
import { ActionResponse } from "@/types/action-response";
import { generateSecret, generateURI, verify } from "otplib";

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

export const activate2fa = async (token: string) => {
  // Valida a sessão autenticada no servidor
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

  const twoFactorSecret = user.twoFactorSecret;

  if (twoFactorSecret) {
    // Valida o código OTP de 6 dígitos enviado pelo usuário contra o segredo salvo
    const tokenValid = await verify({ secret: twoFactorSecret, token });

    if (!tokenValid.valid) {
      return {
        message: "OTP é inválido.",
        success: false,
      };
    }

    // Atualiza o registro no banco marcando o 2FA como ativado
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorActivated: true },
    });

    return {
      message: "2FA ativado com sucesso.",
      success: true,
    };
  }
};

export const disable2fa = async () => {
  // Valida a sessão autenticada no servidor
  const session = await auth();

  if (!session?.user?.id) {
    return {
      message: "Não autorizado",
      success: false,
    };
  }

  // Atualiza o registro no banco marcando o 2FA como desativado
  await prisma.user.update({
    where: { id: session?.user?.id },
    data: { twoFactorActivated: false },
  });

  return {
    message: "2FA desativado com sucesso.",
    success: true,
  };
};
