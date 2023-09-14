import { Request, Response } from 'express'
import { ObjectId } from 'mongodb';

import connect from '../db';

async function getAll(_: Request, res: Response) {
  try {
    const db = await connect();
    const results = await db?.collection('tasks').find().toArray();
    res.json(results);
  } catch (ex) {
    throw ex;
  }
}

async function createTask(req: Request, res: Response) {
  try {
    const db = await connect();
    const task = {
      ...req.body,
      completed: false,
    };
    const results = await db?.collection('tasks').insertOne(task);
    res.json({
      _id: results?.insertedId,
      ...task
    });
  } catch (ex) {
    throw ex;
  }
}

async function updateTask(req: Request, res: Response) {
  try {
    const { taskId } = req.params;
    const db = await connect();
    const taskData = req.body;
    const results = await db?.collection('tasks').findOneAndUpdate({ _id: new ObjectId(taskId) }, {
      $set: {
        ...taskData
      },
    }, { returnDocument: 'after', });
    res.json(results);
  } catch (ex) {
    throw ex;
  }
}

async function deleteTask(req: Request, res: Response) {
  try {
    const { taskId } = req.params;
    const db = await connect();
    const results = await db?.collection('tasks').findOneAndDelete({ _id: new ObjectId(taskId) });
    res.json(results);
  } catch (ex) {
    throw ex;
  }
}

export default {
  getAll,
  createTask,
  updateTask,
  deleteTask,
}