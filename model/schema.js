const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const passwordSchema = new Schema({
    name: String,
    url: String,
    username: String,
    password: String
})

const Pass = mongoose.model('passwords', passwordSchema)

module.exports = Pass

