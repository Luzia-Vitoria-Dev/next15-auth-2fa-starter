"use server";

import { userSchema } from "./schemas";

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
  // Logs executados EXCLUSIVAMENTE no terminal do servidor (Node.js)
  // console.log("Chegamos no back-end");
  // console.log(">>>>> ", email, password, passwordConfirm);

  // Executa a validação defensiva no servidor sem lançar exceções (throw error)
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

  // TODO cadastrar o usuário no banco de dados

  // TODO: Criptografar senha (hash) e salvar no banco de dados

  return {
    success: true,
    messagem: "Usuário cadastrado com sucesso!",
  };
};
