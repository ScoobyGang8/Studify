/* eslint-disable no-undef */
describe('Logging in', () => {
  it('should successfully log in an existing user', () => {
    //visit root page
    cy.visit('/');

    //type in login credentials
    cy.get('input[name="Username"]').type('shaggy');
    cy.get('input[name="password"]').type('password');

    //login button
    cy.get('button').click();

    //check for subject navigation
    cy.get('.subject-nav').should('be.visible');

    //check for cookie
    cy.getCookie('ssid').should('exist');
  });

  it('should be able to navigate to all the rooms based on subjects', () => {
    
    //click on all subject buttons and see if the room container changes
    const subjects = ['math', 'english', 'history', 'science', 'languages', 'miscellaneous'];
    for (const subject of subjects) {
      cy.get(`[id^=${subject}][id$=-link]`).as(`${subject}Btn`).should('exist');
      cy.get(`@${subject}Btn`).click();
      cy.get('h2').contains(`Active ${subject} Rooms`).should('exist');
    }

  });

  it('should properly log the user out of the application', () => {
    cy.get('[id=logout-link-button]').click();

    cy.url().should('equal', 'http://localhost:8080/');
  });
});