describe('Calendar App', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
    });

    it('adding events and validating events', () => {
        // Click on a date in the calendar
        cy.get('.rbc-day-bg').first().click();

        // Wait for popup to appear
        cy.get('.mm-popup-overlay').should('be.visible');

        // Fill in event details
        cy.get('input[placeholder="Event Title"]').type('Test Event');
        cy.get('input[placeholder="Event Location"]').type('Test Location');

        // Click save button - using the specific selector from the error
        cy.get('.mm-popup__box__footer__right-space > .mm-popup__btn').click();

        // Verify event was added
        cy.contains('Test Event').should('be.visible');
    });

    it('should be able to edit events', () => {
        // Create an event first
        cy.get('.rbc-day-bg').first().click();
        cy.get('.mm-popup-overlay').should('be.visible');
        cy.get('input[name="title"]').type('Original Event');
        cy.get('input[name="location"]').type('Original Location');
        cy.get('.mm-popup__btn--success').click();

        // Click on the event to edit it
        cy.contains('Original Event').click();

        // Edit the event
        cy.get('input[name="title"]').clear().type('Updated Event');
        cy.get('input[name="location"]').clear().type('Updated Location');
        cy.get('.mm-popup__btn--success').click();

        // Verify event was updated
        cy.contains('Updated Event').should('be.visible');
    });

    it('should be able to delete events', () => {
        // Create an event first
        cy.get('.rbc-day-bg').eq(5).click(); // Click on a different date
        cy.get('.mm-popup-overlay').should('be.visible');
        cy.get('input[name="title"]').type('Event to Delete');
        cy.get('input[name="location"]').type('Delete Location');
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

        // Test Add Event button
        cy.get('.btn').eq(3).click();
    });
});
