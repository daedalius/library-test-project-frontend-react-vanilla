describe('Application', () => {
  beforeEach(() => {
    cy.clearCookies();
    Cypress.Cookies.preserveOnce('session-id');
  });

  it('allows to sign in', () => {
    cy.visit('/');
    cy.get('#login').type('admin')
    cy.get('#password').type('password{enter}')
    cy.window().then((win) => {
      expect(win.location.pathname).to.equal('/books')
    })
  });

  it('allows to sign out', () => {
    cy.visit('/');
    cy.get('*').contains('Sign Out').click()
    cy.window().then((win) => {
      expect(win.location.pathname).to.equal('/sign-in')
    })
  })
});
