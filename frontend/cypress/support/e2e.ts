// Import custom commands
import './commands';

// Global before/after hooks
beforeEach(() => {
  // Clear localStorage before each test for a clean state
  cy.clearLocalStorage();
});

// Suppress known unhandled exceptions from React/Vite in dev mode
Cypress.on('uncaught:exception', (err) => {
  // Ignore ResizeObserver errors common in test environments
  if (err.message.includes('ResizeObserver')) return false;
  return true;
});
