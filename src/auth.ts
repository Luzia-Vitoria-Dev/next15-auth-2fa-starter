import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/client";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      // CAMADA 1: AUTHORIZE (Validação de credenciais e consulta ao banco)
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-mail e senha são obrigatórios");
        }

        // Busca o usuário no banco de dados via Prisma Singleton
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          throw new Error("Usuário não encontrado");
        }

        // Compara a senha enviada com o hash salvo no banco
        const isPasswordValid = await compare(
          credentials.password as string,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Senha incorreta");
        }

        // Retorna o objeto básico do usuário que alimenta o fluxo do token
        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    // CAMADA 2: JWT (Captura o usuário no momento do login e injeta no token)
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    // CAMADA 3: SESSION (Mapeia os dados do token para o objeto de sessão do cliente)
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;

      return session;
    },
  },
});
