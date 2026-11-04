import z from "zod/v4";

const emailSchema = z.email("E-mail inválido");
const passwordSchema = z
  .string()
  .min(6, "A senha deve ter no mínimo 6 caracteres");

// Schema de validação Zod para Registro de Usuários
export const userSchema = z
  .object({
    email: emailSchema,
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

// Schema simplificado focado exclusivamente no Login
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Tipos TypeScript inferidos automaticamente a partir das regras dos Schemas
export type UserSchema = z.infer<typeof userSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
