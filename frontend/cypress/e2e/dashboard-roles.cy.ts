/// <reference types="cypress" />

describe('Role-Based Dashboard Visibility', () => {
  context('Super Admin dashboard', () => {
    beforeEach(() => {
      cy.loginAsSuperAdmin();
      cy.visit('/dashboard');
    });

    it('shows all 5 stat cards', () => {
      cy.contains('Total Sales YTD').should('be.visible');
      cy.contains('Royalties Collected').should('be.visible');
      cy.contains('Overdue Royalties').should('be.visible');
      cy.contains('Open Tickets').should('be.visible');
      cy.contains('Pending Tasks').should('be.visible');
    });

    it('shows performance leaderboard', () => {
      cy.contains('Performance Leaderboard').should('be.visible');
    });

    it('shows recent activity feed', () => {
      cy.contains('Recent Activity').should('be.visible');
    });

    it('sidebar shows all management nav items', () => {
      cy.contains('Franchisees').should('be.visible');
      cy.contains('Users').should('be.visible');
      cy.contains('Royalties').should('be.visible');
      cy.contains('Analytics').should('be.visible');
    });
  });

  context('Franchisor Staff dashboard', () => {
    beforeEach(() => {
      cy.loginAsStaff();
      cy.visit('/dashboard');
    });

    it('shows support-focused stats', () => {
      cy.contains('Open Tickets').should('be.visible');
    });

    it('does NOT show Users in sidebar', () => {
      cy.get('nav').contains('Users').should('not.exist');
    });

    it('shows compliance leaderboard chart', () => {
      cy.contains('Leaderboard').should('be.visible');
    });
  });

  context('Franchisee Owner dashboard', () => {
    beforeEach(() => {
      cy.loginAsOwner();
      cy.visit('/dashboard');
    });

    it('shows own franchise banner', () => {
      cy.contains('Pizza Palace Group').should('be.visible');
    });

    it('shows monthly sales stat', () => {
      cy.contains('Monthly Sales').should('be.visible');
    });

    it('does NOT show Analytics in sidebar', () => {
      cy.get('nav').contains('Analytics').should('not.exist');
    });

    it('does NOT show Users in sidebar', () => {
      cy.get('nav').contains('Users').should('not.exist');
    });

    it('shows compliance score', () => {
      cy.contains('Compliance Score').should('be.visible');
    });
  });

  context('Location Manager dashboard', () => {
    beforeEach(() => {
      cy.loginAsManager();
      cy.visit('/dashboard');
    });

    it('shows daily checklist', () => {
      cy.contains('Daily Checklist').should('be.visible');
    });

    it('shows location banner with location name', () => {
      cy.contains('Pizza Palace').should('be.visible');
    });

    it('does NOT show Royalties in sidebar', () => {
      cy.get('nav').contains('Royalties').should('not.exist');
    });

    it('does NOT show Franchisees in sidebar', () => {
      cy.get('nav').contains('Franchisees').should('not.exist');
    });
  });
});

describe('Permission-Based Route Guards', () => {
  it('403 shown when owner tries to access /analytics', () => {
    cy.loginAsOwner();
    cy.visit('/analytics');
    cy.contains('403').should('be.visible');
    cy.contains('Access Denied').should('be.visible');
  });

  it('403 shown when manager tries to access /users', () => {
    cy.loginAsManager();
    cy.visit('/users');
    cy.contains('403').should('be.visible');
  });

  it('403 shown when manager tries to access /royalties', () => {
    cy.loginAsManager();
    cy.visit('/royalties');
    cy.contains('403').should('be.visible');
  });

  it('super admin can access /users', () => {
    cy.loginAsSuperAdmin();
    cy.visit('/users');
    cy.contains('403').should('not.exist');
    cy.url().should('include', '/users');
  });
});
