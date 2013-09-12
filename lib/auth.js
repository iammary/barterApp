var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var Schema = require('../lib/schema');

var auth = function() {
	// Passport session setup.
	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  Schema.User.findById(id, function (err, user) {
	    done(err, user);
	  });
	});

	// Use the LocalStrategy within Passport.
	passport.use(new LocalStrategy(function(username, password, done) {
	  Schema.User.findOne({ username: username }, function(err, user) {
	    if (err) { return done(err); }
	    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
	    user.comparePassword(password, function(err, isMatch) {
	      if (err) return done(err);
	      if(isMatch) {
	        return done(null, user);
	      } else {
	        return done(null, false, { message: 'Invalid password' });
	      }
	    });
	  });
	}));
}

exports.auth = auth;

// Simple route middleware to ensure user is authenticated.
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}