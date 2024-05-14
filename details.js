"use strict";

const cardsContainer = document.getElementById("resultDtl"); // Container for details
// Token for authorization
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM5ZTI2ZGQ2MzdmMzAwMTVhZGJmNTgiLCJpYXQiOjE3MTUwNzQwOTksImV4cCI6MTcxNjI4MzY5OX0.URjCzTAFoNKcukg_BOJT_yqvmcwTHooEvqu3kFx4xqg";
//Display Html card

//  Get URL parameter by name
const getUrlParameter = (name) => {
  name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
};

// Fetch product data from the API and filter by ID
const getData = (productId) => {
  fetch(`https://striveschool-api.herokuapp.com/api/product/${productId}`, {
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
    .then((product) => {
      console.log(product);
      displayDetail(product);
    })
    .catch((error) => {
      console.error("❌Problem with the fetch operation:", error);
    });
};

// Display product details
const displayDetail = (detail) => {
  const cardHtml = `
  <div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
    <div class="col p-4 d-flex flex-column position-static">
      <strong class="d-inline-block mb-2 text-white-emphasis">${detail.brand}</strong>
      <h3 class="mb-0">${detail.name}</h3>
      <div class="mb-1 text-white">${detail.updatedAt}</div>
      <p class="card-text mb-auto">${detail.description}</p>
      <a href="#" class="icon-link gap-1 icon-link-hover stretched-link">
        Continue reading
        <svg class="bi"><use xlink:href="#chevron-right"></use></svg>
      </a>
    </div>
    <div class="col-2">
      <img src="${detail.imageUrl}" class="img-fluid" alt="${detail.name}" />
    </div>
  </div>
  `;
  // Insert the card HTML into the cards container
  cardsContainer.innerHTML = cardHtml;
};

// Get product ID from URL parameter
const productId = getUrlParameter("id");

// Fetch product data when the DOM content is loaded
getData(productId);
