// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var lessonSchema = mongoose.Schema({
    lesson_title: String,
    lesson_description: String,
    lesson_time: {
        type: Date, 
        default: Date.now
    }, 
    lesson_teacher: mongoose.Schema.Types.ObjectId,
    lesson_class: mongoose.Schema.Types.ObjectId
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Lesson', lessonSchema);
