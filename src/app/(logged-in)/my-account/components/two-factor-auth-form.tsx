"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { get2faSecret } from "./action";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface TwoFactorAuthFormProps {
  twoFactorActivated: boolean;
}

export default function TwoFactorAuthForm({
  twoFactorActivated,
}: TwoFactorAuthFormProps) {
  const [isActivated, setIsActivated] = useState(twoFactorActivated);
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);

  // Manipulador para disparar a obtenção do segredo e avançar para o passo do QR Code
  const handleEnableClick = async () => {
    const response = await get2faSecret();

    if (response.success) {
      toast.success(response.message, {
        style: { background: "green", color: "#fff" },
      });

      setCode(response.data as string);
      setStep(2); // Avança para a etapa de exibição do QR Code
    }
  };

  // Manipulador de submissão do código OTP inserido pelo usuário
  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Disparar ação para confirmar a ativação do 2FA.");
  };

  return (
    <div>
      {isActivated && (
        <div>
          <Button variant={"destructive"}>
            Desabilitar autenticação de dois fatores
          </Button>
        </div>
      )}

      {!isActivated && (
        <div>
          {/* ETAPA 1: Botão inicial de habilitação */}
          {step == 1 && (
            <Button onClick={handleEnableClick}>
              Habilitar autenticação de dois fatores
            </Button>
          )}

          {/* ETAPA 2: Exibição do QR Code */}
          {step == 2 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground py-2">
                Leia este QR code no seu app de autenticação preferido, por
                exemplo no Google Authenticator ou Microsoft Authenticator.
              </p>
              {/* Renderiza o QR Code com base na URI gerada pela Server Action */}
              <QRCodeSVG value={code} />
              <Button onClick={() => setStep(3)}>QR code escaneado</Button>
              <Button onClick={() => setStep(1)} variant={"outline"}>
                Cancelar
              </Button>
            </div>
          )}

          {/* ETAPA 3: Formulário de Inserção de Código OTP */}
          {step == 3 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                Informe o código de verificação do seu App de Autenticação (ex.:
                Google Authenticator, Microsoft Authenticator)
              </p>
              <form onSubmit={handleOTPSubmit} className="flex flex-col gap-2">
                <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <Button>Ativar 2FA</Button>
                {/* Botão para retornar ao passo anterior (QR Code) */}
                <Button variant={"outline"} onClick={() => setStep(2)}>
                  Cancelar
                </Button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
