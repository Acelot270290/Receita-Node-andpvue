# Sistema de Receitas - RG Sistemas

Este projeto é uma API RESTful para gerenciamento de receitas culinárias com autenticação JWT.

## 🚀 Tecnologias

- Node.js (Express)
- TypeORM (MySQL)
- Swagger (Documentação)
- Docker / Docker Compose

---

## ⚙️ Requisitos

- Docker
- Docker Compose
- MySQL Client (opcional, para visualização)

## 📦 Como subir o projeto

```bash
# Subir o ambiente completo
docker-compose up --build
```

A aplicação será exposta em: [http://localhost:3000](http://localhost:3000)  
Swagger disponível em: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)  
Vue disponível em: [http://localhost:8080](http://localhost:8080)

---

## 🛠️ Configuração `.env`

```env
# --- Banco de Dados ---
DB_HOST=localhost
DB_PORT=3306
DB_USER=app_user
DB_PASSWORD=userpass
DB_NAME=teste_receitas_rg_sistemas

# --- App ---
JWT_SECRET=sua_chave_secreta_aqui
NODE_ENV=development
```

---

## 🗄️ Banco de Dados

1. Após subir o ambiente com `docker-compose up`, conecte-se ao banco MySQL via seu editor (ex: DBeaver) na porta correta.
2. Execute o script localizado em `./sql/schema.sql` para criar as tabelas:

   - `usuarios`
   - `categorias`
   - `receitas`

3. Os dados iniciais de categorias também estão inclusos no script.

---

## ✅ Rotas principais

- `POST /api/auth/login` → Login com JWT
- `GET /api/receitas` → Lista todas as receitas do usuário autenticado
- `POST /api/receitas` → Cria nova receita
- `GET /api/receitas/{id}` → Busca por ID
- `PUT /api/receitas/{id}` → Atualiza receita
- `DELETE /api/receitas/{id}` → Remove receita
- `GET /api/receitas/count` → Conta total do usuário autenticado
- `GET /api/categorias` → Lista categorias

---

## 🧪 Teste rápido com curl

```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{ "login": "acelot", "senha": "suasenha" }'
```

---

## 🔒 Segurança

- JWT protegido por middleware `checkJwt`
- Apenas o usuário autenticado pode alterar/remover suas receitas

---

## 📄 Licença

MIT © RG Sistemas