const { Schema, model } = require('mongoose')


const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'The name is required']
    },
    email: {
        type: String,
        required: [true, 'The email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'The password is required']
    },
})


UserSchema.methods.toJSON = function () {
    const { __v, password, ...user } = this.toObject()
    return user
}


module.exports = model('usuario', UserSchema)