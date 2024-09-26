"use strict";

var buttonPostForSale = document.querySelectorAll("[button-post-sale]");

if (buttonPostForSale) {
  var formPostSale = document.querySelector("#form-post-sale");
  var path = formPostSale.getAttribute("data-path");
  buttonPostForSale.forEach(function (button) {
    button.addEventListener("click", function () {
      var isConfirm = confirm("Are you sure to Post for sale this item ?");

      if (isConfirm) {
        button.disabled = true; // Vô hiệu hóa nút để tránh gửi nhiều lần

        var id = button.getAttribute("data-id");
        var action = path + "/".concat(id, "?_method=PATCH");
        formPostSale.action = action;
        formPostSale.submit();
      } else {
        alert("You have cancelled the action !!!");
      }
    });
  });
} // DELETE BUTTON PRODUCTS


var buttonDeletdProduct = document.querySelectorAll("[button-delete-product]");

if (buttonDeletdProduct) {
  var formDeleteProduct = document.querySelector("#form-delete-product");

  var _path = formDeleteProduct.getAttribute("data-path");

  buttonDeletdProduct.forEach(function (button) {
    button.addEventListener("click", function () {
      var isConfirm = confirm("Are you sure that You want to delete this item out of database !?");

      if (isConfirm) {
        button.disabled = true;
        var id = button.getAttribute("data-id");

        var action = _path + "/".concat(id, "?_method=DELETE");

        formDeleteProduct.action = action;
        formDeleteProduct.submit();
      } else {
        alert("You have cancelled the action !!!");
      }
    });
  });
} // END
// FORM SUBMIT NUMBER EQUAL 0


document.getElementById('productForm').addEventListener('submit', function (e) {
  var price = document.getElementById('price').value;
  var discount = document.getElementById('discount').value;
  var stocks = document.getElementById('stocks').value;

  if (price == 0 || discount == 0 || stocks == 0) {
    alert('Price, discount, and stocks must be greater than 0.');
    e.preventDefault();
  }
});