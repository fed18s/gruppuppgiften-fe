/* eslint-disable global-require */
/* eslint-disable one-var-declaration-per-line */
const mockedResponse = {
  data: [
    { id: 0, name: 'name1' },
    { id: 1, name: 'name2' },
  ],
};

const mockedJsonPromise = Promise.resolve(mockedResponse);

const mockedFetchPromise = Promise.resolve({
  json: () => mockedJsonPromise,
});


describe('integration tests for listenToSelect', () => {
  // eslint-disable-next-line one-var
  let fetchBackup, listenToSelectType;
  beforeAll(() => {
    document.body.innerHTML = `
    <select id="animal-type">
        <option value="cat">Cat</option>
        <option value="dog">Dog</option>
        <option value="pokemon">Pokemon</option>
    </select>
    <select id="animal-select"><option value="-1">TEST</option></select>;`;
    fetchBackup = window.fetch;
    window.fetch = jest.fn().mockReturnValue(mockedFetchPromise);
    // eslint-disable-next-line prefer-destructuring
    listenToSelectType = require('../../src/js/animalApp').listenToSelectType;
  });

  afterAll(() => {
    if (fetchBackup) {
      window.fetch = fetchBackup;
    }
  });

  it('should replace old list with new and call fetch once', (done) => {
    // Setup
    const expectedOutcome1 = '<select id="animal-select" data-loaded="false"></select>';
    const $animalSelect = document.getElementById('animal-select');
    const $animalTypeSelect = $animalSelect.options[$animalSelect.selectedIndex].value;
    const testType = $animalTypeSelect[0].value;
    const expectedUrl = `http://localhost:3000/${testType}s`;
    const expectedOutcome2 = `<select id="animal-select" data-loaded="true"><option value="null">Select ${testType}</option><option value="0">name1</option><option value="1">name2</option></select>`;

    // Test-run
    listenToSelectType();
    // Do something with $animalSelectType

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
