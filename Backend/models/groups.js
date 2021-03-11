const { Schema, model } = require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const lectureSchema = new Schema({
    Date: {
        type: Date,
        required: true
    }
});

const subjectSchema = new Schema({

});

lectureSchema.plugin(mongooseAutoInc.plugin, 'lecture');
subjectSchema.plugin(mongooseAutoInc.plugin, 'subject');

const lectureModel = model('lecture', lectureSchema);
const subjectModel = model('subject', subjectSchema);

module.exports = {
    lecture: lectureModel,
    subject: subjectModel
};