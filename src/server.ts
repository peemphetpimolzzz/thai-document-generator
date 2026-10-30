import fs from 'node:fs';
import path from 'node:path';
import express, { Express } from 'express';
import { errorHandler } from './errors';
import { getBrowser } from './renderer/browser';
import { documentsRouter } from './routes/documents';

function resolveStaticDir(): string {
  const candidates = [
    path.join(__dirname, 'public'),
    path.resolve(process.cwd(), 'src/public'),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) {
      return dir;
    }
  }
  return candidates[0];
}

export function createServer(): Express {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  const staticDir = resolveStaticDir();
  const fontsDir = process.env.FONT_DIR ?? path.resolve(process.cwd(), 'fonts');
  app.use('/fonts', express.static(fontsDir));
  app.use(express.static(staticDir));

  const healthHandler = (_req: express.Request, res: express.Response): void => {
    res.json({ status: 'ok' });
  };
  app.get('/health', healthHandler);
  app.get('/api/health', healthHandler);

  const readyHandler = async (_req: express.Request, res: express.Response): Promise<void> => {
    try {
      await getBrowser();
      res.json({ status: 'ready' });
    } catch {
      res.status(503).json({ status: 'unavailable' });
    }
  };
  app.get('/ready', readyHandler);
  app.get('/api/ready', readyHandler);

  app.use('/documents', documentsRouter);
  app.use('/api/documents', documentsRouter);
  app.use(errorHandler);
  return app;
}
