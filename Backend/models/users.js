const { Schema, model } = require('mongoose');

const professorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true
    }
});

const studentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true
    }
});

const professorModel = model('Professor', professorSchema);
const studentModel = model('Student', studentSchema);

module.exports = {
    Professor: professorModel,
    Student: studentModel
};
