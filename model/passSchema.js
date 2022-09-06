const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const adminSchema = new Schema({
    client_id: String,
    password: String
})

const Admin = mongoose.model('admin_user', adminSchema)

module.exports = Admin

