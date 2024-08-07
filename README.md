###### ~~<p align="center">[Projetos e Construção de Sistemas 2022.2](https://github.com/Projeto-e-Construcao-de-Sistemas-2022-2)</p>~~
###### <p align="center">Projeto Integrador II 2024.1</p>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./logo-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="./logo-light.png">
  <img alt="logo" src="./logo-light.png" style="width:100%">
</picture>

###  [Repositório Backend 🖥️](https://github.com/jrmsrs/ticket.io-server-pi2) | [Repositório Frontend 💻](https://github.com/jrmsrs/ticket.io-client-pi2)

Aplicação web com soluções de gerenciamento de problemas voltados para desenvolvedores divididos em grupos solucionadores

## 👥 Grupo
Arlindo Soares, Clara Thais, Daniel Pareschi, Mariana Duarte

## 🌎 Deploy
[https://ticket-io.vercel.app](https://ticket-io.vercel.app)

## ❓ Guia

### ⚙️ Pré-requisito
- [Node.js](https://nodejs.org/pt-br/) instalado
- [Yarn](https://yarnpkg.com/) instalado
- fork [Ticket.io-Server](https://github.com/jrmsrs/ticket.io-server-pi2) rodando
- Autenticação e Realtime DataBase do [Google Firebase](http://firebase.google.com/) 

### 🔽 Instalação

`yarn install`

crie um `.env` e altere as variáveis de ambiente
`cp .env.template .env`

```
# Host do ticket.io-server-pi2
VITE_SERVER=

# Credenciais do Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Endpoint do Realtime Database com todas as permissões
VITE_RTDB_ENDPOINT=
```

### 🚀 Rodar o projeto

`yarn dev`
