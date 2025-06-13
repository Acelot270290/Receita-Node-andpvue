import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { StatusCodes } from 'http-status-codes';
import mainRoutes from './routes/index';
import authRoutes from './routes/auth';

// 1. Crie a instância do Express
const app = express();

// 2. Configurações básicas do Express
app.use(cors());
app.use(express.json());

// 3. Configuração do Swagger (deve vir antes das rotas)
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
            id: { type: 'integer' },
            login: { type: 'string' },
            nome: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/*.ts',    // Durante desenvolvimento
    './dist/routes/*.js'    // Em produção
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// 4. Rota para a documentação Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/api/auth', authRoutes);
app.use('/api', mainRoutes);


// 6. Middlewares de erro (devem vir depois das rotas)
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ error: 'Endpoint não encontrado' });
});

app.use((err: Error, req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno' });
});

export default app;