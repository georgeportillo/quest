// config/auth.js
var FACEBOOK_APP_ID = "1483504451894458"
var FACEBOOK_APP_SECRET = "047d89813450a2de9914204b2f3aede4";
// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: FACEBOOK_APP_ID, // your App ID
		'clientSecret' 	: FACEBOOK_APP_SECRET, // your App Secret
		'callbackURL' 	: 'http://platformquest.herokuapp.com/auth/facebook/callback'
	},
	

	'twitterAuth' : {
		'consumerKey' 		: 'VlIQM9fhmCLe1XJiIMscsdlaz',
		'consumerSecret' 	: 'Ezxb6pRFhYmNYn2FGX9PQg2DF8XdTTiG9VDENBOt9tDHu0thq8',
		'callbackURL' 		: 'http://platformquest.herokuapp.com/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: 'your-secret-clientID-here',
		'clientSecret' 	: 'your-client-secret-here',
		'callbackURL' 	: 'http://localhost:8080/auth/google/callback'
	}

};