import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Category } from '../entities/Category';
import { StatusCodes } from 'http-status-codes';
import { checkJwt } from '../middlewares/checkJwt';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Categorias
 *     description: Endpoints relacionados às categorias disponíveis
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: Sobremesas
 */

/**
 * @openapi
 * /api/categorias:
 *   get:
 *     summary: Lista todas as categorias existentes
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 *       500:
 *         description: Erro ao buscar categorias
 */
router.get('/', checkJwt, async (req, res) => {
  const categoryRepository = AppDataSource.getRepository(Category);
  try {
    const categories = await categoryRepository.find({ order: { nome: 'ASC' } });
    return res.status(StatusCodes.OK).json(categories);
  } catch (error) {
    console.error("Erro ao listar categorias:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao buscar categorias.' });
  }
});

/**
 * @openapi
 * /api/categorias/count:
 *   get:
 *     summary: Retorna o total de categorias existentes
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contagem retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 5
 *       500:
 *         description: Erro ao contar categorias
 */
router.get('/count', checkJwt, async (req, res) => {
  const categoryRepository = AppDataSource.getRepository(Category);
  try {
    const count = await categoryRepository.count();
    return res.status(StatusCodes.OK).json({ count });
  } catch (error) {
    console.error('Erro ao contar categorias:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao contar categorias.' });
  }
});

export default router;
