const { Schema, model } = require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const quizSchema = new Schema({
    name: { type: String, required: true },
    subject: { type: Number, ref: 'subject' },
    date: { type: Date },
    deadLine: { type: Date },
    answerSheets: [{
        question: { type: String },
        answer: { type: String },
        points: { type: Number }
    }],
    status: { type: String },
    type: { type: String, required: true },
    responses: [{
        date: { type: Date },
        student: { type: Number, ref: 'user' },
        response: [{
            answer: { type: String },
            correctness: { type: Boolean }
        }],
        score: { type: Number }
    }]
});

const questionSchema = new Schema({
    lecture: { type: Number, ref: 'lecture' },
    // subject: { type: Number, ref: 'subject' },
    questioner: { type: String },
    questionContent: { type: String, required: true },
    answers: [{
        respondent: { type: String },
        content: { type: String, required: true }
    }]
});

// const chattingSchema = new Schema({
//     lecture: { type: Number, ref: 'lecture' },
//     user: { type: Number, ref: 'user' },
//     content: { type: String, required: true }
// });

const understandingProSchema = new Schema({
    type: { type: String, required: true },
    name: { type: String },
    date: { type: Date },
    deadLine: { type: Date },
    status: { type: String },
    lecture: { type: Number, ref: 'lecture' },
    responses: [{
        student: { type: Number, ref: 'user' },
        response: { type: String },
        date: { type: Date }
    }]
});

const understandingStuSchema = new Schema({
    student: { type: Number, ref: 'user' },
    lecture: { type: Number, ref: 'lecture' },
    response: { type: Boolean },
    hours: { type: Number },
    minutes: { type: Number }
})

const subtitleSchema = new Schema({
    lecture: { type: Number, ref: 'lecture' },
    contents: [{
        content: { type: String },
        time: { type: String }
    }]
});

const noticeSchema = new Schema({
    subject: { type: Number, ref: 'subject' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date },
    comments: [{
        user: { type: Number, ref: 'user' },
        content: { type: String },
        date: { type: Date }
    }],
    emotions: [{
        user: { type: Number, ref: 'user' },
        emotion: { type: String, required: true }
    }]
});

const lectureNoteSchema = new Schema({
    subject: { type: Number, ref: 'subject' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    fileURL: { type: String },
    date: { type: Date },
    comments: [{
        user: { type: Number, ref: 'user' },
        content: { type: String },
        date: { type: Date }
    }],
    emotions: [{
        user: { type: Number, ref: 'user' },
        emotion: { type: String }
    }]
});

const assignmentSchema = new Schema({
    subject: { type: Number, ref: 'subject' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    fileURL: { type: String },
    comments: [{
        user: { type: Number, ref: 'user' },
        content: { type: String },
        date: { type: Date }
    }],
    emotions: [{
        user: { type: Number, ref: 'user' },
        emotion: { type: String, required: true }
    }],
    deadline: { type: Date },
    date: { type: Date },
    submission: [{
        user: { type: Number, ref: 'user' },
        fileURL: { type: String },
        content: { type: String },
        date: { type: Date }
    }]
});

const scheduleSchema = new Schema({
    user: { type: Number, ref: 'user' },
    contents: [{
        type: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        status: { type: String },
        URL: { type: String }
    }]
});

const recordSchema = new Schema({
    lecture: { type: Number, ref: 'lecture' },
    fileURL: { type: String }
});

quizSchema.plugin(mongooseAutoInc.plugin, 'quiz');
questionSchema.plugin(mongooseAutoInc.plugin, 'question');
// chattingSchema.plugin(mongooseAutoInc.plugin, 'chatting');
understandingProSchema.plugin(mongooseAutoInc.plugin, 'understandingPro');
understandingStuSchema.plugin(mongooseAutoInc.plugin, 'understandingStu');
subtitleSchema.plugin(mongooseAutoInc.plugin, 'subtitle');
noticeSchema.plugin(mongooseAutoInc.plugin, 'notice');
lectureNoteSchema.plugin(mongooseAutoInc.plugin, 'lectureNote');
assignmentSchema.plugin(mongooseAutoInc.plugin, 'assignment');
scheduleSchema.plugin(mongooseAutoInc.plugin, 'schedule');
recordSchema.plugin(mongooseAutoInc.plugin, 'record');

const quizModel = model('quiz', quizSchema);
const questionModel = model('question', questionSchema);
// const chattingModel = model('chatting', chattingSchema);
const understandingProModel = model('understandingPro', understandingProSchema);
const understandingStuModel = model('understandingPro', understandingStuSchema);
const subtitleModel = model('subtitle', subtitleSchema);
const noticeModel = model('notice', noticeSchema);
const lectureNoteModel = model('lectureNote', lectureNoteSchema);
const assignmentModel = model('assignment', assignmentSchema);
const scheduleModel = model('schedule', scheduleSchema);
const recordModel = model('record', recordSchema);

module.exports = {
    Quiz : quizModel,
    Question : questionModel,
    // Chatting : chattingModel,
    UnderstandingPro : understandingProModel,
    UnderstandingStu : understandingStuModel,
    Subtitle : subtitleModel,
    Notice : noticeModel,
    LectureNote : lectureNoteModel,
    Assignment : assignmentModel,
    Schedule : scheduleModel,
    Record : recordModel
};