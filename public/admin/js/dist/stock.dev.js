"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
}); // SORT PRICE, TITLE, POSITION

var sort = document.querySelector("[sort]");

if (sort) {
  var url = new URL(window.location.href);
  var sortSelect = sort.querySelector("[sort-select]");
  var sortClear = sort.querySelector("[sort-clear]");
  sortSelect.addEventListener("change", function (e) {
    var value = e.target.value;

    var _value$split = value.split("-"),
        _value$split2 = _slicedToArray(_value$split, 2),
        sortKey = _value$split2[0],
        sortValue = _value$split2[1];

    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);
    window.location.href = url.href;
  }); // DELETE ARRANGE

  sortClear.addEventListener("click", function () {
    url.searchParams["delete"]("sortKey");
    url.searchParams["delete"]("sortValue");
    window.location.href = url.href;
  }); // END DELETE ARRANGE
  // ADD SELECT 

  var sortKey = url.searchParams.get("sortKey");
  var sortValue = url.searchParams.get("sortValue");

  if (sortKey && sortValue) {
    var stringSort = "".concat(sortKey, "-").concat(sortValue);
    var optionSelected = sortSelect.querySelector("option[value='".concat(stringSort, "']"));
    optionSelected.selected = true;
  } // END ADD SELECT

} // END SORT PRICE, TITLE, POSITION