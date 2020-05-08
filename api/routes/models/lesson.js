const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Subject: {type: mongoose.Schema.Types.ObjectId , ref: 'Subject', required: true},
    level: {type: Number, default: 1}
});

module.exports = mongoose.model('Lesson', lessonSchema);