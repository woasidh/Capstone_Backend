const { Schema, model } = require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

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
});

userSchema.plugin(mongooseAutoInc.plugin, 'user');

const userModel = model('user', userSchema);

module.exports = {
    User: userModel,
};
