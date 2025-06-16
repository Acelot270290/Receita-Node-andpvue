import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

// Interface para estender o objeto Request do Express e adicionar a propriedade 'user'
export interface AuthenticatedRequest extends Request {
  user?: { userId: number };
}

export const checkJwt = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Pega o token do cabeçalho de autorização
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token não fornecido.' });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Segredo JWT não configurado.' });
  }

  // Verifica se o token é válido
  jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
    if (err) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Token inválido ou expirado.' });
    }

    // Se o token for válido, anexa o payload decodificado (com o userId) à requisição
    req.user = decoded;
    next(); // Passa para o próximo middleware ou para a rota final
  });
};
