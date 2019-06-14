
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
    { id: 0, name: 'Baulbasar', },
    { id: 1, name: 'Pikachu', }
  ]
};

const mockedJsonPromise = Promise.resolve(mockedResponse);

const mockedFetchPromise = Promise.resolve({
  json: () => mockedJsonPromise,
});


describe('integration tests for checkAnimal type', () => {
  let fetchBackup, checkAnimalType;
  beforeAll(() => {
    document.body.innerHTML = `
    <input onclick='checkAnimalType("cat")' type="radio" name="animal" value="cat" id="cat"><p>Cat</p>t<br>
    <input onclick='checkAnimalType("pokemon")' type="radio" name="animal" value="pokemon" id="pokemon"><p>Pokemon</p><br>
    <input onclick='checkAnimalType("dog")' type="radio" name="animal" value="dog" id="dog"><p>Dog</p><br>

    <div id="animal-listing">
        <label for="animal-select">Select</label>
        <select id="animal-select" data-loaded="false"></select>
        <div id="animal-description" data-loaded="false"></div>
    </div>`;

    //window.fetch is global variable containing referance to the fetch function
    fetchBackup = window.fetch;
    // we replace real fetch function with a jest.fn() that allows us to replace fetch with mock data
    window.fetch = jest.fn().mockReturnValue(mockedFetchPromise);
    checkAnimalType = require('../../src/js/animalApp').checkAnimalType;
  });

  afterAll(() => {
    if (fetchBackup) {
      window.fetch = fetchBackup;
    }
  });

  it('should be defined', () => {
    expect(checkAnimalType).toBeDefined();

  });

  it('should call fetch once and fetch data', () => {
    checkAnimalType('test');
    const expectedURLoutcome = `http://localhost:3000/tests`;
    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(window.fetch.mock.calls[0][0]).toBe(expectedURLoutcome);
  });
});