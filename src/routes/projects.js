import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { createProject, getProjects, updateProject, deleteProject } from '../controllers/projectController.js';

const router = Router();
router.use(auth);

router.post('/', createProject);
router.get('/', getProjects);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;