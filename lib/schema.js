var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10;

mongoose.connect('localhost', 'test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	console.log('Connected to DB');
});

exports.mongoose = mongoose;

// User Schema
var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  name: {type: String, required: true}
});

var itemSchema = mongoose.Schema ({
	itemname: { type: String, required: true},
	description: { type: String, required: true},
	meetuploc: { type: [String], required: true},
	tags: { type: [String], required: true},
	rating: { type: [rateSchema], require: false },
	user: {type: String, require: false}
});

var rateSchema = mongoose.Schema (
{
	rate: {type: Number, required:false }, 
	ratedby: {type: String, require:false }
});

// Bcrypt middleware
userSchema.pre('save', function(next) {
	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
};


var User = mongoose.model('User', userSchema);
exports.User = User;
var Item = mongoose.model('Item', itemSchema);
exports.Item = Item;
var Rate = mongoose.model('Rate', rateSchema);
exports.Rate = Rate;