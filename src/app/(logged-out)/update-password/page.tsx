import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/client";
import Link from "next/link";
import UpdatePasswordForm from "./components/update-password-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  // Aguarda a resolução dos parâmetros de busca passados na URL (Next.js 15)
  const searchParamsValues = await searchParams;
  const { token } = searchParamsValues;

  let tokenIsValid = false;

  if (token) {
    // Busca na tabela de tokens de recuperação o registro correspondente ao token informado
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: { token },
    });

    // Valida se o registro que foi encontrado, possui token válido e se a data atual é anterior à expiração
    if (
      passwordResetToken &&
      passwordResetToken.token &&
      Date.now() < passwordResetToken.tokenExpiry.getTime()
    ) {
      tokenIsValid = true;
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      {tokenIsValid ? (
        <Card>
          <CardHeader>
            <CardTitle>Atualizando a senha</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Repassa o token validado via props para o formulário cliente */}
            {token && <UpdatePasswordForm token={token} />}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Link de atualização de senha expirado</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/password-reset" className="underline">
              Solicite um novo link de recuperação de senha
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
