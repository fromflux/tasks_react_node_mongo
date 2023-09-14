import express from 'express';
import Pino from 'pino-http';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();

import tasksRoutes from './tasks/tasks.routes';

const app = express();

const pinoLogger = Pino();
app.use(pinoLogger);

app.use(helmet());
app.use(cors());
app.use(express.json());

const router = express.Router();

app.use('/tasks', tasksRoutes);

router.use('*', (req, res) => {
  res.status(404);
  res.send('NOT FOUND\n');
});

export default app;