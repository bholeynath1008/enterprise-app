import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: true,
    screenshotOnRunFailure: true,
    retries: { runMode: 2, openMode: 0 },
    defaultCommandTimeout: 8000,
    requestTimeout: 10000,
    setupNodeEvents(on, config) {
      // You can add event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
  },
  env: {
    apiUrl: 'http://localhost:4000',
    credentials: {
      superAdmin: { email: 'admin@fms.com', password: 'admin123' },
      staff: { email: 'ops@fms.com', password: 'ops123' },
      owner: { email: 'owner1@pizzapalace.com', password: 'owner123' },
      manager: { email: 'mgr1@pizzapalace.com', password: 'mgr123' },
    },
  },
});
