"use strict";

document.addEventListener("DOMContentLoaded", function () {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartListCounter = document.querySelector(".badge");
  const cartElement = document.querySelector("tbody");
  const popoverEl = document.getElementById("popover");

  let cartItemList = document.getElementById("listItemCart");
  let totalElements = document.getElementById("totalPrice");

  const emptyListItem = document.getElementById("emptyListItem");
  const emptyAll = document.getElementById("emptyAll");

  const emptyCartDisplay = document.getElementById("displayEmptyCart");
  const addToCartAlert = document.getElementById("alertAdd");

  const cardsContainer = document.getElementById("resultBooks");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM5ZTI2ZGQ2MzdmMzAwMTVhZGJmNTgiLCJpYXQiOjE3MTUwNzQwOTksImV4cCI6MTcxNjI4MzY5OX0.URjCzTAFoNKcukg_BOJT_yqvmcwTHooEvqu3kFx4xqg";
  //Struttura e inserimento card
  const displayCard = (post) => {
    const cardHtml = `
      <div class="col col-sm mt-3">
        <div class="card bg-transparent text-white shadow">
          <img src="${post.imageUrl}" class="img-fluid" alt="Product" />
          <div class="card-body bg-transparent text-white">
            <p class="card-text fw-bold">${post.brand} ${post.name}</p>
            <p class="card-text">${post.description}</p>
          </div>
          <ul class="list-group list-group-flush bg-transparent">
            <li class="list-group-item fw-2 bg-transparent text-white border-0 text-center fs-3">$${post.price}</li>
          </ul>
          <div class="d-grid card-body rounded-bottom-1">
            <button id="toastBtn" class="addToCart btn bg-gradient mb-1 text-white">Add to cart</button>
          </div>
        </div>
      </div>
    `;

    cardsContainer.insertAdjacentHTML("beforeend", cardHtml);
  };

  const getData = () => {
    fetch("https://striveschool-api.herokuapp.com/api/product/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok🍌");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        data.forEach((post) => {
          displayCard(post);
        });
      })
      .catch((error) => {
        console.error("❌Problem with the fetch operation:", error);
      });
  };

  getData();

  const updateCartCounter = () => {
    const cartListModal = document.getElementById("cartListModal");
    cartListCounter.textContent = cartItems.length;
    if (cartItems.length === 0) {
      emptyCartDisplay.classList.remove("d-none");
      cartListModal.classList.add("d-none");
      totalElements.classList.add("d-none");
    } else {
      emptyCartDisplay.classList.add("d-none");
      cartListModal.classList.remove("d-none");
      totalElements.classList.remove("d-none");
    }
  };

  const addItemToCart = (name, price) => {
    cartItems.push({ name, price });
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartCounter();
    addToCartAlert.classList.remove("d-none");
    renderCart();
    // updateTotal();
  };

  //List Cart Modal Bootstrap
  const renderCart = () => {
    cartElement.innerHTML = "";
    cartItems.forEach((item, index) => {
      cartItemList = `<tr>
        <td>${index + 1}</td>
        <td>$${item.price}</td>
        <td>${item.name}</td>
        <td>
          <div class="form-group row">
            <div class="col-md-8">
              <input type="number" class="item-count form-control pe-1" data-name="${
                item.name
              }" value="1">
            </div>
          </div>
        </td>
        <td>
          <button id="emptyListItem" class="delete-item btn btn-danger" data-name="${
            item.name
          }">X</button>
        </td>
      </tr>`;
      cartElement.insertAdjacentHTML("beforeend", cartItemList);
    });
  };

  // Add Cart
  cardsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("addToCart")) {
      const card = event.target.closest(".card");
      const title = card.querySelector(".card-text").textContent;
      const price = parseFloat(
        card.querySelector(".list-group-item:nth-child(2)").textContent.slice(1)
      );
      addItemToCart(title, price);
    }
  });

  updateCartCounter();
  renderCart();
});
