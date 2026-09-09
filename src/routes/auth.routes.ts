import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router();

// se montan bajo /users en index.ts, asi quedan como POST /users/register y POST /users/login
router.post('/register', register);
router.post('/login', login);

export default router;
