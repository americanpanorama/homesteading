import { defineConfig, devices } from '@playwright/test';

const port = process.env.PLAYWRIGHT_PORT || '9000';
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    [process.env.CI ? 'line' : 'list'],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop-chromium',
      testMatch: 'desktop.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 900 },
      },
    },
    {
      name: 'mobile-chromium',
      testMatch: 'mobile.spec.ts',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: `npx webpack serve --config webpack.dev.js --mode development --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
