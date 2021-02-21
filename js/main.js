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
const modalBody = document.querySelector(".modal-body");
const modalPrice = document.querySelector(".modal-pricetag");
const buttonClearCart = document.querySelector(".clear-cart")

let login = localStorage.getItem("userName");

const cart = []; 

const loadCart = () => {
  if(localStorage.getItem(login)) {
      cart.push(...JSON.parse(localStorage.getItem(login)));
  }
};

const saveCart = () => {
  localStorage.setItem(login, JSON.stringify(cart));
};

const valid = (str) => {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str);
};

const getData = async (url) => {
  const response = await fetch(url);
  if(!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, 
    статус ошибки ${response.status}!`)
  }
  return await response.json();
};

const toggleModal = () => {
  modal.classList.toggle("is-open");
};

const toggleModalAuth = () => {
  modalAuth.classList.toggle("is-open");
  loginInput.classList.remove('input-error');
};

const returnMain = () => {
  containerPromo.classList.remove("hide");
  restaurants.classList.remove("hide");
  menu.classList.add("hide");  
};

const isAutorized = () => {
  const logOut = (e) => {
    login = null;
    cart.length = 0;
    btnAuth.style.display = "";
    userName.style.display = "";
    btnLogOut.style.display = "";    
    cartButton.style.display = "";
    btnLogOut.removeEventListener("click", logOut);    
    localStorage.removeItem("userName");
    checkAuth();
    returnMain();
  };

  userName.textContent = login;

  btnAuth.style.display = "none";
  userName.style.display = "inline";
  btnLogOut.style.display = "flex";
  cartButton.style.display = "flex";
  btnLogOut.addEventListener("click", logOut);
  loadCart();
};

const maskInput = (string) => {
  return !!string.trim();
};

const isNotAutorized = () => {
  const logIn = (e) => {    
    e.preventDefault();
    login = loginInput.value;     
    if(valid(login)) {
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

  };

  btnAuth.addEventListener("click", toggleModalAuth);
  closeAuth.addEventListener("click", toggleModalAuth);
  logInForm.addEventListener("submit", logIn);
};

const checkAuth = () => login ? isAutorized() : isNotAutorized();

const createCardRestaurant = (restaurant) => {

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
};

const createCardGood = ({ description, image, name, price, id }) => {

  const card = document.createElement("div");
  card.className = "card"; 
  //card.id = id;
  card.insertAdjacentHTML("beforeend", `
    <img src="${image}" alt="${name}" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart" id="${id}">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold"> ${price} ₽</strong>
      </div>
    </div>
  `);

  cardsMenu.insertAdjacentElement("beforeend", card);

};

const openGoods = (e) => {
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
      getData(`./db/${restaurant.dataset.products}`)
      .then((data) => {
        data.forEach(createCardGood);
      });
    } else {
        toggleModalAuth()
    }
  }
};

const addToCart = (e) => {
  const target = e.target;
  const buttonAddToCart = target.closest(".button-add-cart");

  if(buttonAddToCart) {
    const card = target.closest(".card");
    const title = card.querySelector(".card-title").textContent;
    const cost = card.querySelector(".card-price").textContent;
    const id = buttonAddToCart.id;
    const food = cart.find((item) => {
      return item.id === id;
    })

    if(food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,    
        count: 1  
      })
    }
  }
  saveCart();
};


const renderCart = () => {
  modalBody.textContent = ""; 
  cart.forEach(function({ id, title, cost, count }) {
    const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id=${id}>-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id=${id}>+</button>
        </div>
      </div>   
    `;
    modalBody.insertAdjacentHTML("beforeend", itemCart);
  });
  const totalPrice = cart.reduce(function(result, item) {
    return result + (parseFloat(item.cost) * item.count);
  }, 0);

  modalPrice.textContent = totalPrice + " ₽";
};

const changeCount = (e) => {
  const target = e.target;
  if(target.classList.contains("counter-button")) {
    const food = cart.find(function(item) {
      return item.id === target.dataset.id;
    });
    if(target.classList.contains("counter-minus")) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }

    if(target.classList.contains("counter-plus")) {
      food.count++;
    }    
    renderCart();
  }
  saveCart();
};

function init() {
  getData('./db/partners.json').then((data) => {
    data.forEach(createCardRestaurant);    
  });
  
  cardsRestaurants.addEventListener("click", openGoods);
  
  cartButton.addEventListener("click", renderCart);
  cartButton.addEventListener("click", toggleModal);

  buttonClearCart.addEventListener("click", () => {
    cart.length = 0;
    renderCart();
  })

  modalBody.addEventListener("click", changeCount);
  cardsMenu.addEventListener("click", addToCart);
  close.addEventListener("click", toggleModal);
  logo.addEventListener("click", returnMain);

  inputSearch.addEventListener('keydown', (e) => {
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
      getData('./db/partners.json')
        .then((data) => {
          const products = data.map((item) => {
            return item.products;
          });    
          products.forEach((product) => {
            getData('./db/' + product).then((data) => {
              goods.push(...data);
              const searchGoods = goods.filter((item) => {
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
            .then((data) => {
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