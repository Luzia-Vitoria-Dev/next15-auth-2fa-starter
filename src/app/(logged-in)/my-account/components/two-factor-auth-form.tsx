"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { get2faSecret } from "./action";

interface TwoFactorAuthFormProps {
  twoFactorActivated: boolean;
}

export default function TwoFactorAuthForm({
  twoFactorActivated,
}: TwoFactorAuthFormProps) {
  // Estado local para controlar a interface de ativação/desativação do 2FA
  const [isActivated, setIsActivated] = useState(twoFactorActivated);

  // Manipulador de clique para iniciar o processo de ativação do 2FA
  const handleEnableClick = async () => {
    const response = await get2faSecret();
    console.log("Resposta: ", response);
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
          <Button onClick={handleEnableClick}>
            Habilitar autenticação de dois fatores
          </Button>
        </div>
      )}
    </div>
  );
}
