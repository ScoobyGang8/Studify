/* eslint-disable no-undef */
describe('The Home Page', () => {
  it('should successfully load', () => {
    cy.visit('/');

    //Check if the main container of the home page is present
    cy.get('.auth-container')
      .should('be.visible');

    //Look for login page header
    cy.get('#login-text')
      .should('be.visible')
      .should('have.text', 'Login Details');

    //Look for the login button
    cy.get('button')
      .should('have.id', 'auth-btn');
  });

  it('should switch between login and signup pages', () => {
    //Click on the switch-auth element to switch to sign up view
    cy.get('.switch-auth').click();

    //Main container should still be present
    cy.get('.auth-container')
      .should('be.visible');
    
    //Header should now be Signup Details
    cy.get('#login-text')
      .should('be.visible')
      .should('have.text', 'Signup Details');
  });

  it('should not allow users to signup without filling all forms', () => {

    //First test trying to sign up with only username and password
    cy.get('input[name="Username"]').type('testuser');
    cy.get('input[type="password"]').type('password');
    cy.get('button').click();

    //Warning error element should render
    cy.get('.warning').should('be.visible');
  });

  it('should successfully create a new user and redirect to home page when all fields are filled', () => {
    
    //Fill out the nickname input and try signing up again
    cy.get('input[name="Nickname"]').type('testuser');
    cy.get('button').click();

    //The url should now redirect to the home page
    cy.url().should('include', '/main/home');

    //Dashboard element should be visible
    cy.get('#dashboard').should('be.visible');

    //Main nav should also be visible
    cy.get('.main-nav').should('be.visible');
  });
});