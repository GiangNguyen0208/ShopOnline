// Button status
const buttonStatus = document.querySelectorAll("[button-status]");
if(buttonStatus.length > 0) {
    let url = new URL(window.location.href);

    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            
            if(status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
                
            }        
            window.location.href = url.href;
        });
    });
}
// End Button Status


// Form Search
const formSearch = document.querySelector("#form-search");
if(formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        if(keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }    
        window.location.href = url.href;
        
    });
}
// End Form Search


// Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
    if(buttonPagination) {
        let url = new URL(window.location.href);

        buttonPagination.forEach(button => {
            button.addEventListener("click", () => {
                const page = button.getAttribute("button-pagination");
                
                url.searchParams.set("page", page);
               
                window.location.href = url.href;
            });
        });
    }
// END Pagination


// CheckBox
const checkBoxMulti = document.querySelector("[checkbox-multi]");
    if(checkBoxMulti) {
        const inputCheckAll = checkBoxMulti.querySelector("input[name='checkall']");
        const inputsId = checkBoxMulti.querySelectorAll("input[name='id']");
        // Select ALL checkbox
        inputCheckAll.addEventListener("click", () => {
            if (inputCheckAll.checked) {
                inputsId.forEach(inputCheckBox => {
                    inputCheckBox.checked = true;
                })
            } else {
                inputsId.forEach(inputCheckBox => {
                    inputCheckBox.checked = false;
                })
            }
        });    
        // Select a checkbox
        inputsId.forEach(inputCheckBox => {
            inputCheckBox.addEventListener("click", () => {
            const countChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked").length;
            const inputLength = inputsId.length;
            if (countChecked == inputLength) {
                inputCheckAll.checked = true;
            } else {
                checkBoxMulti.checked = false;
            }
            });
        });
    }
// END CheckBox


// Form Change Multi
const  formChangeMulti = document.querySelector("[form-change-multi]");
    if (formChangeMulti) {
        formChangeMulti.addEventListener("submit", (e) => {
            e.preventDefault();

            const checkBoxMulti = document.querySelector("[checkbox-multi]");
            const inputChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked");

            if (inputChecked.length == 0) {
                alert("Vui lòng chọn 1 sản phẩm để thực hiện hành động !!!");
            } else {
                let ids = [];
                const inputIds = document.querySelector("input[name='ids']");

                inputChecked.forEach(input => {
                    const id = input.getAttribute("value");
                    ids.push(id);
                });
                
                inputIds.value = ids.join(", ");
            }
            
            formChangeMulti.submit();
        });
    }
// END Form Change Multi













