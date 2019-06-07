(function IIFE(){
  function randomType() {
    const types = ['cat', 'dog', 'pokemon'];
    const num = (Math.random() * 3) | 0;
    console.log(num);
    return types[num];
  }

  module.exports = {
    randomType: randomType
  };
})();
