import Link from "next/link";
import LogoutButton from "./logout-button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verifica se o usuário possui uma sessão ativa válida no servidor
  const session = await auth();

  // Se não estiver autenticado, redireciona imediatamente para a tela de login
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Barra de Navegação Superior exclusiva para usuários logados */}
      <nav className="bg-gray-200 justify-between flex p-4 items-center">
        <ul className="flex gap-4">
          <li>
            <Link href="/my-account">Minha conta</Link>
          </li>
          <li>
            <Link href="/change-password">Alterar senha</Link>
          </li>
        </ul>
        <div>
          <LogoutButton />
        </div>
      </nav>
      {/* Container flexível para renderizar a página filha centralizada */}
      <div className="flex flex-1 justify-center items-center">{children}</div>
    </div>
  );
}
