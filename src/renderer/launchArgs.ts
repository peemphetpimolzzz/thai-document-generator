// Chromium runs inside the container, which is the trust boundary, and only ever renders
// our own templates — so the sandbox is disabled for portability across hosts.
// --disable-dev-shm-usage avoids crashes from a small /dev/shm (pair with shm_size in compose).
export const launchArgs = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
];
