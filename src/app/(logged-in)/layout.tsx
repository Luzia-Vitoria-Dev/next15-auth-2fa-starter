import Link from "next/link";
import LogoutButton from "../logout-button";
import { auth } from "@/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Executa a validação da sessão no servidor e imprime no console para debug
  const session = await auth();
  console.log("SESSION: ", session);

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
