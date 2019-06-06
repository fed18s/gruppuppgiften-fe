const { clearElement } = require('../../src/js/animalApp');

// We want to test if clearElement does its thing

// Create an element with children that can be cleared
// Use the function
// Expect it not to have children afterward

// Also call the function on an element that has no children
// Expect it not to crash

// Also call the function on null
// Expect it to crash

describe('tests for clearElement', () => {

  test('should clear existing children', () => {
    // Setup
    const parentNode = document.createElement('div');
    for (let i = 0; i < 3; i++) {
      let child = document.createElement('span');
      parentNode.appendChild(child);
    }
    // Test-run
    clearElement(parentNode);
    // Verify
    expect(parentNode.hasChildNodes()).toBe(false);
  });

  test('should clear element without children', () => {
    // Setup
    const parentNode = document.createElement('div');
    // Test-run
    clearElement(parentNode);
    // Verify
    expect(parentNode.hasChildNodes()).toBe(false);
  });

  test('should fail when fed bad input', () => {
    // Test-run and verification
    expect(() => clearElement(undefined)).toThrow();
  });
});
