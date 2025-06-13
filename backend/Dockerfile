    FROM node:18-alpine

    WORKDIR /app

    # Copia apenas os arquivos de dependência para cachear a instalação
    COPY package.json tsconfig.json ./

    # Instala todas as dependências
    RUN npm install

    # O comando de inicialização será sobrescrito pelo docker-compose,
    # mas é bom ter um CMD padrão
    CMD ["npm", "run", "dev"]
    