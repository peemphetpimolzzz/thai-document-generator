import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

/** Central error handler: invalid request bodies become 400s; everything else a 500. */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'ValidationError', issues: err.issues });
    return;
  }
  console.error('[error]', err);
  res.status(500).json({ error: 'ServerError', message: 'Failed to render the document.' });
};
