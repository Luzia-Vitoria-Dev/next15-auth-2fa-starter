"use server";

import { $ZodIssue } from "zod/v4/core";
import { Prisma, User } from "../../../generated/prisma/client";
import { userSchema } from "./schemas";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/client";

// Interface que define a estrutura padronizada de retorno de qualquer Server Action
interface ActionResponse {
  success: boolean;
  message: string;
  data?: User;
  errors?: $ZodIssue[];
}

interface RegisterUserProps {
  email: string;
  password: string;
  passwordConfirm: string;
}

export const registerUser = async ({
  email,
  password,
  passwordConfirm,
}: RegisterUserProps): Promise<ActionResponse> => {
  // -----------------------------------------------------------------------
  // Logs executados EXCLUSIVAMENTE no terminal do servidor (Node.js)
  // -----------------------------------------------------------------------
  // console.log("Chegamos no back-end");
  // console.log(">>>>> ", email, password, passwordConfirm);

  try {
    // -----------------------------------------------------------------------
    // Validação Defensiva com Zod no Server-Side
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
        message: "Erro na validação dos dados",
        errors: newUserValidation.error?.issues,
      };
    }

    // -----------------------------------------------------------------------
    // Criptografia da Senha (Hashing)
    // -----------------------------------------------------------------------
    const hashedPassword = await hash(password, 10);

    // -----------------------------------------------------------------------
    // Persistência de Dados via Prisma Client
    // -----------------------------------------------------------------------
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    // -----------------------------------------------------------------------
    // Resposta Padronizada ao Client Component
    // -----------------------------------------------------------------------
    return {
      success: true,
      message: "Conta criada com sucesso!",
      data: newUser,
    };
  } catch (e: unknown) {
    console.log("### Erro capturado no catch ###");
    console.log(e);

    // -----------------------------------------------------------------------
    // Tratamento de Exceções do Prisma (Unique Constraint Violations)
    // -----------------------------------------------------------------------
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case "P2002":
          return {
            success: false,
            message: "E-mail já está em uso.",
            errors: [
              {
                path: ["email"],
                message: "O e-mail informado já está em uso.",
                code: "custom",
              },
            ],
          };
      }
    }

    // Retorno fallback genérico para falhas inesperadas
    return {
      success: false,
      message: "Erro ao criar a conta.",
    };
  }
};
