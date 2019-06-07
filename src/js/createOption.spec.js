const { createOption } = require('./animalApp');

// We want to test if createOption does its thing

// Use the function to create an option
// Create on option manually
// Expect them to be equal

describe('tests for createOption', function() {
  it('should create a DOM element', () => {
    // Setup reference value
    const value = 2;
    const label = 'Two';
    const optionString = `<option value="${value}">${label}</option>`;

    // Test-run
    const testOptionNode = createOption(value, label);

    // Verify
    expect(testOptionNode.outerHTML).toBe(optionString);
  });
});
