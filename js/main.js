'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const btnAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const btnLogOut = document.querySelector(".button-out");
const cardsRestaurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");

let login = localStorage.getItem("userName");

function toggleModal() {
  modal.classList.toggle("is-open");
}
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

function createCardRestaurant() {
  const card = `					
  <a href="#" class="card card-restaurant">
    <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">Пицца плюс</h3>
        <span class="card-tag tag">50 мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          4.5
        </div>
        <div class="price">От 900 ₽</div>
        <div class="category">Пицца</div>
      </div>
    </div>
  </a>
`;
  cardsRestaurants.insertAdjacentHTML("afterbegin", card);
}

function createCardGood() {
  const card = document.createElement("div");
  card.className = "card"; 

  card.insertAdjacentHTML("beforeend", `
    <img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">Пицца Классика</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями,
          грибы.
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">510 ₽</strong>
      </div>
    </div>
  `);

  cardsMenu.insertAdjacentElement("beforeend", card);
}

function openGoods(e) {
  const target = e.target;
  const restaurant = target.closest(".card-restaurant");

  if(restaurant) {
    if(login) {
      cardsMenu.textContent = "";
      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      menu.classList.remove("hide");
  
      createCardGood();
      createCardGood();
      createCardGood();
    } else {
        toggleModalAuth()
    }
  }
}

cardsRestaurants.addEventListener("click", openGoods);


logo.addEventListener("click", function() {
  containerPromo.classList.remove("hide");
  restaurants.classList.remove("hide");
  menu.classList.add("hide"); 
});

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

checkAuth();

createCardRestaurant();
createCardRestaurant();
createCardRestaurant();