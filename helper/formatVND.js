module.exports.numberFormatter = function() {
    // Forrmat VND
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });
};