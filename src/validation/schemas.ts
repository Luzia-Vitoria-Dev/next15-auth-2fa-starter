import z from "zod/v4";

const emailSchema = z.email("E-mail inválido");
const passwordSchema = z
  .string()
  .min(6, "A senha deve ter no mínimo 6 caracteres");

export const passwordConfirmSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .superRefine((data, context) => {
    // Camada avançada de validação: compara campos interdependentes (se as senhas coincidem)
    if (data.password !== data.passwordConfirm) {
      context.addIssue({
        code: "custom",
        path: ["passwordConfirm"], // Associa a mensagem diretamente ao campo 'passwordConfirm'
        message: "A senha não confere",
      });
    }
  });

// Schema de validação Zod para Registro de Usuários
export const userSchema = z
  .object({
    email: emailSchema,
  })
  .and(passwordConfirmSchema);

// Schema simplificado focado exclusivamente no Login
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Schema específico para alteração de senha combinando senha atual com o validador de confirmação
export const changePasswordConfirmSchema = z
  .object({
    currentPassword: passwordSchema,
  })
  .and(passwordConfirmSchema);

// Tipos TypeScript inferidos automaticamente a partir das regras dos Schemas
export type UserSchema = z.infer<typeof userSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type ChangePasswordConfirmSchema = z.infer<
  typeof changePasswordConfirmSchema
>;
