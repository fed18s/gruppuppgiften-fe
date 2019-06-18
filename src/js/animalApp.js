// globals document, window
"use strict";

(function IIFE() {
  const remoteUrl = 'localhost:3000';
  let animalType = 'cat';
  const $animalTypeSelect = document.querySelectorAll('input[type=radio]');
  const $animalSelect = document.getElementById('animal-select');
  const $animalDescription = document.getElementById('animal-description');
  const $animalToAdd = document.getElementById('animal-to-add');
  const $animalAdd = document.getElementById('animal-add');
  const form1 = document.getElementById('theForm');
  const namePattern = /\w{3}\s\w{3}/;
  const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const personalNumberPattern = /\d{6}[+-]\d{4}/;


  function clearElement(element) {
    while (element.firstChild) {
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
        const text = JSON.stringify(data.data, null, '\t');
        const $text = document.createTextNode(text);
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

  function listenToRadioButton() {
    for (let i = 0; i < $animalTypeSelect.length; i++) {
      const element = $animalTypeSelect[i];
      element.addEventListener('click', (e) => {
        animalType = e.target.value;
        populateSelect(e.target.value);
      });
    }
  }

  function listenToAdd() {
    $animalAdd.addEventListener('click', () => {
      $animalAdd.setAttribute('data-loaded', 'false');
      const dataText = $animalToAdd.value;
      try {
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
      }
      catch {
        document.getElementById("errorMessageAnimalData").innerHTML = "Correct animal data is required!";
      }
    })
  }

  function onSubmitForm(e) {

    let formValid = true;

    for (let i = 0; i < e.target.length; i++) {
      const inputValue = e.target[i].value;
      const inputDataType = e.target[i].getAttribute('data-type');

      switch (inputDataType) {

        case 'name':
          if (!inputValue.match(namePattern)) {
            document.getElementById("errorMessageName").innerHTML = "Correct insertion of firstname and lastname is required!";
            formValid = false;
          }
          break;

        case 'email':
          if (!inputValue.match(emailPattern)) {
            document.getElementById("errorMessageEmail").innerHTML = "Correct insertion of email is required!";
            formValid = false;
          }
          break;

        case 'number':
          if (!inputValue.match(personalNumberPattern)) {
            document.getElementById("errorPersonalNumber").innerHTML = "Correct insertion of personal number is required!";
            formValid = false;
          }
          break;
      }
    }

    // If form is not valid, we prevent default action - which is submitting form
    if (!formValid) {
      e.preventDefault();
    }
  }

  function onInvalid(e) {
    e.preventDefault();
  }

  function registerInvalidListeners(form) {
    for (let i = 0; i < form.length; i++) {
      form[i].addEventListener('invalid', onInvalid);
    }
  }

  function registerListeners() {
    form1.addEventListener('submit', onSubmitForm);
    registerInvalidListeners(form1);
  }

  function pageLoaded() {
    populateSelect(animalType);
    listenToSelect();
    listenToAdd();
    listenToRadioButton();
    registerListeners();
  }

  window.pageLoaded = pageLoaded;

  module.exports = {
    clearElement,
    listenToRadioButton,
    testString: function testString(str) {
      return false;
    }
  }

})();