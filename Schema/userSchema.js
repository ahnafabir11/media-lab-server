const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    fullname: {
        type: String,
        min: 6,
        max: 6,
        required: true
    },
    email: String,
    phoneNumber: Number,
    password: String,
    confirmPassword: String,
})

const UserModel = model('all_users', userSchema);

module.exports = UserModel;