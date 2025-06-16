import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Recipe } from '../entities/Recipe';
import { checkJwt, AuthenticatedRequest } from '../middlewares/checkJwt';
import { StatusCodes } from 'http-status-codes';

const router = Router();

// =================================================================
// 1. CREATE (POST /) - Criar uma nova receita
// =================================================================
/**
 * @openapi
 * /api/receitas:
 *   post:
 *     summary: Cria uma nova receita
 *     tags: [Receitas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       201:
 *         description: Receita criada com sucesso.
 */
router.post('/', checkJwt, async (req: AuthenticatedRequest, res) => {
    const { nome, tempo_preparo, porcoes, modo_preparo, ingredientes, categoriaId } = req.body;
    
    if (!nome || !modo_preparo || !ingredientes || !Array.isArray(ingredientes) || 
        ingredientes.length === 0 || !categoriaId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            message: 'Nome, modo de preparo, ingredientes e o ID da categoria são obrigatórios.' 
        });
    }

    const recipeRepository = AppDataSource.getRepository(Recipe);
    const newRecipe = new Recipe();
    
    newRecipe.nome = nome;
    newRecipe.tempo_preparo = tempo_preparo;
    newRecipe.porcoes = porcoes;
    newRecipe.modo_preparo = modo_preparo;
    newRecipe.ingredientes = JSON.stringify(ingredientes);
    newRecipe.user = { id: req.user!.userId } as any;
    newRecipe.category = { id: categoriaId } as any;

    try {
        await recipeRepository.save(newRecipe);
        const responseRecipe = { 
            ...newRecipe, 
            ingredientes: JSON.parse(newRecipe.ingredientes) 
        };
        return res.status(StatusCodes.CREATED).json(responseRecipe);
    } catch (error) {
        console.error("Erro ao salvar receita:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            message: 'Ocorreu um erro ao tentar criar a receita.' 
        });
    }
});

// =================================================================
// 2. READ (GET / e GET /:id) - Ler receitas
// =================================================================

/**
 * @openapi
 * /api/receitas:
 *   get:
 *     summary: Lista as receitas do usuário
 *     tags: [Receitas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de receitas retornada com sucesso.
 */
router.get('/', checkJwt, async (req: AuthenticatedRequest, res) => {
    const recipeRepository = AppDataSource.getRepository(Recipe);
    
    try {
        const recipes = await recipeRepository.find({
            where: { user: { id: req.user!.userId } },
            relations: ["category"],
            order: { criado_em: "DESC" }
        });
        
        const formattedRecipes = recipes.map(recipe => ({
            ...recipe, 
            ingredientes: JSON.parse(recipe.ingredientes) 
        }));
        
        return res.status(StatusCodes.OK).json(formattedRecipes);
    } catch (error) {
        console.error("Erro ao listar receitas:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            message: 'Erro ao buscar receitas.' 
        });
    }
});

/**
 * @openapi
 * /api/receitas/{id}:
 *   get:
 *     summary: Busca uma única receita pelo ID
 *     tags: [Receitas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados da receita retornados com sucesso.
 *       404:
 *         description: Receita não encontrada ou não pertence ao usuário.
 */
router.get('/:id', checkJwt, async (req: AuthenticatedRequest, res) => {
    const recipeId = parseInt(req.params.id);
    const userId = req.user!.userId;
    const recipeRepository = AppDataSource.getRepository(Recipe);

    try {
        const recipe = await recipeRepository.findOne({
            where: { id: recipeId, user: { id: userId } },
            relations: ["category"]
        });

        if (!recipe) {
            return res.status(StatusCodes.NOT_FOUND).json({ 
                message: 'Receita não encontrada ou não pertence a você.' 
            });
        }

        const responseRecipe = { 
            ...recipe, 
            ingredientes: JSON.parse(recipe.ingredientes) 
        };
        
        return res.status(StatusCodes.OK).json(responseRecipe);
    } catch (error) {
        console.error("Erro ao buscar receita por ID:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            message: 'Erro ao buscar a receita.' 
        });
    }
});

// =================================================================
// 3. UPDATE (PUT /:id) - Atualizar uma receita
// =================================================================

/**
 * @openapi
 * /api/receitas/{id}:
 *   put:
 *     summary: Atualiza uma receita existente
 *     tags: [Receitas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       200:
 *         description: Receita atualizada com sucesso.
 *       404:
 *         description: Receita não encontrada ou não pertence ao usuário.
 */
router.put('/:id', checkJwt, async (req: AuthenticatedRequest, res) => {
    const recipeId = parseInt(req.params.id);
    const userId = req.user!.userId;
    const dataToUpdate = req.body;
    const recipeRepository = AppDataSource.getRepository(Recipe);
    
    try {
        const recipe = await recipeRepository.findOneBy({ 
            id: recipeId, 
            user: { id: userId } 
        });
        
        if (!recipe) {
            return res.status(StatusCodes.NOT_FOUND).json({ 
                message: 'Receita não encontrada ou você não tem permissão para editá-la.' 
            });
        }
        
        if (dataToUpdate.ingredientes && Array.isArray(dataToUpdate.ingredientes)) {
            dataToUpdate.ingredientes = JSON.stringify(dataToUpdate.ingredientes);
        }
        
        recipeRepository.merge(recipe, dataToUpdate);
        const updatedRecipe = await recipeRepository.save(recipe);
        const responseRecipe = { 
            ...updatedRecipe, 
            ingredientes: JSON.parse(updatedRecipe.ingredientes) 
        };
        
        return res.status(StatusCodes.OK).json(responseRecipe);
    } catch (error) {
        console.error("Erro ao atualizar receita:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            message: 'Erro ao atualizar a receita.' 
        });
    }
});

// =================================================================
// 4. DELETE (DELETE /:id) - Excluir uma receita
// =================================================================

/**
 * @openapi
 * /api/receitas/{id}:
 *   delete:
 *     summary: Exclui uma receita
 *     tags: [Receitas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: integer
 *     responses:
 *       204:
 *         description: Receita excluída com sucesso.
 *       404:
 *         description: Receita não encontrada ou não pertence ao usuário.
 */
router.delete('/:id', checkJwt, async (req: AuthenticatedRequest, res) => {
    const recipeId = parseInt(req.params.id);
    const userId = req.user!.userId;
    const recipeRepository = AppDataSource.getRepository(Recipe);
    
    try {
        const recipe = await recipeRepository.findOneBy({ 
            id: recipeId, 
            user: { id: userId } 
        });
        
        if (!recipe) {
            return res.status(StatusCodes.NOT_FOUND).json({ 
                message: 'Receita não encontrada ou você não tem permissão para excluí-la.' 
            });
        }
        
        await recipeRepository.remove(recipe);
        return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        console.error("Erro ao excluir receita:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            message: 'Erro ao excluir a receita.' 
        });
    }
});

export default router;