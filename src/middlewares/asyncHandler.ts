import { Request, Response, NextFunction, RequestHandler } from 'express';

// tipo del controller async que envolvemos, sin esto express no sabe que puede devolver una promesa
type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<void>;

// envuelve un controller async y manda cualquier error que tire (o que rechace la promesa) al next(), asi no hay que poner try/catch en cada uno
export function asyncHandler(controller: AsyncController): RequestHandler {
  return (req, res, next) => {
    controller(req, res, next).catch(next);
  };
}
