

// We want to make sure that pouplateSelect does populate the select in a reasonable way
// It is working in integration with clearElement and createOption, and we also
// need to make sure this integration works

// We will start with creating a fake web page that populateSelect can find
// its parentNode in

// populateSelect calls fetch - so we also need to explicitly override it
// and replace it with a mock that returns predictable data.

// This way we can check the element afterwards and compare it to the expected
// value

const mockedResponse = {
  data:[
    { id: 0, name: 'name1', },
    { id: 1, name: 'name2', },
  ]
};

const mockedJsonPromise = Promise.resolve(mockedResponse);

const mockedFetchPromise = Promise.resolve({
  json: () => mockedJsonPromise,
});



describe('integration tests for populateSelect, clearElement and createOption', () => {
  let fetchBackup, populateSelect;
  beforeAll(() => {
    document.body.innerHTML = `<select id="animal-select"><option value="-1">TEST</option></select>`;
    fetchBackup = window.fetch;
    window.fetch = jest.fn().mockReturnValue(mockedFetchPromise);
    populateSelect = require('../../src/js/animalApp').populateSelect;
  });

  afterAll(() => {
    if (fetchBackup) {
      window.fetch = fetchBackup;
    }
  });

  it('should replace old list with new and call fetch once', (done) => {
    // Setup
    const testType = 'test';
    const expectedUrl = `http://localhost:3000/${testType}s`;
    const expectedOutcome1 = `<select id="animal-select" data-loaded="false"></select>`;
    const expectedOutcome2 = `<select id="animal-select" data-loaded="true"><option value="null">Select ${testType}</option><option value="0">name1</option><option value="1">name2</option></select>`;
    const $animalSelect = document.getElementById('animal-select');

    // Test-run
    populateSelect(testType);

    // Verify
    expect($animalSelect.outerHTML).toBe(expectedOutcome1);
    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(window.fetch.mock.calls[0][0]).toBe(expectedUrl);

    // Resolve the promises and keep verifying
    process.nextTick(() => {
      expect($animalSelect.getAttribute('data-loaded')).toBe('true');
      expect($animalSelect.outerHTML).toBe(expectedOutcome2);
      done();
    });
  });
});
