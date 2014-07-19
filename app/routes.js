module.exports = function(app, passport) {

    var User = require('../app/models/user');
    var User_profile = require('../app/models/profile');
    var Lesson = require('../app/models/lessons');
    var mongoose = require('mongoose');

// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	app.get('/create-class', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	app.get('/profile-edit', isLoggedIn, function(req, res) {
		id = req.user._id;
	    var response = {
    		profile: {}
    	};

        User_profile.collection.findOne({'user_uni': id}, function(err, data) {
        	var response = {
        		profile: {}
        	};
        	response.user = req.user;
        	if (data != null && err == null) {
        		response.profile["user_profile_grade"] = data.user_profile_grade;
        		response.profile["user_profile_description"] = data.user_profile_description;
        	};
        	res.render('profile-edit', response);		
        });
	});

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
		id = req.user._id;
		User.findOne({'_id': id}, function(e, data) {
			if (data.twitter.user_info == 0) {
				res.render('login-accumulate.ejs', {
					user : req.user
				});
			} else if (data.profile_type == 0 || data.profile_type == 0 || data.profile_type == 0 || data.profile_type == 0) {
				res.render('login-choose.ejs', {
					user : req.user
				});
			} else {
				var profile_type = data.profile_type; // Set profile type from returned search
				req.user.profile_type = profile_type; // Set profile type into a variable

		        User_profile.collection.findOne({'user_uni': id}, function(err, data) {
		        	var response = {
		        		profile: {}
		        	};
		        	response.user = req.user;
		        	if (data != null && err == null) {
		        		response.profile["user_profile_grade"] = data.user_profile_grade;
		        		response.profile["user_profile_description"] = data.user_profile_description;
		        	};

		        	if (profile_type == 1) {
		        		res.render('profile-student', response);		
		        	} else {
		        		res.render('profile-teacher', response);
		        	}
		        

		        });
			};
		});
	});


	// process the login form
	app.post('/login-accumulate', isLoggedIn, function(req, res) {
		var id = req.user._id;
		var first_name   = req.body.first_name; // Set first name from request
		var last_name    = req.body.last_name; // Set last name from request
        var user_info    = 1; // Set 1 to signify that the user has now put their name in the database

        console.log(id);

        User.update( // Perform update on collection, to update one must specify the _id
            {_id: id}, { // Set the _if of which the following rows will be updated
        	$set: {
        		"twitter.user_info":  user_info, 
        		"twitter.first_name": first_name,
        		"twitter.last_name": last_name
        	}
        }, function(err, data) {
        	res.redirect('/profile');     	
        });
	});

	// process the login form
	app.post('/login-choose', isLoggedIn, function(req, res) {

		var id = mongoose.Types.ObjectId(req.user._id);
		var profile_type   = req.body.profile; // Set first name from request

        User.update( // Perform update on collection, to update one must specify the _id
            {_id: id}, { // Set the _if of which the following rows will be updated
        	$set: {
        		profile_type: profile_type
        	}
        }, function(err, data) {
        		console.log(err, data);
        		User_profile.collection.findOne({'user_uni': id}, function(err, data) {
		        	var response = {
		        		profile: {}
		        	};
		        	response.user = req.user;
		        	if (data != null && err == null) {
		        		response.profile["user_profile_grade"] = data.user_profile_grade;
		        		response.profile["user_profile_description"] = data.user_profile_description;
		        		response.user = req.user;
		        	};
		        	req.user.profile_type = profile_type; // Set names because the response does not   	
		        	res.redirect('/profile');	
		        });
        });

	});
	// process the login form
	app.post('/save_profile_data', isLoggedIn, function(req, res) {
		var id = req.user._id;
		//id = id.toString();
		var user_profile_grade   = req.body.user_profile_grade; // Set first name from request
		var user_profile_description    = req.body.user_profile_description; // Set last name from request

        User_profile.collection.update( // I did not have to specify a collection for this, for some reason
            {"user_uni": id}, {
                $set: {
                	user_profile_grade: user_profile_grade,
                	user_profile_description: user_profile_description
                }
            }, { upsert: true }, function(err, data) {
                console.log(err, data);
                if (err) {
                	res.json({
			            response: "Something went wrong. Try again."
			        });              	
                } else {
                	res.json({
			            response: "Profile updated successfully!"
			        });
                }
        });
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('login.ejs', { message: req.flash('loginMessage') });
		});

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('signup.ejs', { message: req.flash('signupMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------


		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',
			passport.authenticate('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('connect-local.ejs', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

		// handle the callback after twitter has authorized the user
		app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

		// the callback after google has authorized the user
		app.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', function(req, res) {
		var user            = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', function(req, res) {
		var user           = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// google ---------------------------------
	app.get('/unlink/google', function(req, res) {
		var user          = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
