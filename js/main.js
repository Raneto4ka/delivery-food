const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

//day1

const btnAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const btnLogOut = document.querySelector(".button-out");

let login = localStorage.getItem("userName");

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
  loginInput.classList.remove('input-error');
}

function isAutorized() {
  function logOut(e) {
    login = null;
    btnAuth.style.display = "";
    userName.style.display = "";
    btnLogOut.style.display = "";
    btnLogOut.removeEventListener("click", logOut);    
    localStorage.removeItem("userName");
    checkAuth();
  }

  userName.textContent = login;

  btnAuth.style.display = "none";
  userName.style.display = "inline";
  btnLogOut.style.display = "block";

  btnLogOut.addEventListener("click", logOut);
}

function isNotAutorized() {
  function logIn(e) {    
    e.preventDefault();
    login = loginInput.value;     
    if(login) {
      localStorage.setItem("userName", login);
      toggleModalAuth();
      loginInput.classList.remove('input-error');
      btnAuth.removeEventListener("click", toggleModalAuth);
      closeAuth.removeEventListener("click", toggleModalAuth);
      logInForm.removeEventListener("submit", logIn);  
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.classList.add('input-error');
    }

  }

  btnAuth.addEventListener("click", toggleModalAuth);
  closeAuth.addEventListener("click", toggleModalAuth);
  logInForm.addEventListener("submit", logIn);
}

function checkAuth() {
  if(login) {
    isAutorized();
  } else {
    isNotAutorized();
  }
}

checkAuth();






