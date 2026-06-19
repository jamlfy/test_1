import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/AppError.js';
import { HttpCode } from '../shared/errors/HttpCode.js';

export const authorize = (...allowedRoles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new AppError(HttpCode.FORBIDDEN, 'No tienes permisos para esta acción');
    }
    next();
  };
