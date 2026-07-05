import { Router } from 'express';
import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
} from '../controllers/todoController.js';
import { validate, todoSchema } from '../middlewares/validateMiddleware.js';

const router = Router();

router.route('/')
  .get(getTodos)
  .post(validate(todoSchema), createTodo);

router.route('/:id')
  .get(getTodo)
  .put(validate(todoSchema), updateTodo)
  .delete(deleteTodo);

router.patch('/:id/toggle', toggleTodo);

export default router;
