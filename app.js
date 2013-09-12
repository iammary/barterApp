var express = require('express')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
  
var routes = require('./routes/index');
var Schema = require('./lib/schema');
  
var auth = require('./lib/auth');

auth.auth();

var app = express();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


app.get('/', auth.ensureAuthenticated, routes.index);

app.get('/account', auth.ensureAuthenticated, routes.account);

app.get('/login', routes.login);

app.get('/signup', routes.signup);

app.get('/barter', auth.ensureAuthenticated, routes.barter);

app.get('/about', routes.about);

app.post('/login', routes.loginpost);

app.post('/signup', routes.signuppost);

app.post('/barter', auth.ensureAuthenticated, routes.barterpost);

app.post('/account', routes.accountpost);

app.get('/logout', routes.logout);

app.use(routes.errorpage);

app.listen(3000, function() {
  console.log('Express server listening on port 3000');
});

