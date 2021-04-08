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
    name: {
        type: String,
        required: true
    },
    professor: {
        type: Number,
        ref: 'user',
        required: true
    },
    start_period: {
        type: Date,
        required: true
    },
    end_period: {
        type: Date,
        required: true
    },
    start_time: [{ type: String }],
    end_time: [{ type: String }],
    days: [{ type: String }],
    code: { 
        type: String,
        required: true
    },
    lectures: [{ type: Number, ref: 'lecture' }],
    students: [{ type: Number, ref: 'user' }]
});

lectureSchema.plugin(mongooseAutoInc.plugin, 'lecture');
subjectSchema.plugin(mongooseAutoInc.plugin, 'subject');

const lectureModel = model('lecture', lectureSchema);
const subjectModel = model('subject', subjectSchema);

module.exports = {
    Lecture: lectureModel,
    Subject: subjectModel
};