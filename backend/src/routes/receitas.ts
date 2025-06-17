import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Recipe } from '../entities/Recipe';
import { checkJwt, AuthenticatedRequest } from '../middlewares/checkJwt';
import { StatusCodes } from 'http-status-codes';

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     RecipeInput:
 *       type: object
 *       required:
 *         - nome
 *         - modo_preparo
 *         - ingredientes
 *         - categoriaId
 *       properties:
 *         nome:
 *           type: string
 *           example: Bolo de Fubá Cremoso da Vovó
 *         tempo_preparo:
 *           type: integer
 *           example: 50
 *         porcoes:
 *           type: integer
 *           example: 10
 *         modo_preparo:
 *           type: string
 *           example: >
 *             1. No liquidificador, bata os ovos, o açúcar, o fubá, a farinha, o leite, a manteiga e o queijo parmesão.
 *             2. Por último, adicione o fermento e misture delicadamente.
 *             3. Despeje em uma forma untada e enfarinhada.
 *             4. Leve ao forno médio (180° C) por cerca de 40 minutos.
 *         ingredientes:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - 4 ovos
 *             - 2 xícaras de açúcar
 *             - 1 xícara de fubá
 *             - 1 litro de leite
 *         categoriaId:
 *           type: integer
 *           example: 1
 */

// =================================================================
// 1. CREATE (POST /)
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
 *             $ref: '#/components/schemas/RecipeInput'
 *     responses:
 *       201:
 *         description: Receita criada com sucesso.
 */
router.post('/', checkJwt, async (req: AuthenticatedRequest, res) => {
  const { nome, tempo_preparo, porcoes, modo_preparo, ingredientes, categoriaId } = req.body;

  if (!nome || !modo_preparo || !ingredientes || !Array.isArray(ingredientes) || ingredientes.length === 0 || !categoriaId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Nome, modo de preparo, ingredientes e o ID da categoria são obrigatórios.',
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
    const responseRecipe = { ...newRecipe, ingredientes: JSON.parse(newRecipe.ingredientes) };
    return res.status(StatusCodes.CREATED).json(responseRecipe);
  } catch (error) {
    console.error("Erro ao salvar receita:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Ocorreu um erro ao tentar criar a receita.',
    });
  }
});

// =================================================================
// 2. READ (GET /, GET /:id, GET /count)
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
      relations: ['category'],
      order: { criado_em: 'DESC' },
    });

    const formattedRecipes = recipes.map((r) => ({
      ...r,
      ingredientes: JSON.parse(r.ingredientes),
    }));

    return res.status(StatusCodes.OK).json(formattedRecipes);
  } catch (error) {
    console.error("Erro ao listar receitas:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Erro ao buscar receitas.',
    });
  }
});

/**
 * @openapi
 * /api/receitas/count:
 *   get:
 *     summary: Retorna o total de receitas do usuário autenticado
 *     tags: [Receitas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contagem de receitas retornada com sucesso.
 */
router.get('/count', checkJwt, async (req: AuthenticatedRequest, res) => {
  const recipeRepository = AppDataSource.getRepository(Recipe);
  try {
    const count = await recipeRepository.count({
      where: { user: { id: req.user!.userId } },
    });
    return res.status(StatusCodes.OK).json({ count });
  } catch (error) {
    console.error('Erro ao contar receitas:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Erro ao contar receitas.',
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
      relations: ['category'],
    });

    if (!recipe) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Receita não encontrada ou não pertence a você.',
      });
    }

    const responseRecipe = {
      ...recipe,
      ingredientes: JSON.parse(recipe.ingredientes),
    };

    return res.status(StatusCodes.OK).json(responseRecipe);
  } catch (error) {
    console.error("Erro ao buscar receita por ID:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Erro ao buscar a receita.',
    });
  }
});

// =================================================================
// 3. UPDATE (PUT /:id)
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
 *             $ref: '#/components/schemas/RecipeInput'
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
    const recipe = await recipeRepository.findOne({
      where: { id: recipeId, user: { id: userId } },
      relations: ['category'],
    });

    if (!recipe) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Receita não encontrada ou você não tem permissão para editá-la.',
      });
    }

    if (dataToUpdate.ingredientes && Array.isArray(dataToUpdate.ingredientes)) {
      dataToUpdate.ingredientes = JSON.stringify(dataToUpdate.ingredientes);
    }

    recipeRepository.merge(recipe, dataToUpdate);

    // 👇 Atualiza o relacionamento com a nova categoria, se enviada
    if (dataToUpdate.categoriaId) {
      recipe.category = { id: dataToUpdate.categoriaId } as any;
    }

    const updatedRecipe = await recipeRepository.save(recipe);

    const responseRecipe = {
      ...updatedRecipe,
      ingredientes: JSON.parse(updatedRecipe.ingredientes),
    };

    return res.status(StatusCodes.OK).json(responseRecipe);
  } catch (error) {
    console.error("Erro ao atualizar receita:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Erro ao atualizar a receita.',
    });
  }
});


// =================================================================
// 5. DELETE (DELETE /:id)
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
      user: { id: userId },
    });

    if (!recipe) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Receita não encontrada ou você não tem permissão para excluí-la.',
      });
    }

    await recipeRepository.remove(recipe);
    return res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error("Erro ao excluir receita:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Erro ao excluir a receita.',
    });
  }
});

export default router;
