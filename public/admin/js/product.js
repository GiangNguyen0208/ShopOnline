// CHANGE STATUS
const buttonChangeStatus = document.querySelectorAll("[button-change-status]")
if(buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");

    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            let statusChange = (statusCurrent == "active") ? "inactive" : "active";

            const action = path + `/${statusChange}/${id}?_method=PATCH`;
            console.log(action);
            formChangeStatus.action = action;
            
            formChangeStatus.submit();
        });
    });
}
// END CHANGE STATUS

// DELETE PRODUCT
const buttonDeleteProduct = document.querySelectorAll("[button-delete-product]");
if(buttonDeleteProduct.length > 0) {
    const formDeleteProduct = document.querySelector("#form-delete-product");
    const path = formDeleteProduct.getAttribute("data-path");
    
    buttonDeleteProduct.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa không?");
            
            if(isConfirm) {
                const id = button.getAttribute("data-id");
                const action = path + `/${id}?_method=DELETE`;
                formDeleteProduct.action = action;
                formDeleteProduct.submit();
            } else {
                alert("Bạn đã hủy xóa sản phẩm")
            }
        });
    });
}
// END DELETE PRODUCT

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




