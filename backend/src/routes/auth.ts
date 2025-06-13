import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';       
import jwt from 'jsonwebtoken';                 

const router = Router();

// Endpoint de registro de usuário
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - senha
 *             properties:
 *               login:
 *                 type: string
 *                 description: Nome de usuário ou email para login.
 *               senha:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário (mínimo 6 caracteres).
 *               nome:
 *                 type: string
 *                 description: Nome completo do usuário (opcional).
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário registrado com sucesso.
 *                 userId:
 *                   type: number
 *                   example: 1
 *       400:
 *         description: Dados inválidos ou login já registrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/register', async (req: Request, res: Response) => {
  const { login, senha, nome } = req.body;

  if (!login || !senha || senha.length < 6) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      message: 'Login e senha são obrigatórios. A senha deve ter no mínimo 6 caracteres.' 
    });
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOneBy({ login });
    
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({ 
        message: 'Este login já está registrado.' 
      });
    }

    const newUser = new User();
    newUser.login = login;
    newUser.senha = senha;
    
    if (nome) {
      newUser.nome = nome;
    }

    await userRepository.save(newUser);

    return res.status(StatusCodes.CREATED).json({ 
      message: 'Usuário registrado com sucesso.', 
      userId: newUser.id 
    });

  } catch (error: unknown) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: 'Erro interno do servidor ao registrar usuário.' 
    });
  }
});

// Endpoint de login de usuário
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - senha
 *             properties:
 *               login:
 *                 type: string
 *                 description: Nome de usuário ou email para login.
 *               senha:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário.
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login bem-sucedido.
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Credenciais inválidas.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/login', async (req: Request, res: Response) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      message: 'Login e senha são obrigatórios.' 
    });
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ login });

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ 
        message: 'Credenciais inválidas.' 
      });
    }

    const isPasswordValid = await user.comparePassword(senha);

    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ 
        message: 'Credenciais inválidas.' 
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET não está definido nas variáveis de ambiente!');
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
        message: 'Configuração do servidor inválida (JWT secret ausente).' 
      });
    }

    const token = jwt.sign(
      { userId: user.id, login: user.login }, 
      jwtSecret, 
      { expiresIn: '1h' }
    ); 

    return res.status(StatusCodes.OK).json({ 
      message: 'Login bem-sucedido.', 
      token 
    });

  } catch (error: unknown) {
    console.error('Erro ao fazer login:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: 'Erro interno do servidor ao fazer login.' 
    });
  }
});

export default router;