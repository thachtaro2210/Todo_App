import { Router } from 'express';
import todoRoutes from './todoRoutes.js';

const router = Router();

router.use('/todos', todoRoutes);

export default router;
