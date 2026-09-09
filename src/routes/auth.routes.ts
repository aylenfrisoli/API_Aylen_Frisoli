import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { register, login } from '../controllers/auth.controller';

const router = Router();

// se montan bajo /users en index.ts, asi quedan como POST /users/register y POST /users/login
// el validate() valida el body ANTES de llegar al controller, asi el service ya recibe datos tipados (mismo patron que tarea.routes.ts)
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;
