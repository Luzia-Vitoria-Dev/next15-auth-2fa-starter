import { auth } from "@/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default async function Page() {
  // Recupera a sessão validada diretamente no servidor
  const session = await auth();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>Minha conta</CardHeader>
      <CardContent>
        <Label>E-mail</Label>
        <div className="text-muted-foreground">{session?.user?.email}</div>
      </CardContent>
    </Card>
  );
}
