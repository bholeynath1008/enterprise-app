/// <reference types="cypress" />

/**
 * Custom Cypress commands following App Actions pattern.
 * These programmatically drive the app state rather than navigating the UI
 * for every test — faster and more reliable.
 */

// ---- Login commands ----

Cypress.Commands.add('loginAsSuperAdmin', () => {
  cy.loginAs(Cypress.env('credentials').superAdmin);
});

Cypress.Commands.add('loginAsStaff', () => {
  cy.loginAs(Cypress.env('credentials').staff);
});

Cypress.Commands.add('loginAsOwner', () => {
  cy.loginAs(Cypress.env('credentials').owner);
});

Cypress.Commands.add('loginAsManager', () => {
  cy.loginAs(Cypress.env('credentials').manager);
});

/**
 * Login via API (not through UI) — fast App Action approach.
 * Sets localStorage token so the app recognises the session.
 */
Cypress.Commands.add('loginAs', ({ email, password }) => {
  cy.request('POST', `${Cypress.env('apiUrl')}/api/auth/login`, { email, password })
    .then(resp => {
      expect(resp.status).to.eq(200);
      const { token, user } = resp.body;
      window.localStorage.setItem('fms_token', token);
      window.localStorage.setItem('fms_user', JSON.stringify(user));
    });
});

/**
 * Logout helper — clears localStorage and navigates to login.
 */
Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('fms_token');
  window.localStorage.removeItem('fms_user');
  cy.visit('/login');
});

/**
 * Assert that the correct role dashboard is visible.
 */
Cypress.Commands.add('assertRoleDashboardVisible', (role: string) => {
  cy.visit('/dashboard');
  cy.get('[data-testid="main-content"], main').should('exist');

  switch (role) {
    case 'super_admin':
      cy.contains('Total Sales YTD', { timeout: 6000 }).should('be.visible');
      break;
    case 'franchisor_staff':
      cy.contains('Open Tickets', { timeout: 6000 }).should('be.visible');
      break;
    case 'franchisee_owner':
      cy.contains('Monthly Sales', { timeout: 6000 }).should('be.visible');
      break;
    case 'location_manager':
      cy.contains('Daily Checklist', { timeout: 6000 }).should('be.visible');
      break;
  }
});

/**
 * Navigate to a route and wait for content to load.
 */
Cypress.Commands.add('navigateTo', (path: string) => {
  cy.visit(path);
  cy.get('main').should('exist');
  cy.get('.animate-pulse').should('not.exist'); // wait for skeletons to clear
});

// ---- TypeScript declarations ----
declare global {
  namespace Cypress {
    interface Chainable {
      loginAsSuperAdmin(): Chainable<void>;
      loginAsStaff(): Chainable<void>;
      loginAsOwner(): Chainable<void>;
      loginAsManager(): Chainable<void>;
      loginAs(creds: { email: string; password: string }): Chainable<void>;
      logout(): Chainable<void>;
      assertRoleDashboardVisible(role: string): Chainable<void>;
      navigateTo(path: string): Chainable<void>;
    }
  }
}
