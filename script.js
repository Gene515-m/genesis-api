"use strict";

const url = "https://striveschool-api.herokuapp.com/api/product/";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM5ZTI2ZGQ2MzdmMzAwMTVhZGJmNTgiLCJpYXQiOjE3MTUwNzQwOTksImV4cCI6MTcxNjI4MzY5OX0.URjCzTAFoNKcukg_BOJT_yqvmcwTHooEvqu3kFx4xqg";

const getApi = document.getElementById("getApi");
const prdctListWrapper = document.getElementById("prdctListWrapper");
const addPrdctBtn = document.getElementById("addPrdct");
const updatePrdctBtn = document.getElementById("updatePrdct");
const deletePrdctBtn = document.getElementById("deletePrdct");
const inputName = document.getElementById("inputName");
const inputDescription = document.getElementById("inputDescription");
const inputBrand = document.getElementById("inputBrand");
const inputUrl = document.getElementById("inputUrl");
const inputPrice = document.getElementById("inputPrice");
const dtaInput = document.getElementById("dta");

const clearInputFields = () => {
  inputName.value = "";
  inputDescription.value = "";
  inputBrand.value = "";
  inputUrl.value = "";
  inputPrice.value = "";
};

//GET request
const getClickHandler = async () => {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    console.log(data);

    // Clear previous list items
    prdctListWrapper.innerHTML = "";

    // Loop through the products and generate HTML for each
    data.forEach((product) => {
      const prdctItem = `
        <tr>
          <td>${product.name}</td>
          <td>${product.description}</td>
          <td>${product.brand}</td>
          <td><a href="${product.imageUrl}" target="_blank">Link</a></td>
          <td>${product.price}</td>
          <td>
            <button class="btn btn-outline-primary edit-btn" data-id="${product._id}"><i class="bi bi-pencil-square"></i></button>
          </td>
        </tr>`;
      prdctListWrapper.insertAdjacentHTML("afterbegin", prdctItem);
    });
  } catch (error) {
    console.error("Error:", error);
  }
};
//POST Request
const addPrdct = async () => {
  try {
    // Inputs
    const name = inputName.value;
    const description = inputDescription.value;
    const brand = inputBrand.value;
    const imageUrl = inputUrl.value;
    const price = inputPrice.value;

    // Creating new product object
    const newPrdct = { name, description, brand, imageUrl, price };

    // Sending POST request to add new product
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newPrdct),
    });

    // Checking if the request was successful
    if (!response.ok) {
      throw new Error("Failed to add product");
    }

    // Showing success message
    alert("Product added successfully");
    clearInputFields();
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to add product");
  }
};
//Product ID
const editPrdct = async (productId) => {
  try {
    // Clear input fields
    // clearInputFields();

    const response = await fetch(url + productId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch product data");
    }
    const productData = await response.json();
    inputName.value = productData.name;
    inputDescription.value = productData.description;
    inputBrand.value = productData.brand;
    inputUrl.value = productData.imageUrl;
    inputPrice.value = productData.price;
    dtaInput.value = productId;
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to fetch product data");
  }
};
//PUT REQUEST
const updatePrdct = async () => {
  try {
    const productId = dtaInput.value;
    const name = inputName.value;
    const description = inputDescription.value;
    const brand = inputBrand.value;
    const imageUrl = inputUrl.value;
    const price = inputPrice.value;

    const updatedEdtPrdct = { name, description, brand, imageUrl, price };

    const response = await fetch(url + productId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedEdtPrdct),
    });

    if (response.ok) {
      alert("Update Success");
      clearInputFields();
    } else {
      throw new Error("Failed to update product");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to update product");
  }
};

getApi.addEventListener("click", getClickHandler);
addPrdctBtn.addEventListener("click", addPrdct);

prdctListWrapper.addEventListener("click", (event) => {
  if (event.target.classList.contains("edit-btn")) {
    const productId = event.target.dataset.id;
    editPrdct(productId);
  }
});

updatePrdctBtn.addEventListener("click", updatePrdct);

// DELETE REQUEST
const deletePrdct = async () => {
  try {
    // Get the product ID from the input field
    const productId = dtaInput.value;

    // Send a DELETE request to the server
    const response = await fetch(url + productId, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if the request was successful
    if (response.ok) {
      // Display a success message /Bootstrap toast Popup
      alert("Product deleted successfully");

      // Clear input fields
      clearInputFields();

      // Call the getClickHandler function to refresh the product list
      getClickHandler();
    } else {
      // If the request fails, throw an error
      throw new Error("Failed to delete product");
    }
  } catch (error) {
    // If an error occurs, log the error and display an alert
    console.error("Error:", error);
    alert("Failed to delete product");
  }
};
// Event listener for the delete button
deletePrdctBtn.addEventListener("click", deletePrdct);

//Bootstrap Toast
const toastPops = (buttons) => {
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      let toast;
      switch (button.id) {
        case "addPrdct":
          toast = document.querySelector("#addPopup");
          console.log("Add OK");
          break;
        case "updatePrdct":
          toast = document.querySelector("#editPopup");
          console.log("Edit OK");
          break;
        case "deletePrdct":
          toast = document.querySelector("#deletePopup");
          console.log("Delete OK");
          break;
        default:
          return;
      }
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
      toastBootstrap.show();
    });
  });
};

const buttons = document.querySelectorAll(".controlButton");
toastPops(buttons);
