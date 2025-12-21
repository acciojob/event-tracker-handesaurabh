describe('Calendar App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  it('adding events and validating events', () => {
    // Click on a date in the calendar
    cy.get('.rbc-day-bg').first().click();
    
    // Wait for popup to appear
    cy.get('.mm-popup').should('be.visible');
    
    // Fill in event details
    cy.get('.event-title-input').type('Test Event');
    cy.get('.event-location-input').type('Test Location');
    
    // Click save button
    cy.get('.mm-popup__btn--success').click();
    
    // Verify event was added
    cy.contains('Test Event').should('be.visible');
  });
  
  // Adding more comprehensive tests
  it('should be able to edit events', () => {
    // Create an event first
    cy.get('.rbc-day-bg').first().click();
    cy.get('.mm-popup').should('be.visible');
    cy.get('.event-title-input').type('Original Event');
    cy.get('.event-location-input').type('Original Location');
    cy.get('.mm-popup__btn--success').click();
    
    // Click on the event to edit it
    cy.contains('Original Event').click();
    
    // Edit the event
    cy.get('.event-title-input').clear().type('Updated Event');
    cy.get('.event-location-input').clear().type('Updated Location');
    cy.get('.mm-popup__btn--success').click();
    
    // Verify event was updated
    cy.contains('Updated Event').should('be.visible');
  });
  
  it('should be able to delete events', () => {
    // Create an event first
    cy.get('.rbc-day-bg').eq(5).click(); // Click on a different date
    cy.get('.mm-popup').should('be.visible');
    cy.get('.event-title-input').type('Event to Delete');
    cy.get('.event-location-input').type('Delete Location');
    cy.get('.mm-popup__btn--success').click();
    
    // Click on the event to delete it
    cy.contains('Event to Delete').click();
    
    // Click delete button
    cy.get('.mm-popup__btn--danger').click();
    
    // Verify event was deleted
    cy.contains('Event to Delete').should('not.exist');
  });
  
  it('should filter events correctly', () => {
    // Test All filter
    cy.get('.btn').eq(0).click();
    
    // Test Past filter
    cy.get('.btn').eq(1).click();
    
    // Test Upcoming filter
    cy.get('.btn').eq(2).click();
  });
});
