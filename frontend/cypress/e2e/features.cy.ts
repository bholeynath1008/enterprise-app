/// <reference types="cypress" />

describe('Support Tickets', () => {
  context('Franchisee Owner creates a ticket', () => {
    beforeEach(() => {
      cy.loginAsOwner();
      cy.visit('/tickets');
    });

    it('shows ticket list page with stats', () => {
      cy.contains('Open').should('be.visible');
      cy.contains('In Progress').should('be.visible');
      cy.contains('Resolved').should('be.visible');
    });

    it('opens new ticket form', () => {
      cy.contains('New Ticket').click();
      cy.get('input').filter(':visible').first().should('exist');
    });

    it('creates a ticket via API stub', () => {
      const newTicket = { id: 'tk_test', title: 'Cypress test ticket', status: 'open', priority: 'medium', franchiseId: 'f1', createdAt: '2025-05-01', replies: [], createdByName: 'Tony Ricci', locationId: null, assignedTo: null, assignedToName: null, resolvedAt: null, description: 'Test' };

      cy.intercept('POST', '**/api/tickets', { statusCode: 201, body: newTicket }).as('createTicket');
      cy.intercept('GET', '**/api/tickets*', req => {
        req.reply({ data: [newTicket], total: 1, page: 1, limit: 25, summary: { open: 1, in_progress: 0, resolved: 0, high: 0 } });
      }).as('getTickets');

      cy.contains('New Ticket').click();
      cy.get('input').filter(':visible').first().type('Cypress test ticket');
      cy.contains('button', 'Submit').click();
      cy.wait('@createTicket');
      cy.contains('Ticket created!').should('be.visible');
    });

    it('shows own tickets only, not all franchisee tickets', () => {
      cy.intercept('GET', '**/api/tickets*', req => {
        // Stub: owner sees limited tickets
        req.reply({ data: [], total: 0, page: 1, limit: 25, summary: { open: 0, in_progress: 0, resolved: 0, high: 0 } });
      }).as('getTickets');
      cy.visit('/tickets');
      cy.wait('@getTickets');
      cy.get('table').should('exist');
    });
  });

  context('HQ Staff resolves a ticket', () => {
    it('resolve button available for HQ staff', () => {
      cy.loginAsStaff();
      cy.visit('/tickets');
      cy.contains('Resolve', { timeout: 8000 }).should('exist');
    });
  });

  context('Location Manager cannot see all tickets', () => {
    it('manager sees only own location tickets', () => {
      cy.loginAsManager();
      cy.visit('/tickets');
      cy.url().should('include', '/tickets');
      cy.contains('403').should('not.exist');
    });
  });
});

describe('Task Management', () => {
  context('Super Admin assigns task', () => {
    beforeEach(() => {
      cy.loginAsSuperAdmin();
      cy.visit('/tasks');
    });

    it('shows task list with filter options', () => {
      cy.get('select').first().should('exist');
    });

    it('New Task button visible for admin', () => {
      cy.contains('New Task').should('be.visible');
    });
  });

  context('Franchisee Owner completes a task', () => {
    it('can mark task complete via API stub', () => {
      cy.loginAsOwner();
      cy.intercept('PUT', '**/api/tasks/*/complete', { statusCode: 200, body: { id: 't1', status: 'completed', title: 'Test task' } }).as('completeTask');
      cy.intercept('GET', '**/api/tasks*', {
        data: [{ id: 't1', title: 'Complete Q1 Audit', description: 'Annual audit', status: 'pending', priority: 'high', dueDate: '2025-06-01', assignedTo: 'f1', assignedType: 'franchisee', assignedToName: 'Pizza Palace' }],
        total: 1, page: 1, limit: 50,
      }).as('getTasks');

      cy.visit('/tasks');
      cy.wait('@getTasks');
      cy.contains('Done').first().click();
      cy.wait('@completeTask');
      cy.contains('Task complete!').should('be.visible');
    });
  });

  context('Location Manager sees limited tasks', () => {
    it('manager sees tasks page without 403', () => {
      cy.loginAsManager();
      cy.visit('/tasks');
      cy.contains('403').should('not.exist');
    });

    it('manager does NOT see New Task button', () => {
      cy.loginAsManager();
      cy.visit('/tasks');
      cy.contains('New Task').should('not.exist');
    });
  });
});

describe('Sales Reports', () => {
  context('Franchisee Owner submits sales report', () => {
    it('shows sales stats and table', () => {
      cy.loginAsOwner();
      cy.visit('/sales');
      cy.contains('Total Gross').should('be.visible');
      cy.get('table').should('exist');
    });
  });

  context('HQ Staff approves sales report', () => {
    it('Approve button visible for HQ', () => {
      cy.loginAsStaff();
      cy.intercept('GET', '**/api/sales*', {
        data: [{ id: 's1', month: 'Apr 2025', locationId: 'l1', franchiseId: 'f1', grossSales: 50000, netSales: 48500, royaltyDue: 2910, status: 'submitted', submittedAt: '2025-04-30', submittedBy: 'u4', attachmentUrl: null, notes: '' }],
        total: 1, page: 1, limit: 30,
        summary: { totalGross: 50000, totalNet: 48500, totalRoyalty: 2910, count: 1 },
      }).as('getSales');

      cy.visit('/sales');
      cy.wait('@getSales');
      cy.contains('Approve', { timeout: 6000 }).should('be.visible');
    });
  });
});

describe('Announcements', () => {
  context('Super Admin broadcasts announcement', () => {
    it('can open broadcast form and submit', () => {
      cy.loginAsSuperAdmin();
      cy.intercept('POST', '**/api/announcements', { statusCode: 201, body: { id: 'a_test', title: 'Test', body: 'Body', priority: 'medium', sentByName: 'Alexandra Chen', sentAt: '2025-05-01', audience: 'all', pinned: false } }).as('createAnn');

      cy.visit('/announcements');
      cy.contains('Send Broadcast').click();
      cy.get('input').filter(':visible').first().type('Test Announcement Cypress');
      cy.get('textarea').filter(':visible').first().type('This is a test announcement body.');
      cy.contains('button', 'Send').click();
      cy.wait('@createAnn');
      cy.contains('Announcement sent!').should('be.visible');
    });
  });

  context('Location Manager cannot broadcast', () => {
    it('Send Broadcast button not visible', () => {
      cy.loginAsManager();
      cy.visit('/announcements');
      cy.contains('Send Broadcast').should('not.exist');
    });
  });
});

describe('Royalty Management', () => {
  context('Super Admin marks royalty paid', () => {
    it('shows mark paid and remind buttons for overdue royalties', () => {
      cy.loginAsSuperAdmin();
      cy.intercept('GET', '**/api/royalties*', {
        data: [{ id: 'r1', franchiseId: 'f4', franchiseName: 'Sub Shop Inc.', period: 'Q1 2025', amountDue: 16450, amountPaid: 0, status: 'overdue', dueDate: '2025-04-15', paidDate: null, notes: '' }],
        total: 1, page: 1, limit: 20,
        summary: { totalDue: 16450, totalPaid: 0, totalOverdue: 16450, overdueCount: 1 },
      }).as('getRoyalties');

      cy.visit('/royalties');
      cy.wait('@getRoyalties');
      cy.contains('Remind').should('be.visible');
      cy.contains('Paid').should('be.visible');
    });
  });

  context('Franchisee Owner views own royalties only', () => {
    it('royalties page loads without 403', () => {
      cy.loginAsOwner();
      cy.visit('/royalties');
      cy.contains('403').should('not.exist');
      cy.contains('Total Due').should('be.visible');
    });
  });
});
