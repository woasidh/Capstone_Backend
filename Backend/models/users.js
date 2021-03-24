const { Schema, model } = require('mongoose');

const professorSchema = new Schema({
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
    professorID: {
        type: String,
        required: true
    },
    major: {
        type: String,
        required: true
    },
    subjects: [{ type: Number, ref: 'subject' }]
});

const studentSchema = new Schema({
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
    studentID: {
        type: String,
        required: true
    },
    major: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        required: true
    },
    subjects: [{ type: Number, ref: 'subject' }]
});

const professorModel = model('Professor', professorSchema);
const studentModel = model('Student', studentSchema);

module.exports = {
    Professor: professorModel,
    Student: studentModel
};
