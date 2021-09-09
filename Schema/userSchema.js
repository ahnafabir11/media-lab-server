const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    fullname: {
        type: String,
        min: 6,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        min: 6,
        required: true,
    },
    profileImg: {
        type: Object,
    },
    joiningDate: {
        type: Date,
        default: new Date(),
    },
    chips: {
        type: Number,
        default: 0,
    },
    followers: {
        type: Array,
        default: [],
    },
    following: {
        type: Array,
        default: [],
    },
    social: {
        type: Object,
        default: {
            fbLink: '',
            igLink: '',
        }
    }
})

const UserModel = model('all_users', userSchema);

module.exports = UserModel;