describe('For user the application', () => {
  beforeEach(() => {
    cy.task('db:seed').then((sessionIdValue) => {
      cy.setCookie('session-id', sessionIdValue as string);
    });
  });

  it('allows to see list of books on the main page', () => {
    cy.visit('/');
    cy.url().should('include', '/books');
    cy.get('.book').contains('The Man Who Was Thursday');
    cy.get('.book').contains('Venus and Adonis');
    cy.get('.book').contains('War and peace');
  });

  describe('allows to search for books', () => {
    it('by title substring', () => {
      cy.visit('/');
      cy.intercept('/api/books*').as('filter');
      cy.get('.books-page__book-search').within(() => {
        cy.get('input[placeholder="Substring"]').type('and peace');
      });

      cy.wait('@filter');
      cy.get('.book').contains('War and peace');
    });

    it('by description substring', () => {
      cy.visit('/');
      cy.intercept('/api/books*').as('filter');
      cy.get('.books-page__book-search').within(() => {
        cy.get('input[placeholder="Substring"]').type('Russian author Leo Tolstoy');
      });

      cy.wait('@filter');
      cy.get('.book').contains('War and peace');
    });

    it('by author', () => {
      cy.visit('/');
      cy.intercept('/api/books*').as('filter');
      cy.get('.books-page__book-search').within(() => {
        cy.get('select').select('Leo Tolstoy');
      });

      cy.wait('@filter');
      cy.get('.book').contains('War and peace');
    });

    it('by availability of free copies', () => {
      cy.visit('/');
      cy.intercept('/api/books*').as('filter');
      cy.get('.books-page__book-search').within(() => {
        cy.get('label').contains('Free copies').click();
      });

      cy.wait('@filter');
      cy.get('.book').contains('The Man Who Was Thursday');
    });
  });

  it('allows to borrow a copy', () => {
    cy.visit('/');
    cy.get('.book').contains('The Man Who Was Thursday').click();

    cy.get('input[value="Borrow"]').click();

    // assert
    cy.get('input[value="Return"]').should('exist');
    cy.get('.current-user-in-header').click();
    cy.contains('The Man Who Was Thursday');
  });

  it('allows to return a copy', () => {
    cy.visit('/');
    cy.get('.book').contains('The Man Who Was Thursday').click();
    cy.get('input[value="Borrow"]').click();

    cy.get('input[value="Return"]').click();

    // assert
    cy.get('input[value="Borrow"]').should('exist');
    cy.get('.current-user-in-header').click();
    cy.contains('User has no borrowed book copies');
  });

  describe('in the comment section', () => {
    it('allows to write a comment', () => {
      cy.visit('/');
      cy.get('.book').contains('The Man Who Was Thursday').click();

      cy.get('.book-comments').within(() => {
        cy.get('textarea').type('New Comment');
        cy.get('input[type="Submit"]').click();
      });

      cy.reload();
      cy.get('.book-comments__comments').contains('New Comment');
    });

    it('allows user to remove his comment', () => {
      cy.visit('/');
      cy.get('.book').contains('The Man Who Was Thursday').click();

      cy.get('.book-comments').within(() => {
        cy.contains("I'm not big into books").find('[title="remove comment"]').click();
      });

      cy.reload();
      cy.contains("I'm not big into books").should('not.exist');
    });

    it('allows user to edit his comment', () => {
      cy.visit('/');
      cy.get('.book').contains('The Man Who Was Thursday').click();

      cy.get('.book-comments').within(() => {
        cy.contains("I'm not big into books").find('[title="edit comment"]').click();
      });

      cy.get('[role="dialog"]').within(() => {
        cy.get('#text').clear().type('Edited text');
        cy.get('input[type="submit"]').click();
      });

      cy.reload();
      cy.contains("I'm not big into books").should('not.exist');
      cy.contains('Edited text').should('exist');
    });
  });

  describe('in user profile', () => {
    it('allows to see user login and avatar', () => {
      cy.visit('/');
      cy.get('.current-user-in-header').click();

      cy.get('[data-element="user-profile"]').within(() => {
        cy.contains('admin')
        cy.get('img[alt="user admin profile image"]').should('exist')
      })
    });

    it('allows to see list of borrowed books', () => {
      cy.visit('/');
      cy.get('.book').contains('The Man Who Was Thursday').click();
      cy.get('input[value="Borrow"]').click();
      cy.get('.current-user-in-header').click();
  

      cy.get('[data-element="user-profile"]').within(() => {
        cy.contains('The Man Who Was Thursday');
      })
    });
  });
});
