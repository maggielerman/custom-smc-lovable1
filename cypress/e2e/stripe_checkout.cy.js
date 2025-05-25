describe('Stripe Checkout', () => {
  it('completes a payment', () => {
    cy.visit('/checkout');
    cy.get('input[name=email]').type('testuser@example.com');
    // Fill in Stripe test card details
    cy.get('input[name=cardnumber]').type('4242424242424242');
    cy.get('input[name=exp-date]').type('12/34');
    cy.get('input[name=cvc]').type('123');
    cy.get('button[type=submit]').click();
    cy.contains('Payment successful');
  });
}); 