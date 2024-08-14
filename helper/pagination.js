module.exports = (productPagination, query, countProduct) => {    
    if(query.page) {
        productPagination.currentPage = parseInt(query.page);
    }

    productPagination.skip = (productPagination.currentPage - 1) * productPagination.limitItem;

    const pageNum = Math.ceil(countProduct / productPagination.limitItem);
    productPagination.pageNum = pageNum;

    return productPagination;
}