const { Schema, model } = require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const professorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});

const studentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
});

professorSchema.plugin(mongooseAutoInc.plugin, 'Professor');
studentSchema.plugin(mongooseAutoInc.plugin, 'Student');

const professorModel = model('Professor', professorSchema);
const studentModel = model('Student', studentSchema);

module.exports = {
    Professor: professorModel,
    Student: studentModel
};
