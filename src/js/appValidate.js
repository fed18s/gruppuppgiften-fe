(function IIFE() {

  // Create variables

  const $form1 = document.getElementById('form1');
  const $form2 = document.getElementById('form2');
  const emailPattern = /^[A-Z0-9._+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$'/;
  const namePattern = /^[a-zA-Z0-9]/;

  function onSubmitForm(e) {
    let formValid = true;
    // Check the pattern to see if it matches
    for (let i = 0; i < e.target.length; i++) {
      e.target[i].style.borderColor = '';
      const inputValue = e.target[i].value;
      const inputDataType = e.target[i].getAttribute('data-type');

      // If it does not match the pattern, set the form to invalid
      switch (inputDataType) {
        case 'email address':
          if (!inputValue.match(emailPattern)) {
            console.log('Invalid email address');
            e.target[i].className = 'error';
            formValid = false;
          } else {
            e.target[i].className = '';
          }
          break;
        case 'name':
          if (!inputValue.match(namePattern)) {
            console.log('Invalid name');
            e.target[i].className = 'error';
            formValid = false;
          } else {
            e.target[i].className = '';
          }
          break;
      }
    }

    // If the form is invalid, we prevent the default action which is submitting the form
    if (!formValid) {
      e.preventDefault();
    }
  }

  function onInvalid(e) {
    e.preventDefault();
    console.log(e.target.getAttribute('id'));
    e.target.style.borderColor = 'red';
  }

  function registerInvalidListeners(form) {
    for (let i = 0; i < form.length; i++) {
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
    registerListeners();
  }

  window.pageLoaded = pageLoaded;


})();
