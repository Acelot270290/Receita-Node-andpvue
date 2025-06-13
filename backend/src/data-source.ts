import 'reflect-metadata'; // Importante para que os decoradores do TypeORM funcionem
import { DataSource } from 'typeorm'; // Importa a classe DataSource do TypeORM
import dotenv from 'dotenv'; // Para carregar variáveis de ambiente de um arquivo .env

// Carrega as variáveis de ambiente.
// No ambiente Docker Compose, as variáveis definidas no docker-compose.yml têm prioridade
// e são injetadas no ambiente do contêiner. Se você rodar localmente sem Docker,
// este dotenv.config() carregaria do seu backend/.env.
dotenv.config();

// Exporta uma instância de DataSource que será usada para inicializar a conexão com o DB.
export const AppDataSource = new DataSource({
  type: 'mysql', // Define o tipo de banco de dados como MySQL
  host: process.env.DATABASE_HOST, // Lê o host do banco de dados das variáveis de ambiente
  // Converte a porta para número, com fallback para 3306 se não estiver definida
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  username: process.env.DATABASE_USERNAME, // Lê o usuário do banco de dados das variáveis de ambiente
  password: process.env.DATABASE_PASSWORD, // Lê a senha do banco de dados das variáveis de ambiente
  database: process.env.DATABASE_NAME,    // Lê o nome do banco de dados das variáveis de ambiente
  
  // 'synchronize: true' é útil em desenvolvimento para que o TypeORM crie o schema do DB
  // automaticamente com base nas suas entidades. EM PRODUÇÃO, ISSO DEVE SER 'false'
  // E VOCÊ DEVE USAR MIGRAÇÕES!
  synchronize: false, // Defina para 'true' em desenvolvimento para criar tabelas automaticamente
  logging: true,      // Habilita o log de queries SQL no console (útil para depuração)
  
  // Define os caminhos para suas entidades (modelos de dados).
  // O TypeORM irá procurar arquivos JS nesta pasta após a compilação do TypeScript.
  entities: [
    'src/entities/**/*.ts',
    './dist/entities/**/*.js', // Exemplo: './src/entities/**/*.ts' antes da compilação
  ],
  
  // Define os caminhos para suas migrações (mudanças no schema do DB ao longo do tempo).
  // Migrações são essenciais para gerenciar o DB em produção.
  migrations: [
    'src/migrations/**/*.ts',
    './dist/migrations/**/*.js', // Exemplo: './src/migrations/**/*.ts' antes da compilação
  ],
  
  // Subscrevers são usados para executar código em eventos do TypeORM (inserção, atualização, etc.)
  subscribers: [],
});
