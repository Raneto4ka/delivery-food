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
const restaurantsTitle = document.querySelector(".restaurant-title");
const rating = document.querySelector(".rating");
const minPrice = document.querySelector(".price");
const category = document.querySelector(".category");
const inputSearch = document.querySelector(".input-search");

let login = localStorage.getItem("userName");


const getData = async function(url) {
  const response = await fetch(url);
  if(!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, 
    статус ошибки ${response.status}!`)
  }
  return await response.json();
};

const toggleModal = function() {
  modal.classList.toggle("is-open");
}

const toggleModalAuth = function() {
  modalAuth.classList.toggle("is-open");
  loginInput.classList.remove('input-error');
}

function returnMain() {
  containerPromo.classList.remove("hide");
  restaurants.classList.remove("hide");
  menu.classList.add("hide");  
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
    returnMain();
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

function createCardRestaurant(restaurant) {

  const { image, kitchen, price, name, stars, products, time_of_delivery: timeOfDelivery } = restaurant;

  const card = `					
  <a href="#" class="card card-restaurant" data-products="${products}" data-info="${[name, price, stars, kitchen]}">
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery}</span>
      </div>
      <div class="card-info">
        <div class="rating">
        ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  </a>
`;
  cardsRestaurants.insertAdjacentHTML("afterbegin", card);
}

function createCardGood({ description, image, name, price }) {

  const card = document.createElement("div");
  card.className = "card"; 

  card.insertAdjacentHTML("beforeend", `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold"> ${price} ₽</strong>
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
      const info = restaurant.dataset.info.split(',');
      const [name, price, stars, kitchen] = info;
      cardsMenu.textContent = "";
      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");  
      menu.classList.remove("hide");   
      restaurantsTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = `От ${price} ₽`;
      category.textContent = kitchen;  
      getData(`./db/${restaurant.dataset.products}`).then(function(data){
        data.forEach(createCardGood);
      });
    } else {
        toggleModalAuth()
    }
  }
}

function init() {
  getData('./db/partners.json').then(function(data){
    data.forEach(createCardRestaurant);    
  });
  
  cardsRestaurants.addEventListener("click", openGoods);
  
  logo.addEventListener("click", returnMain);
  
  cartButton.addEventListener("click", toggleModal);
  close.addEventListener("click", toggleModal);
  
  inputSearch.addEventListener('keydown', function(e) {
    if(e.keyCode === 13) {
      const target = e.target;
      const value = target.value.toLowerCase().trim();
      target.value = "";
      if(!value || value.length < 3) {
        target.style.backgroundColor = 'tomato';
        setTimeout(function(){
          target.style.backgroundColor = "";
        }, 2000);
        return;
      }
      const goods = [];
      getData('./db/partners.json').then(function(data){
        const products = data.map(function(item){
          return item.products;
        });    
        products.forEach(function(product){
          getData('./db/' + product).then(function(data){
            goods.push(...data);
            const searchGoods = goods.filter(function(item){
              return item.name.toLowerCase().includes(value);
            })
            cardsMenu.textContent = "";
            containerPromo.classList.add("hide");
            restaurants.classList.add("hide");  
            menu.classList.remove("hide");   
            restaurantsTitle.textContent = "Результат поиска";
            rating.textContent = "";
            minPrice.textContent = "";
            category.textContent = "";
            return searchGoods;
                    
          })
          .then(function(data){
            data.forEach(createCardGood);   
          })
        })
      });     
    }
  })

  checkAuth();
  
  new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
      delay: 5000,
    },
  });
}

init();