import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Category } from '../entities/Category';
import { StatusCodes } from 'http-status-codes';
import { checkJwt } from '../middlewares/checkJwt';

const router = Router();

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
 */
router.get('/', checkJwt, async (req, res) => {
    const categoryRepository = AppDataSource.getRepository(Category);
    try {
        // Busca todas as categorias e ordena por nome
        const categories = await categoryRepository.find({ order: { nome: "ASC" } });
        return res.status(StatusCodes.OK).json(categories);
    } catch (error) {
        console.error("Erro ao listar categorias:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao buscar categorias.' });
    }
});

export default router;