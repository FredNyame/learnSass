//Contact Class : handle creating an object
class Contact{
  //setup
  constructor(_firstName, _lastName, _email, _message, _who){
    this.firstName = _firstName;
    this.lastName = _lastName;
    this.email = _email;
    this.message = _message;
    this.who = _who;
  }
}

///////////////////////////////////////////////////
//UI class: handles showing and removing error messages
class UI{
  static showError(fieldInput ,error){
    //If there is an error add a class to the form input
    fieldInput.classList.add('error');
    //console.log('hello');
    
    // Get field id or name
    var id = fieldInput.id || fieldInput.name;
    if (!id) return;

    let message = UI.createDiv(fieldInput, id)
    
    // Add ARIA role to the field
    fieldInput.setAttribute('aria-describedby', 'error-for-' + id);

    //Showing the error messsge
    //Update error message
    message.innerHTML = error;

    // Show error message
    message.style.display = 'block';
    message.style.visibility = 'visible';
  }

  static createDiv(formField, id){
     //Check if there is an error that exist if not create one 
     let message = formField.form.querySelector('.error-message#error-for-' + id);
     if(!message){
       //Create a div tag to contain the error and class of error to style it up
       message = document.createElement('div');
       message.className = 'error-message';
       message.id = 'error-for-' + id;

      // If the field is a radio button or checkbox, insert error after the label
      var label;
      if (formField.type === 'radio' || formField.type ==='checkbox') {
          label = formField.form.querySelector('label[for="' + id + '"]') || formField.parentNode;
          if (label) {
              label.parentNode.insertBefore( message, label.nextSibling );
          }
      }

      // Otherwise, insert it after the field
      if (!label) {
        formField.parentNode.insertBefore( message, formField.nextElementSibling );
      }
     }

     return message;
  }

  static removeError(fieldInput){
    // Remove error class to field
    fieldInput.classList.remove('error');

    // Remove ARIA role from the field
    fieldInput.removeAttribute('aria-describedby');

    // If the field is a radio button and part of a group, remove error from all and get the last item in the group
    if (fieldInput.type === 'radio' && fieldInput.name) {
      var group = fieldInput.form.querySelectorAll('[name="' + fieldInput.name + '"]');
      if (group.length > 0) {
          for (var i = 0; i < group.length; i++) {
              group[i].classList.remove('error');
          }
          fieldInput = group[group.length - 1];
      }
    }

    // Get field id or name
    let id = fieldInput.id || fieldInput.name;
    if (!id) return;

    // Check if an error message is in the DOM
    let message = fieldInput.form.querySelector('.error-message#error-for-' + id);
    if (!message) return;

    // If so, hide it
    message.innerHTML = '';
    message.style.display = 'none';
    message.style.visibility = 'hidden';
  }

  static clearFields(){
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
    let selectRadio = document.getElementsByName('Person');
    //Check which one is seleted and get it value
    selectRadio.forEach((who) => {
      if(who.checked === true){
        who.value = ''; 
      }
    });
    //console.log('Rest');
  }
}

/////////////////////////////////////////////////////
//Function for Validation
let checkVal = function(field){
  //Ignore some input fields
  if(field.type === 'reset' || field.type === 'file'){
    return;
  }

  //else go no with the validation
  let inputVal = field.validity;

  //If radio button is not selected
  if(field.type === 'radio'){
    let selectRadio = document.getElementsByName('Person');
    for(let i = 0; i < selectRadio.length; i++){
      //check if it is selected
      if(selectRadio[0].checked === true){
        return '';
      } else if(selectRadio[1].checked === true){
        return '';
      } 
      else{
        return 'Please select one';
      }
    }
  }

  // If valid, return null
  if (inputVal.valid) return;

  //check if fields are empty
  if(inputVal.valueMissing){
    return 'Please fill out this field.'
  }

  //check if fields are the right type of data in them using pattern regex
  // If not the right type
  if(inputVal.typeMismatch) {
    //Check the field type and respond accordingly
    if(field.type === 'email'){
      //Email
      let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(field.value) ? '' : 'Please enter a valid email address';
      //return 'Please enter an email address.';
    }
    if(field.type === 'url'){
      return 'Please enter a valid URL.';
    }
    //else gotcha all
    return 'Please use the correct input type.';
  } 

  //check if fields have the right length above min
  // If too short
  if(inputVal.tooShort) {
    return 'Please lengthen this text to ' + field.getAttribute('minLength') + ' characters or more. You are currently using ' + field.value.length + ' characters.';
  };

   // If too long
   if(inputVal.tooLong) {
    return 'Please shorten this text to ' + field.getAttribute('maxLength') + ' characters or more. You are currently using ' + field.value.length + ' characters.';
  };

  // If number input isn't a number
  if(inputVal.badInput) return 'Please enter a number.';

  // If a number value doesn't match the step interval
  if (inputVal.stepMismatch) return 'Please select a valid value.';

  //check if a radio input is selected

  // If all else fails, return a generic catchall error
  return 'The value you entered for this field is invalid.';
}

//////////////////////////////////////////////////////////////////
//Event: Handles when input has been unfocus
const formElm = document.querySelector('#contact-form')  || document.querySelector('#application-form');

//const appFormElm = document.querySelector('#application-form');

formElm.addEventListener('blur', inputblur, true);
//appFormElm.addEventListener('blur', inputblur, true);

//Stop Native Broswer validation behavoir
formElm.setAttribute('novalidate', true);
//appFormElm.setAttribute('novalidate', true);

//Funtion for Blur
function inputblur(e){
  
 //Check validity
 let error = checkVal(e.target);
  
 //if there is an error
 if(error){
   //get it to show on page
   UI.showError(e.target, error);
   return;
 }

 //Remove error
 UI.removeError(e.target);
}
  

////////////////////////////////////////////////////////////////////
//Event: Handles when form submit 
formElm.addEventListener('submit', (e) => {
  //Prevent form from actual submitting
  e.preventDefault();

  // Get all of the form elements
  let fields = e.target.elements;

  // Validate each field
  // Store the first field with an error to a variable so we can bring it into focus later
  let error, hasErrors;
  for (var i = 0; i < fields.length; i++) {
      error = checkVal(fields[i]);
      if (error) {
          UI.showError(fields[i], error);
          if (!hasErrors) {
              hasErrors = fields[i];
          }
      }
  } 

  // If there are errrors, don't submit form and focus on first element with error
  if (hasErrors) {
      hasErrors.focus();
      return;
  }

  // Otherwise, let the form submit normally if there are no errors
  //Get the input values
  let person;
  let firstName = document.getElementById('firstName').value;
  let lastName = document.getElementById('lastName').value;
  let emailValue = document.getElementById('email').value;
  let textArea = document.getElementById('message').value;
  let selectRadio = document.getElementsByName('Person');
  //Check which one is seleted and get it value
  selectRadio.forEach((who) => {
    if(who.checked === true){
      person = who.value; 
    }
  });

  //Pass those values into the contact class to create a contact object
  let contact1 = new Contact(firstName, lastName, emailValue, textArea, person);
  console.log(contact1);

  // You could also bolt in an Ajax form submit process here
  //Reset the form when submitted
  UI.clearFields();
});