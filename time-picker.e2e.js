const PORT = 8000

describe('Time Picker', () => {
  it('Visits the site', () => {
    cy.visit('http://localhost:' + PORT + '/demo.html')
  })

  it('Has an readonly input', () => {
    cy.get('input[readonly]').should('be.visible').click()
  })

  it('Shows popup', () => {
    cy.get('.time-picker-popup').should('be.visible')
  })

  it('Clicks 3 for hour', () => {
    cy.get('g > [style="transform: rotate(90deg);"]').click({ force: true })
    cy.get('input[readonly]').should('have.value', '3:00 AM')
  })

  it('Clicks 45 minutes', () => {
    cy.get('g > [style="transform: rotate(270deg);"]').click({ force: true })
    cy.get('input[readonly]').should('have.value', '3:45 AM')
  })

  it('Clicks PM', () => {
    cy.get('.slider').click()
    cy.get('input[readonly]').should('have.value', '3:45 PM')
  })

  it('Clicks done', () => {
    cy.get('button').contains('Done').click()
    cy.get('.time-picker.popup').should('not.be.visible')
  })
})