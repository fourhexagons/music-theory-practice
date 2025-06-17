FROM mcr.microsoft.com/devcontainers/javascript-node:18

# Install additional OS packages
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    # Required for Playwright
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Install Playwright browsers
RUN npx playwright install --with-deps chromium

# Set up non-root user
USER node 