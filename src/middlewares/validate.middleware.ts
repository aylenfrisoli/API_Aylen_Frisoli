import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';

// devuelve un middleware que valida req.body contra el schema que le pasen, asi no hay que repetir el parse en cada controller
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      // formateamos los issues de zod en un solo mensaje legible para el error centralizado
      const mensaje = resultado.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ');
      next(new ValidationError(mensaje));
      return;
    }

    // pisamos el body con la version ya parseada (con los defaults aplicados) para que el controller la use directo
    req.body = resultado.data;
    next();
  };
}
