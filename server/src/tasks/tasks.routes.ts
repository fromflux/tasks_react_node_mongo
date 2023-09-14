import express from 'express';

import handlers from './tasks.handlers';

const router = express.Router();

router.route('/')
  .get(handlers.getAll);

router.route('/')
  .post(handlers.createTask);

router.route('/:taskId')
  .put(handlers.updateTask);

router.route('/:taskId')
  .delete(handlers.deleteTask);

export default router;