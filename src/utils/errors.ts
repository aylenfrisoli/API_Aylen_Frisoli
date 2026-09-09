// clase base para errores que ya saben que status http les corresponde, asi el error handler no tiene que adivinar
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// se usa cuando se busca algo por id (una tarea, etc) y no existe
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

// se usa cuando el recurso existe pero no le pertenece a quien lo pide
export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403);
  }
}

// se usa cuando los datos que mandaron no pasan las validaciones (ej: zod)
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
