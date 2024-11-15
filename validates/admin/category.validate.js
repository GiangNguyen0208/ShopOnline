module.exports.createPost = (req, res, next) => {
    if (!req.body.name) {
      req.flash("error", "Name is required.");
      res.redirect("back");
      return;
    }
    next();
}