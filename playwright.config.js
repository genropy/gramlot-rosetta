import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {baseURL: process.env.ROSETTA_URL || 'http://127.0.0.1:8026', headless: true},
  reporter: 'list',
});
