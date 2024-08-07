const mongoose = require("mongoose");

module.exports.connect = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URL);
        console.log("Connect Database Success !!!");
    } catch (error) {
        console.log("Connect Database Fail !!!");
    }
}
