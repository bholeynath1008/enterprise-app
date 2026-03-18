/// <reference types="cypress" />

describe('Authentication — Login & Logout', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  context('Login page renders correctly', () => {
    it('shows brand name and login form', () => {
      cy.visit('/login');
      cy.contains('Franchise Management System').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.contains('button', /sign in to fms/i).should('be.visible');
    });

    it('shows demo account quick-login buttons', () => {
      cy.visit('/login');
      cy.contains('Super Admin').should('be.visible');
      cy.contains('Franchisor Staff').should('be.visible');
      cy.contains('Franchisee Owner').should('be.visible');
      cy.contains('Location Manager').should('be.visible');
    });

    it('shows SSO button (disabled)', () => {
      cy.visit('/login');
      cy.contains(/sign in with sso/i).should('be.visible').and('be.disabled');
    });
  });

  context('Form validation', () => {
    it('shows error on invalid email', () => {
      cy.visit('/login');
      cy.get('input[type="email"]').type('not-an-email');
      cy.get('input[type="password"]').type('pass');
      cy.contains('button', /sign in/i).first().click();
      cy.contains(/invalid email/i).should('be.visible');
    });

    it('shows error on wrong credentials', () => {
      cy.intercept('POST', '**/api/auth/login', { statusCode: 401, body: { error: 'Invalid credentials' } }).as('loginFail');
      cy.visit('/login');
      cy.get('input[type="email"]').type('wrong@email.com');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.contains('button', /sign in to fms/i).click();
      cy.wait('@loginFail');
      cy.contains(/invalid email or password/i).should('be.visible');
    });
  });

  context('Successful login per role', () => {
    const roles = [
      { name: 'Super Admin', email: 'admin@fms.com', password: 'admin123', expectText: 'Total Sales YTD' },
      { name: 'HQ Staff', email: 'ops@fms.com', password: 'ops123', expectText: 'Open Tickets' },
      { name: 'Franchisee Owner', email: 'owner1@pizzapalace.com', password: 'owner123', expectText: 'Monthly Sales' },
      { name: 'Location Manager', email: 'mgr1@pizzapalace.com', password: 'mgr123', expectText: 'Daily Checklist' },
    ];

    roles.forEach(role => {
      it(`logs in as ${role.name} and sees correct dashboard`, () => {
        cy.visit('/login');
        cy.get('input[type="email"]').clear().type(role.email);
        cy.get('input[type="password"]').clear().type(role.password);
        cy.contains('button', /sign in to fms/i).click();
        cy.url().should('include', '/dashboard');
        cy.contains(role.expectText, { timeout: 8000 }).should('be.visible');
      });
    });
  });

  context('Logout', () => {
    it('logs out and redirects to login', () => {
      cy.loginAsSuperAdmin();
      cy.visit('/dashboard');
      cy.contains('Sign Out').click();
      cy.url().should('include', '/login');
      cy.get('input[type="email"]').should('be.visible');
    });

    it('cannot access protected route after logout', () => {
      cy.loginAsSuperAdmin();
      cy.visit('/dashboard');
      cy.logout();
      cy.visit('/dashboard');
      cy.url().should('include', '/login');
    });
  });

  context('Redirect behavior', () => {
    it('redirects authenticated user from /login to /dashboard', () => {
      cy.loginAsSuperAdmin();
      cy.visit('/login');
      cy.url().should('include', '/dashboard');
    });

    it('redirects unauthenticated from protected route to /login', () => {
      cy.visit('/franchisees');
      cy.url().should('include', '/login');
    });
  });
});
