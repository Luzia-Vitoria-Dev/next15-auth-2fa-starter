"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TwoFactorAuthFormProps {
  twoFactorActivated: boolean;
}

export default function TwoFactorAuthForm({
  twoFactorActivated,
}: TwoFactorAuthFormProps) {
  // Estado local para controlar a interface de ativação/desativação do 2FA
  const [isActivated, setIsActivated] = useState(twoFactorActivated);

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
          <Button>Habilitar autenticação de dois fatores</Button>
        </div>
      )}
    </div>
  );
}
