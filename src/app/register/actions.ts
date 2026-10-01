"use server";

import { PrismaClient } from "../../../generated/prisma/client";
import { userSchema } from "./schemas";
import { hash } from "bcryptjs";

interface RegisterUserProps {
  email: string;
  password: string;
  passwordConfirm: string;
}

export const registerUser = async ({
  email,
  password,
  passwordConfirm,
}: RegisterUserProps) => {
  // -----------------------------------------------------------------------
  // Logs executados EXCLUSIVAMENTE no terminal do servidor (Node.js)
  // -----------------------------------------------------------------------
  // console.log("Chegamos no back-end");
  // console.log(">>>>> ", email, password, passwordConfirm);

  // -----------------------------------------------------------------------
  // Validação Defensiva Server-Side
  // -----------------------------------------------------------------------
  const newUserValidation = userSchema.safeParse({
    email,
    password,
    passwordConfirm,
  });

  // console.log("Resultado da validação no back-end: ", newUserValidation);

  // Bloqueia a execução caso os dados não estejam em conformidade com o schema
  // Retorna os detalhes exatos das issues de validação caso falhe
  if (!newUserValidation.success) {
    return {
      success: false,
      data: newUserValidation.error?.issues,
    };
  }

  // -----------------------------------------------------------------------
  // Criptografia da Senha (Hashing)
  // -----------------------------------------------------------------------
  const hashedPassword = await hash(password, 10);

  // -----------------------------------------------------------------------
  // Persistência de Dados via Prisma Client
  // -----------------------------------------------------------------------
  const prismaClient = new PrismaClient();

  const newUser = await prismaClient.user.create({
    data: { email, password: hashedPassword },
  });

  // -----------------------------------------------------------------------
  // Resposta Padronizada ao Client Component
  // -----------------------------------------------------------------------
  return {
    success: true,
    data: newUser,
  };
};
