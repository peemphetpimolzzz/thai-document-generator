import express, { Express } from 'express';
import { errorHandler } from './errors';
import { getBrowser } from './renderer/browser';
import { documentsRouter } from './routes/documents';

export function createServer(): Express {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/ready', async (_req, res) => {
    try {
      await getBrowser();
      res.json({ status: 'ready' });
    } catch {
      res.status(503).json({ status: 'unavailable' });
    }
  });

  app.use('/documents', documentsRouter);
  app.use(errorHandler);
  return app;
}
