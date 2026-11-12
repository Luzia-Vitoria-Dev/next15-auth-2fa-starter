import { Resend } from "resend";
import { EmailLinkResetPasswordTemplate } from "@/app/(logged-out)/password-reset/components/email-link-reset-password";
import { render } from "@react-email/render";

// Inicializa a instância do Resend utilizando a chave de API das variáveis de ambiente
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailLinkResetPassword({
  to,
  linkResetPassword,
}: {
  to: string;
  linkResetPassword: string;
}) {
  // Renderiza o componente React em uma string HTML estática para envio via Resend
  const html = await render(
    EmailLinkResetPasswordTemplate({ linkResetPassword }),
  );

  await resend.emails.send({
    from: "Não responda <nao-responda@resend.dev>",
    to,
    subject: "Recuperação de senha",
    html,
  });
}
