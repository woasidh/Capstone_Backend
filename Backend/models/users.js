const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    photourl: {
        type: String
    },
    school: {
        type: String,
        required: true
    },
    identityID: {
        type: String,
        required: true,
        unique: true
    },
    major: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    subjects: [{ type: Number, ref: 'subject' }]
})

const userModel = model('User', userSchema);

module.exports = {
    User: userModel,
};
