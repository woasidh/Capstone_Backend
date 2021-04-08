const { Schema, model } = require('mongoose');

const roomSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    
});

const roomModel = model('room', roomSchema);

module.exports = {
    Room : roomModel
};