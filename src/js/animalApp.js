// globals document, window
"use strict";

(function IIFE(){
  const remoteUrl = 'localhost:3000';
  let animalType;

  function checkAnimalType(animal){
    animalType = animal;
    populateSelect(animalType); 
  }

  window.checkAnimalType = checkAnimalType;

  const $animalSelect = document.getElementById('animal-select');
  const $animalDescription = document.getElementById('animal-description');
  const $animalToAdd = document.getElementById('animal-to-add');
  const $animalAdd = document.getElementById('animal-add');

  function clearElement(element) {
    while(element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function createOption(value, text) {
    const $option = document.createElement('option');
    $option.setAttribute('value', value);
    const $optionText = document.createTextNode(text);
    $option.appendChild($optionText);
    return $option;
  }

  function populateSelect(type) {
    clearElement($animalSelect);
    $animalSelect.setAttribute('data-loaded', 'false');
    fetch(`http://${remoteUrl}/${type}s`)
      .then((response) => response.json())
      .then((data) => {
        const animals = data.data;
        const $defaultOption = createOption(null, `Select ${animalType}`);
        $animalSelect.appendChild($defaultOption);
        animals.forEach((animal) => {
          const $option = createOption(animal.id, animal.name);
          $animalSelect.appendChild($option);
        });
        $animalSelect.setAttribute('data-loaded', 'true');
      });
  }

  function getByTypeAndId(type, id) {
    $animalDescription.setAttribute('data-loaded', 'false');
    clearElement($animalDescription);

    fetch(`http://${remoteUrl}/${type}/${id}`)
      .then((response) => response.json())
      .then((data) => {
        //const $pre = document.createElement('pre');
        const text = JSON.stringify(data.data, null, '\t');
        const $text = document.createTextNode(text);
        //$pre.appendChild($preText);
        $animalDescription.appendChild($text);
        $animalDescription.setAttribute('data-loaded', 'true');
      });
  }

  function listenToSelect() {
    $animalSelect.addEventListener('change', (e) => {
      const id = e.target.selectedOptions[0].value;
      getByTypeAndId(animalType, id);
    });
  }

  function listenToAdd() {
    $animalAdd.addEventListener('click', () => {
      $animalAdd.setAttribute('data-loaded', 'false');
      const dataText = $animalToAdd.value;
      const dataObject = JSON.parse(dataText);
      clearElement($animalToAdd);
      fetch(`http://${remoteUrl}/${animalType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataObject),
      })
        .then(() => {
          $animalAdd.setAttribute('data-loaded', 'true');
          populateSelect(animalType);
        });
    })
  }

  const $form1 = document.getElementById('form-1');
  const $form2 = document.getElementById('form-2');
  const tagRegex = /<.*>/;

  function onSubmitForm(e) {
    let formValid = true;
    console.log('hello inside onsubmit, outside loop');
    for (let i = 0; i<e.target.length; i++) {
      e.target[i].style.borderColor = '';
      const inputValue = e.target[i].value;
      const inputDataType = e.target[i].getAttribute('data-type');
      console.log(inputValue.match(tagRegex));
      console.log('hello inside loop');

      switch (inputDataType) {
        case 'username':
        case 'birthdate':
          if (inputValue.match(tagRegex)) {
            alert("Don't hack, don't hack me no more");
            e.target[i].className = 'error';
            formValid = false;
          }
          else {
            e.target[i].className = '';
          }
          break;
        }
    }

    // If form is not valid, we prevent default action - which is submitting form
    //if (!formValid) {
      //e.preventDefault();
    //}
  }

  function onInvalid(e) {
    e.preventDefault();
    //console.log(e.target.getAttribute('id'));
    e.target.style.borderColor = 'red';
  }

  function registerInvalidListeners(form) {
    for (let i=0; i<form.length; i++) {
      form[i].addEventListener('invalid', onInvalid);
    }
  }

  function registerListeners() {
    $form1.addEventListener('submit', onSubmitForm);
    registerInvalidListeners($form1);
    $form2.addEventListener('submit', onSubmitForm);
    registerInvalidListeners($form2);

  }

  function pageLoaded() {
    populateSelect(animalType);
    listenToSelect();
    listenToAdd();
    registerListeners();
  }

  window.pageLoaded = pageLoaded;

  module.exports = {
     checkAnimalType
  };
})();