// [GET] /contact
module.exports.index = (req, res) => {
    res.render("client/pages/contact/index", {
        pageTitle: "Trang liên hệ"
    })
}