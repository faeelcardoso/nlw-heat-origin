const ERROR_EXISTS = "active";
const ERROR_NOT_EXISTS = "passed";
const MODAL = "modal";

const form = document.querySelector("form"); 
const fields = document.querySelectorAll("[required]"); 
const container = document.querySelector(".container");
const sections = document.querySelectorAll("section");

const LinksSocialMedia = {
  github: "",
  youtube: "",
  facebook: "",
  instagram: "",
  twitter: "",
}

// FORM VALIDATION
function startingFormValidation() {
  form.addEventListener("submit", e => {
    e.preventDefault();
    if(canISend()) {
      armazenarValores();
    }
  });

  // found an invalid element
  fields.forEach(field => {
    field.addEventListener("invalid", e => {
      // turning the bubble off
      e.preventDefault();

      customValidation(e);
    });
    field.addEventListener("blur", customValidation); // unfocused
  }); 
}

function customValidation(e) {
  const field = e.target;

  // getting the function
  const validation = validateField(field);

  // executing the function
  validation();
}

function validateField(field) {
  // cheching if there's an error
  function verifyErrors() {
    let foundError = false;

    for(let error in field.validity) {
      // with for IN I can get the properties 
      if(field.validity[error] && !field.validity.valid) {
        foundError = error;
      }
    }
    
    return foundError;
  }

  function customMessage(typeError) {
    const inputMessages = {
      text: {
        valueMissing: "Por favor, preencha este campo",
      }
    }
    
    return inputMessages[field.type][typeError];
  }

  function setCustomMessage(message) {
    const spanError = field.parentNode.querySelector("span.error");

    if(message) {
      spanError.classList.add(ERROR_EXISTS);
      spanError.innerHTML = message;
    } else {
      spanError.classList.remove(ERROR_EXISTS);
      spanError.innerHTML = "";
    }
  }

  return function() {
    const error = verifyErrors();

    if(error) {
      const message = customMessage(error);

      field.style.borderColor = "red";
      setCustomMessage(message);

      if(error == "typeMismatch") {
        const label = field.parentNode.querySelector("label");
        label.style.transform = "translateY(-24px)";
      }
    } else {
      field.style.borderColor = "green";
      field.setAttribute("data-error", ERROR_NOT_EXISTS);
      setCustomMessage();
    }
  };
}

function canISend() {
  let result;

  fields.forEach(field => {
    if(!field.dataset.error) {
      result = false;
    } 
  });
  
  return result == false ? false : true; 
}

function armazenarValores() {
  LinksSocialMedia.github = githubUser.value;
  LinksSocialMedia.youtube = youtubeUser.value;
  LinksSocialMedia.instagram = instagramUser.value;
  LinksSocialMedia.facebook = facebookUser.value; 
  LinksSocialMedia.twitter = twitterUser.value;

  showBadget();
}

function showBadget() {
  changeSocialMediaLinks();
  getGitHubProfileInfos();

  sections[2].classList.add(MODAL);
  sections[0].classList.add(MODAL);
  sections[1].classList.add(MODAL);
  container.classList.add(MODAL);
}

function changeSocialMediaLinks() {
  // an awesome way to get the ID, I didn't know this one
  for(let li of socialMediaLis.children) {
    const social = li.getAttribute('id');

    li.children[0].href = `https://${social}.com/${LinksSocialMedia[social]}`;
  }
}

// API Github
function getGitHubProfileInfos() {
  const url = `https://api.github.com/users/${LinksSocialMedia.github}`;

  fetch(url)
  .then(res => res.json())
  .then(data => {
    userName.textContent = data.name;
    userBio.textContent = data.bio;
    userLink.href = data.html_url;
    userLink.children[1].textContent = data.login;
    userImg.src = data.avatar_url;
  });

  console.log(LinksSocialMedia)
}

// STARTING EVERYTHING!
function init() {
  startingFormValidation();
}

init();