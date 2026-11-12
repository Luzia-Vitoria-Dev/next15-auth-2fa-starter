import { Resend } from "resend";

// Inicializa a instância do Resend utilizando a chave de API das variáveis de ambiente
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailLinkResetPassword({ to }: { to: string }) {
  await resend.emails.send({
    from: "Não responda <nao-responda@resend.dev>",
    to,
    subject: "Recuperação de senha",
    text: "Chegamos até aqui",
  });
}
