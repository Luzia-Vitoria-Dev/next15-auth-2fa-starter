# 🔐 Next.js 15 Authentication & 2FA System

Sistema completo de autenticação, gerenciamento de conta e segurança em duas etapas (2FA/TOTP) desenvolvido com **Next.js 15 (App Router)**, **NextAuth v5**, **Prisma ORM** e **PostgreSQL**.

## ✨ Funcionalidades

- **Cadastro e Login com Credenciais:** Validação rigorosa no client e server-side com criptografia de senhas via `bcryptjs`.
- **Autenticação de Dois Fatores (2FA / TOTP):**
  - Geração de segredo único e URI `otpauth://` via `otplib`.
  - Renderização de QR Code (`qrcode.react`) para vinculação com Google Authenticator, Microsoft Authenticator ou Authy.
  - Fluxo de login em duas etapas com verificação prévia (`preLoginCheck`) e input dedicado de 6 dígitos (`input-otp`).
  - Ativação e desativação dinâmica na área do usuário (`/my-account`).
- **Recuperação e Redefinição de Senha:**
  - Geração de tokens criptográficos de uso único com expiração configurada (`node:crypto`).
  - Envio de e-mails transacionais com templates customizados em React via **Resend** e `@react-email/render`.
- **Proteção de Rotas e Sessão:** Gerenciamento de sessão via JWT e callbacks customizados no NextAuth v5.

## 🛠️ Tecnologias Utilizadas

- **Framework:** Next.js 15 (App Router & Server Actions)
- **Autenticação:** NextAuth.js v5
- **Banco de Dados & ORM:** PostgreSQL (Supabase) + Prisma ORM
- **Validação & Formulários:** React Hook Form + Zod v4
- **Segurança & 2FA:** `bcryptjs`, `otplib`, `qrcode.react`, `node:crypto`
- **E-mails Transacionais:** Resend + `@react-email/render`
- **Estilização & UI:** Tailwind CSS, shadcn/ui, `input-otp`, Sonner (Toasts)
- **Infraestrutura:** Docker & Docker Compose

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos

- Node.js 20+ ou Docker / Docker Compose instalados.
- Uma instância PostgreSQL (local ou Supabase) e uma chave de API do [Resend](https://resend.com/).

### 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do diretório `auth` seguindo o exemplo abaixo:

```env
DATABASE_URL="postgresql://usuario:senha@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://usuario:senha@host:5432/postgres"

AUTH_SECRET="sua_chave_secreta_gerada_via_openssl"
RESEND_API_KEY="re_sua_chave_api_resend"
APP_NAME="Auth"
```
