import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController.js';

const router = Router();
// router.use(auth);

router.post('/:projectId', createTask);
router.get('/:projectId', getTasks);
router.put('/:projectId/:id', updateTask);
router.delete('/:projectId/:id', deleteTask);

export default router;