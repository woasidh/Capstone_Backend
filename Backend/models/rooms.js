const { Schema, model } = require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const lectureSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    ave_attendance: { type: Number },
    subject: {
        type: Number,
        ref: 'subject'
    }
});

const subjectSchema = new Schema({
    subject_name: {
        type: String,
        required: true
    },
    professor: {
        type: Number,
        ref: 'Professor',
        required: true
    },
    time: [{ type: Date, required: true }],
    lectures: [{ type: Number, ref: 'lecture' }],
    students: [{ type: Number, ref: 'student' }]
});

lectureSchema.plugin(mongooseAutoInc.plugin, 'lecture');
subjectSchema.plugin(mongooseAutoInc.plugin, 'subject');

const lectureModel = model('lecture', lectureSchema);
const subjectModel = model('subject', subjectSchema);

module.exports = {
    lecture: lectureModel,
    subject: subjectModel
};