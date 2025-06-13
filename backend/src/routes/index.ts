import { Router, Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verifica o status da API
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API online e saudável
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: API online
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-06-12T13:48:10.339Z
 *                 environment:
 *                   type: string
 *                   example: development
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 */
router.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({
    status: 'API online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

/**
 * Middleware para rotas não encontradas
 */
router.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    error: 'Endpoint não encontrado',
    path: req.originalUrl,
    method: req.method
  });
});

/**
 * Middleware para tratamento de erros
 */
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: 'Erro interno no servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});
router.get('/test', (req, res) => {
  res.json({ ok: true });
});

export default router;
