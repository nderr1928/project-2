const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	name: {type: String, required: true},
	displayName: {type: String, required: true},
	profilePic: String,
	location: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
	isOrganizer: {type: Boolean, required: true},
	events: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Event'
	}]
});

const User = mongoose.model('User', userSchema);


module.exports = User;