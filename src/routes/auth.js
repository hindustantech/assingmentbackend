import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { seed } from '../seed.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/seed', async (req, res) => {
  try {
    await seed(); // Run your seed logic here
    res.status(200).json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Seeding failed', error: error.message });
  }
});

export default router;