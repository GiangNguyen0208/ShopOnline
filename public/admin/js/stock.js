
const buttonPostForSale = document.querySelectorAll("[button-post-sale]");
if (buttonPostForSale) {
    const formPostSale = document.querySelector("#form-post-sale");
    const path = formPostSale.getAttribute("data-path");

    buttonPostForSale.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Are you sure to Post for sale this item ?")

            if(isConfirm) {
                button.disabled = true; // Vô hiệu hóa nút để tránh gửi nhiều lần
                const id = button.getAttribute("data-id");
                const action = path + `/${id}?_method=PATCH`;
                formPostSale.action = action;
                formPostSale.submit();
            } else {
                alert("You have cancelled the action !!!");
            }
        });
    });
}


// DELETE BUTTON PRODUCTS
const buttonDeletdProduct = document.querySelectorAll("[button-delete-product]")
if (buttonDeletdProduct) {
    const formDeleteProduct = document.querySelector("#form-delete-product");
    const path = formDeleteProduct.getAttribute("data-path");
    
    buttonDeletdProduct.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Are you sure that You want to delete this item out of database !?");

            if(isConfirm) {
                button.disabled = true; 
                const id = button.getAttribute("data-id"); 
                const action = path + `/${id}?_method=DELETE`; 
                formDeleteProduct.action = action;
                formDeleteProduct.submit();
            } else {
                alert("You have cancelled the action !!!");
            }
        })
    })
}
// END

// FORM SUBMIT NUMBER EQUAL 0
document.getElementById('productForm').addEventListener('submit', (e) => {
    const price = document.getElementById('price').value;
    const discount = document.getElementById('discount').value;
    const stocks = document.getElementById('stocks').value;

    if (price == 0 || discount == 0 || stocks == 0) {
        alert('Price, discount, and stocks must be greater than 0.');
        e.preventDefault();
    }
});

// SORT PRICE, TITLE, POSITION
const sort = document.querySelector("[sort]");
if (sort) {
    let url = new URL(window.location.href);

    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");

    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value
        const [sortKey, sortValue] = value.split("-");

        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

        window.location.href = url.href;

    });

    // DELETE ARRANGE
    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");

        window.location.href = url.href;
    }) 
    // END DELETE ARRANGE

    // ADD SELECT 
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");

    if (sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
        optionSelected.selected = true;
    }
    // END ADD SELECT
}
// END SORT PRICE, TITLE, POSITION