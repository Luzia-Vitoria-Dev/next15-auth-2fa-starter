import { auth } from "@/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/client";
import { redirect } from "next/navigation";
import TwoFactorAuthForm from "./components/two-factor-auth-form";

export default async function Page() {
  // Recupera a sessão validada diretamente no servidor
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Busca os dados atualizados do usuário no banco de dados para verificar o status do 2FA
  const user = await prisma.user.findFirst({
    where: { id: session?.user.id },
  });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>Minha conta</CardHeader>
      <CardContent>
        <Label>E-mail</Label>
        <div className="text-muted-foreground">{session?.user?.email}</div>

        {/* Renderiza o componente de gerenciamento de 2FA passando o status atual */}
        <TwoFactorAuthForm
          twoFactorActivated={user?.twoFactorActivated ?? false}
        />
      </CardContent>
    </Card>
  );
}
