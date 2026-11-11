"use server";

import { ActionResponse } from "@/types/action-response";
import { passwordConfirmSchema } from "@/validation/schemas";

interface UpdatePasswordProps {
  password: string;
  passwordConfirm: string;
}

export const updatePassword = async ({
  password,
  passwordConfirm,
}: UpdatePasswordProps): Promise<ActionResponse> => {
  console.log("Server action: ", password, passwordConfirm);

  // Validação defensiva no servidor utilizando o Zod
  const passworConfirmSchemaValidation = passwordConfirmSchema.safeParse({
    password,
    passwordConfirm,
  });

  if (!passworConfirmSchemaValidation.success) {
    return {
      success: false,
      message: "Erro ao tentar validar a senha",
      errors: passworConfirmSchemaValidation.error.issues,
    };
  }

  //TODO: Atualizar a senha no banco de dados

  return {
    success: true,
    message: "Senha alterada com sucesso!",
  };
};
