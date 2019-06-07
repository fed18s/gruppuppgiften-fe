const randomType = require('./utils').randomType;

describe('tests for randomType', () => {
  let randomBackup;
  beforeAll(() => {
    randomBackup = Math.random;
    Math.random = jest.fn()
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0.34)
        .mockReturnValueOnce(0.67)
        .mockReturnValue(0.99);
  });
  afterAll(() => {
    Math.random = randomBackup;
  });

  test('reasonable random types', () => {
    expect(randomType()).toBe('cat');
    expect(randomType()).toBe('dog');
    expect(randomType()).toBe('pokemon');
    expect(randomType()).toBe('pokemon');
  });
});
