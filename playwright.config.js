const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 90_000,
  use: {
    headless: false,
    viewport: { width: 430, height: 932 },
    video: 'on-first-retry',
  },
  reporter: 'list',
});
