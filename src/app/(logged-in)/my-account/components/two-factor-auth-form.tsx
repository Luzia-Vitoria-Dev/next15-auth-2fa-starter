"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { get2faSecret } from "./action";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

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
          {step == 1 && (
            <Button onClick={handleEnableClick}>
              Habilitar autenticação de dois fatores
            </Button>
          )}
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
        </div>
      )}
    </div>
  );
}
