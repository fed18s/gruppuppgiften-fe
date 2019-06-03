const strTest = require('../../src/js/animalApp').testString;
const {clearElement} = require('../../src/js/animalApp');

const pretendElement = {
 firstChild: true,
 removeChild(){
   delete this.firstChild;
   this._removeChild();
 },
 _removeChild: jest.fn()
};

describe('ClearElement-function should have been called on one time', ()=>{
  test('should clear element', ()=> {
    clearElement(pretendElement);
    expect(pretendElement._removeChild).toHaveBeenCalledTimes(1);
  });
 });

describe('test test', () => {
  test('test smoke test', () => {
    expect(strTest()).toBe(false);
  });
});