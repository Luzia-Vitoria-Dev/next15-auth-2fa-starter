import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verifica se o usuário já possui uma sessão ativa
  const session = await auth();

  // Se já estiver logado, impede o acesso às telas de login/registro e redireciona para a conta
  if (!!session?.user?.id) {
    redirect("/my-account");
  }

  return children;
}
