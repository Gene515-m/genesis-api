"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // Retrieve cart items from local storage, or initialize an empty array if there are none
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartListCounter = document.querySelector(".badge"); // Counter for displaying number of items in cart
  const cartElement = document.querySelector("tbody"); // Cart table body element
  // const popoverEl = document.getElementById("popover");

  let cartItemList = document.getElementById("listItemCart"); // List of items in the cart
  let totalElements = document.getElementById("totalPrice"); // Total price element

  // const emptyListItem = document.getElementById("emptyListItem");
  // const emptyAll = document.getElementById("emptyAll");

  const emptyCartDisplay = document.getElementById("displayEmptyCart"); // Element to display when cart is empty
  const addToCartAlert = document.getElementById("alertAdd"); // Alert to display when item is added to cart

  const cardsContainer = document.getElementById("resultPrdcts"); // Container for product cards
  // Token for authorization
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM5ZTI2ZGQ2MzdmMzAwMTVhZGJmNTgiLCJpYXQiOjE3MTUwNzQwOTksImV4cCI6MTcxNjI4MzY5OX0.URjCzTAFoNKcukg_BOJT_yqvmcwTHooEvqu3kFx4xqg";
  //Display Html card
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
    // Insert the card HTML into the cards container
    cardsContainer.insertAdjacentHTML("beforeend", cardHtml);
  };
  // Fetch product data from the API
  const getData = () => {
    fetch("https://striveschool-api.herokuapp.com/api/product/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        data.forEach((post) => {
          // Display each product card
          displayCard(post);
        });
      })
      .catch((error) => {
        console.error("❌Problem with the fetch operation:", error);
      });
  };
  // Fetch product data when the DOM content is loaded
  getData();
  //Update the cart counter display
  const updateCartCounter = () => {
    const cartListModal = document.getElementById("cartListModal");
    cartListCounter.textContent = cartItems.length;
    // Display appropriate elements based on cart items existence
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
  //Add an item to the cart
  const addItemToCart = (name, price) => {
    cartItems.push({ name, price });
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartCounter();
    addToCartAlert.classList.remove("d-none");
    renderCart();
    // updateTotal();
  };

  //Render List in the cart
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
      // Insert the item HTML into the cart Modal(Bootstrap)
      cartElement.insertAdjacentHTML("beforeend", cartItemList);
    });
  };

  // Event listener for adding items to cart
  cardsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("addToCart")) {
      const card = event.target.closest(".card");
      const title = card.querySelector(".card-text").textContent;
      const price = parseFloat(
        card.querySelector(".list-group-item:nth-child(1)").textContent.slice(1)
      );
      addItemToCart(title, price);
    }
  });
  // Initial update of the cart counter and rendering of the cart
  updateCartCounter();
  renderCart();
});
