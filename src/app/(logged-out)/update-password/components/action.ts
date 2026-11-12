"use server";

import { ActionResponse } from "@/types/action-response";
import { updatePasswordConfirmSchema } from "@/validation/schemas";

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

  //TODO: Atualizar a senha no banco de dados

  console.log("### TOKEN RECEBIDO NA ACTION: ", token);

  return {
    success: true,
    message: "Senha alterada com sucesso!",
  };
};
