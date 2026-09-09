import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTareaSchema, updateTareaSchema } from '../schemas/tarea.schema';
import { getAll, create, update, remove } from '../controllers/tarea.controller';

const router = Router();

// protege todas las rutas de tareas, ninguna se puede usar sin un token valido
router.use(verifyToken);

router.get('/', getAll);
router.post('/', validate(createTareaSchema), create);
router.put('/:id', validate(updateTareaSchema), update);
router.delete('/:id', remove);

export default router;
