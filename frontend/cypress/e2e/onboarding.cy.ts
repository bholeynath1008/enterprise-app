/// <reference types="cypress" />

describe('Onboarding Wizard — Franchisee Owner', () => {
  beforeEach(() => {
    cy.loginAsOwner();
  });

  it('is accessible from sidebar navigation', () => {
    cy.visit('/dashboard');
    cy.get('nav').contains('Onboarding').should('be.visible').click();
    cy.url().should('include', '/onboarding');
    cy.contains('Franchisee Onboarding').should('be.visible');
  });

  it('shows 4-step progress indicator', () => {
    cy.visit('/onboarding');
    cy.contains('Business Info').should('be.visible');
    cy.contains('Documents').should('be.visible');
    cy.contains('Agreement').should('be.visible');
    cy.contains('Review').should('be.visible');
  });

  it('step 1 validates required fields', () => {
    cy.visit('/onboarding');
    cy.contains('Next Step').click();
    cy.contains('Business name required').should('be.visible');
    cy.contains('Owner name required').should('be.visible');
  });

  it('completes step 1 and advances to step 2', () => {
    cy.visit('/onboarding');

    cy.get('input').filter('[placeholder*="LLC"]').type('Cypress Burgers LLC');
    cy.get('input').filter('[placeholder*="John"]').type('John Cypress');
    cy.get('input').filter('[type="email"]').type('john@cypressburgers.com');
    cy.get('input').filter('[placeholder*="555"]').type('5551234567');
    cy.get('input').filter('[placeholder*="Main"]').type('123 Test Street');
    cy.get('input').filter('[placeholder*="New York"]').type('Austin');
    cy.get('input').filter('[placeholder*="NY"]').type('TX');

    cy.contains('Next Step').click();
    cy.contains('Document Upload').should('be.visible');
    cy.contains('Step 2').should('be.visible');
  });

  it('shows save draft button', () => {
    cy.visit('/onboarding');
    cy.contains('Save Draft').should('be.visible');
  });

  it('save draft shows success toast', () => {
    cy.visit('/onboarding');
    cy.contains('Save Draft').click();
    cy.contains('Draft saved!').should('be.visible');
  });

  it('step 2 shows document upload areas', () => {
    cy.visit('/onboarding');
    // Navigate to step 1 and fill required fields
    cy.get('input').filter('[placeholder*="LLC"]').type('Test LLC');
    cy.get('input').filter('[placeholder*="John"]').type('Test Owner');
    cy.get('input').filter('[type="email"]').type('test@test.com');
    cy.get('input').filter('[placeholder*="555"]').type('5551234567');
    cy.get('input').filter('[placeholder*="Main"]').type('123 St');
    cy.get('input').filter('[placeholder*="New York"]').type('NYC');
    cy.get('input').filter('[placeholder*="NY"]').type('NY');
    cy.contains('Next Step').click();

    cy.contains('Business License').should('be.visible');
    cy.contains('Tax ID').should('be.visible');
    cy.contains('Proof of Funds').should('be.visible');
    cy.contains('Upload').first().should('be.visible');
  });

  it('is NOT accessible to location managers', () => {
    cy.loginAsManager();
    cy.visit('/onboarding');
    cy.contains('403').should('be.visible');
  });
});
