import z from "zod/v4";

// Schema de validação Zod dos dados com mensagens amigáveis e superRefine
export const userSchema = z
  .object({
    email: z.email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    passwordConfirm: z.string(),
  })
  .superRefine((data, context) => {
    // Camada avançada de validação: compara campos interdependentes
    if (data.password !== data.passwordConfirm) {
      context.addIssue({
        code: "custom",
        path: ["passwordConfirm"], // Associa a mensagem diretamente ao campo 'passwordConfirm'
        message: "A senha não confere",
      });
    }
  });

// Tipo TypeScript inferido automaticamente a partir das regras do Schema
export type UserSchema = z.infer<typeof userSchema>;
