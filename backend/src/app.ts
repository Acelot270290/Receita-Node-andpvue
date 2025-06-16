import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { StatusCodes } from 'http-status-codes';
import mainRoutes from './routes/index';
import authRoutes from './routes/auth';
import recipeRoutes from './routes/receitas';
import categoryRoutes from './routes/categorias'; // 1. IMPORTA A NOVA ROTA

// Crie a instância do Express
const app = express();

// Configurações básicas do Express
app.use(cors());
app.use(express.json());

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Recipe App API',
      version: '1.0.0',
      description: 'API para autenticação e gerenciamento de receitas',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Servidor Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            login: { type: 'string', example: 'acelot' },
            nome: { type: 'string', example: 'Alan Diniz' },
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 4 },
            nome: { type: 'string', example: 'Bolos e tortas doces' },
          }
        },
        // ✅ Schema da Receita CORRIGIDO para bater com a entidade
        Recipe: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 101 },
            nome: { type: 'string', example: 'Bolo de Fubá da Vovó' },
            ingredientes: { type: 'array', items: { type: 'string' }, example: ["3 ovos", "1 xícara de leite"] },
            modo_preparo: { type: 'string', example: "1. Misture os ingredientes secos..." },
            tempo_preparo: { type: 'integer', example: 50 },
            porcoes: { type: 'integer', example: 8 },
            criado_em: { type: 'string', format: 'date-time' },
            alterado_em: { type: 'string', format: 'date-time' },
            user: { $ref: '#/components/schemas/User' },
            category: { $ref: '#/components/schemas/Category' },
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: [
    './src/routes/*.ts',    // Durante desenvolvimento
    './dist/routes/*.js'    // Em produção
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Rota para a documentação Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ROTAS DA APLICAÇÃO (ORDEM CORRETA)
app.use('/api/auth', authRoutes);
app.use('/api/receitas', recipeRoutes);
app.use('/api/categorias', categoryRoutes); // 2. ADICIONA O USO DA ROTA DE CATEGORIAS
app.use('/api', mainRoutes); // A rota mais geral vem por último


// Middlewares de erro (devem vir depois das rotas)
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ error: 'Endpoint não encontrado' });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno' });
});

export default app;
