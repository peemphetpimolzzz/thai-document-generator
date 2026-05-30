import { closeBrowser } from './renderer/browser';
import { createServer } from './server';

const port = Number(process.env.PORT ?? 8080);
const server = createServer().listen(port, () => {
  console.log(`[info] thai-document-generator listening on port ${port}`);
});

async function shutdown(): Promise<void> {
  server.close();
  await closeBrowser();
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
