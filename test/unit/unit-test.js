const { listenToSelectType } = require('../../src/js/animalApp');
const { clearElement } = require('../../src/js/animalApp');

describe('listenToSelectType', () => {
  const type = ['Cat', 'Dog', 'Bird'];

  test('should select animal type', () => {
    listenToSelectType(type);
    expect(type.listenToSelectType()).toBe(type);
  });
});

describe('clearElement', () => {
  test('should clear child element', () => {
    document.body.innerHTML =
    '<ul id=“myList”>' +
      '<li>1</li>' +
      '<li>2</li>' +
    '</ul>';
    const list = document.getElementById('myList');
    clearElement(list);
    expect(list).toHaveBeenCalledTimes(1);
  });
});
