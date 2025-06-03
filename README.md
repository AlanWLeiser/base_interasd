This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.


# 📘 InterASD – A Igreja Interagindo

Documentação técnica do sistema InterASD para uso no frontend. Este documento detalha os endpoints da API REST, incluindo formatos de envio, exemplos de requisições e respostas, além de explicações de cada campo e comportamento esperado.

---

## 📌 Sumário

- [📖 Visão Geral](#visão-geral)
- [📲 Funcionamento do QRCode](#funcionamento-do-qrcode)
- [🧾 Categorias do Formulário](#categorias-do-formulário)
- [🔄 Fluxo de Atendimento](#fluxo-de-atendimento)
- [🧪 Endpoints da API REST](#endpoints-da-api-rest)
  - [🔑 Login](#login)
  - [📋 Criar Formulário](#criar-formulário)
  - [📋 Ver Interação Detalhada](#ver-interação-detalhada)
  - [👤 Ver Interações do Usuário](#ver-interações-do-usuário)
  - [🛠️ Ver Interações da Igreja (Admin)](#ver-interações-da-igreja-admin)
  - [🛠️ Atualizar Status da Interação](#atualizar-status-da-interação)
- [🧩 Estrutura de Relacionamento](#estrutura-de-relacionamento)
- [📎 Observações Técnicas](#observações-técnicas)

---

## 📖 Visão Geral

InterASD é um sistema para facilitar o acolhimento e atendimento das necessidades dos membros de uma igreja através de formulários acessados por QR Code durante cultos e eventos. Cada formulário enviado gera uma interação que entra para a fila de atendimento da igreja.

---

## 📲 Funcionamento do QRCode

1. QR Code é escaneado pelo usuário durante o culto.
2. A página de formulário é aberta com `co_igreja` pré-definido.
3. O usuário preenche os campos desejados.
4. O envio gera uma nova interação no sistema.

---

## 🧾 Categorias do Formulário

O formulário está dividido em 6 categorias, e cada uma possui campos específicos, como:

- `no_detalhe`: texto livre.
- `ic_apoio_espiritual`: valores de 1 a 5.
- `ic_pessoa_apoio`: 'S' ou 'N'.
- `no_telefone`: obrigatório em alguns casos.
- `no_email`, `no_endereco`, `de_observacoes`: campos adicionais.

---

## 🔄 Fluxo de Atendimento

1. Formulário enviado gera `co_interacao`.
2. Interação entra na fila da igreja (`co_igreja`).
3. Gestor da igreja distribui para um responsável.
4. Responsável executa ações e registra atualizações.

---

## 🧪 Endpoints da API REST

### 🔑 Login

- **Endpoint:** `POST /api/login`
- **Autenticação:** Não requer token
- **Descrição:** Autentica o usuário e retorna um token JWT.

**Body JSON:**
```json
{
  "no_email": "usuario@example.com",
  "no_senha": "senha_usuario"
}
```

**Response:**
```json
{
  "token": "<jwt_token>",
  "usuario": {
    "co_usuario": 1,
    "co_perfil": 1,
    "no_solicitante": "Nome do Usuário",
    "no_email": "usuario@example.com",
    "no_telefone": "(00) 00000-0000"
  }
}
```

---

### 📋 Criar Formulário

- **Endpoint:** `POST /api/formulario`
- **Autenticação:** Não requer token
- **Descrição:** Cria nova interação com formulários preenchidos.

**Body JSON:**
```json
{
  "co_igreja": 1,
  "usuario": {
    "no_solicitante": "João da Silva",
    "co_perfil": 4,
    "no_email": "joao@email.com",
    "no_telefone": "11988887777",
    "no_endereco": "Rua Exemplo, 123"
  },
  "formularios": [
    {
      "categoria": "Espiritual",
      "detalhes": [
        {
          "co_tipo_pergunta": "Pelo que posso orar por você?",
          "resposta": "Saúde da minha família"
        }
      ]
    }
  ]
}
```

**Response:**
```json
{
  "co_interacao": 101,
  "mensagem": "Formulário enviado com sucesso!",
  "dt_interacao": "2024-05-30T12:00:00"
}
```

---

### 📋 Ver Interação Detalhada

- **Endpoint:** `GET /api/formulario/{co_interacao}`
- **Autenticação:** Bearer Token (JWT)
- **Descrição:** Retorna dados completos da interação.

**Response:**
```json
{
  "co_interacao": 101,
  "usuario": {
    "co_usuario": 6,
    "no_solicitante": "João da Silva"
  },
  "igreja": {
    "co_igreja": 1,
    "no_igreja": "Igreja Central"
  },
  "formularios": [
    {
      "categoria": "Espiritual",
      "detalhes": [
        {
          "co_tipo_pergunta": "Pelo que posso orar por você?",
          "resposta": "Saúde da minha família"
        }
      ]
    }
  ],
  "acoes": []
}
```

---

### 👤 Ver Interações do Usuário

- **Endpoint:** `GET /api/usuario/interacoes`
- **Autenticação:** Bearer Token (JWT)
- **Descrição:** Lista as interações feitas pelo usuário autenticado.

**Response:** igual ao `GET /api/formulario/{co_interacao}` com lista de interações.

---


### 🛠️ Ver Interações da Igreja (Admin)

- **Endpoint:** `GET /api/admin/interacoes/{co_igreja}`
- **Autenticação:** Bearer Token (JWT)
- **Descrição:** Retorna todas as interações registradas de uma igreja específica com seus formulários e ações.

**URL Exemplo:**
```
GET /api/admin/interacoes/1
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "igreja": {
    "co_igreja": 1,
    "no_igreja": "Igreja Central"
  },
  "interacoes": [
    {
      "co_interacao": 100,
      "usuario": {
        "co_usuario": 5,
        "co_perfil": 4,
        "no_solicitante": "Maria Souza",
        "no_email": "maria@example.com",
        "no_telefone": "(11) 91234-5678"
      },
      "co_status_atendimento": "Aberto",
      "formularios": [
        {
          "categoria": "Espiritual",
          "detalhes": [
            {
              "co_tipo_pergunta": "Pelo que posso orar por você?",
              "resposta": "Pela minha saúde"
            }
          ]
        }
      ],
      "acoes": [
        {
          "no_descricao": "Encaminhado ao pastor",
          "co_responsavel_acao": "Pr. João",
          "dt_acao": "2024-05-30T10:00:00"
        }
      ]
    }
  ]
}
```

---

### 🛠️ Atualizar Status da Interação

- **Endpoint:** `PATCH /api/admin/interacoes/{co_interacao}`
- **Autenticação:** Bearer Token (JWT)
- **Descrição:** Atualiza status da interação e define o responsável.

**Body JSON:**
```json
{
  "status": "Em atendimento",
  "co_responsavel": 3
}
```

**Response:**
```json
{
  "co_interacao": 100,
  "status": "Em atendimento",
  "responsavel": {
    "co_responsavel": 3,
    "no_responsavel": "Ancião Paulo"
  },
  "dt_alteracao": "2024-05-30T10:20:00"
}
```

---

## 🧩 Estrutura de Relacionamento

- **Igreja** → muitas **interações**
- **Interação** → um **usuário**
- **Interação** → muitos **formulários**
- **Formulário** → muitos **detalhes**
- **Interação** → uma **fila de atendimento** → muitas **ações**

---

## 📎 Observações Técnicas

- Todos os campos repetidos (telefone, email) são compartilhados entre categorias.
- Autenticação via JWT deve ser feita com `Authorization: Bearer <token>`
- Endereço pode ser obtido via API externa: `https://viacep.com.br/ws/{cep}/json`

---

**Este README é voltado para desenvolvedores frontend.** Integrar os endpoints conforme os exemplos acima e garantir o uso correto do token de autenticação JWT.
