import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

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
    // TODO: Validar se o token existe no banco de dados e se está dentro do prazo de validade (tokenExpiry)
    tokenIsValid = true;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      {tokenIsValid ? (
        <Card>
          <CardHeader>
            <CardTitle>Atualizando a senha</CardTitle>
          </CardHeader>
          <CardContent>TODO: Formulário de atualização de senha</CardContent>
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
