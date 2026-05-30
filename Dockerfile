FROM node:22-bookworm-slim

# System Chromium + its runtime libraries, plus Thai system fonts as a safety net.
# Using the distro Chromium (rather than a Puppeteer-downloaded build) keeps the image
# self-contained and decoupled from the puppeteer package's bundled browser version.
RUN apt-get update && apt-get install -y --no-install-recommends \
      chromium \
      fonts-thai-tlwg fontconfig \
      libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 \
      libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 \
      libpango-1.0-0 libcairo2 \
      ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json vitest.config.ts ./
COPY src/ src/
COPY tests/ tests/
COPY samples/ samples/
COPY fonts/ fonts/

# Register the bundled Sarabun font with fontconfig as well (the templates load it directly
# via @font-face, this is belt-and-suspenders).
RUN cp fonts/*.ttf /usr/share/fonts/truetype/ 2>/dev/null || true; fc-cache -f

RUN npm run build && chown -R node:node /app

USER node
ENV NODE_ENV=production PORT=8080 FONT_DIR=/app/fonts
EXPOSE 8080
CMD ["node", "dist/index.js"]
