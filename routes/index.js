var passport = require('passport'), 
	LocalStrategy = require('passport-local').Strategy,
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10;

var Schema = require('../lib/schema');

var Item = Schema.Item;

exports.index = function(req, res){ 
	var myitems;
	Item.find(function(err, items)
	{
		if(err) throw err;
		
		myitems = items;
		console.log(myitems);
		res.render('index', { user: req.user, pageTitle: 'A Simple Nodejs Login App',  items: myitems});
	})
	
}

exports.account = function(req, res){
	myname = req.user.name;
	myemail = req.user.email;
	myusername = req.user.username;
	res.render('account', { user: req.user, pageTitle: 'Account' , 
							myname: myname, myemail: myemail, 
							myusername: myusername, disabled: true,
							heading2: 'Update Profile Information'});
	console.log(req.user.username);
}

exports.login = function(req, res){
	res.render('login', { user: req.user, message: req.session.messages, pageTitle: 'Welcome'});
}

exports.signup = function(req, res) {
	if(req.user)  req.logout();
	res.render('account', { user: req.user, pageTitle: 'Sign Up', myname: '', 
							myemail: '', myusername: '', disabled: false, 
							heading2: 'Please tell us a little about yourself' });
}

exports.barter = function(req, res){ 
	myname = req.user.name;
	res.render('barter', { user: req.user, pageTitle: 'Barter Now!', disabled: true, myname: myname});
}

exports.about = function(req, res){ 
	var dis = false;
	if (req.user) {
		dis = true;
	};
	res.render('about', { pageTitle: 'About BarterApp', disabled: dis, content: ''});
}

exports.errorpage = function(req, res){ 
	var dis = false;
	if (req.user) {
		dis = true;
	};
	res.render('about', { pageTitle: 'Error', disabled: dis, content: 'Page not found!'});
}

exports.loginpost = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) { return next(err) }
		if (!user) {
		  req.session.messages =  [info.message];
		  return res.redirect('/login')
		}
		req.logIn(user, function(err) {
		  if (err) { return next(err); }
		  return res.redirect('/account');
		});
	})(req, res, next);
}

exports.signuppost = function(req, res, next) {
	var user = new Schema.User({ username: req.param('username') , email: req.param('email') , password: req.param('password') , name: req.param('name') });
	user.save(function(err) {
	if(err) {
	  console.log(err);
	} else {
	  console.log('user: ' + user.username + " saved.");
	  res.redirect('/login');
	}
	});
}

exports.barterpost = function(req, res, next) {
	meetuploc = req.param('pmeetup').split('|');
	for (i = 0; i < meetuploc.length; i++)
    	meetuploc[i] = meetuploc[i].trim();
	tags = req.param('ptags').split(',');
	for (i = 0; i < tags.length; i++)
    	tags[i] = tags[i].trim();
	myname = req.user.username;
	var item = new Item({itemname: req.param('itemname'), description: req.param('itemdescription'), meetuploc: meetuploc, tags: tags, user: myname });
	item.save(function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log('Item: ' + item.itemname + ' added to collection');
			res.redirect('/');
		}
	})
}

exports.accountpost = function(req, res, next) {
	condition = {username: req.user.username};
	update = { email: req.param('email'), name: req.param('name')};

	Schema.User.update(condition, update, function(err) {
	if(err) {
	  console.log(err);
	} else {
	  console.log('user: ' + req.user.username + " updated.");
	}
	});
	res.redirect('/');
}

exports.logout = function(req, res){
	req.logout();
	console.log(req.user);
	res.redirect('/');
}