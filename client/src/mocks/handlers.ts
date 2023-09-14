/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import { rest } from 'msw';

import TASKS_MOCK from './TASKS_MOCK.json';

export const handlers = [
  rest.get('/api/tasks', (req, res, ctx) => res(
    ctx.delay(),
    ctx.status(200),
    ctx.json(TASKS_MOCK),
  )),

  rest.post('/api/tasks', async (req, res, ctx) => {
    const taskData = await req.json();

    return res(
      ctx.delay(),
      ctx.status(201),
      ctx.json({
        _id: Date.now(),
        ...taskData,
      }),
    );
  }),

  rest.put('/api/tasks/:taskId', async (req, res, ctx) => {
    const { taskId } = req.params;
    const taskData = await req.json();

    return res(
      ctx.delay(),
      ctx.status(201),
      ctx.json({
        _id: taskId,
        ...taskData,
      }),
    );
  }),

  rest.delete('/api/tasks/:taskId', async (req, res, ctx) => {
    const { taskId } = req.params;
    const taskData = TASKS_MOCK.filter((task) => task._id === taskId);

    return res(
      ctx.delay(),
      ctx.status(201),
      ctx.json({
        _id: taskId,
        ...taskData,
      }),
    );
  }),

];
