// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userProfile = mongoose.Schema({
    user_uni: String,
    user_profile_grade: String,
    user_profile_description: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User_profile', userProfile);
