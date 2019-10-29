const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
	name: {type: String, required: true}, 
	location: {type: String, required: true},
	date: {type: String, required: true},
	time: {type: String, required: true},
	eventPic: String,
	description: String,
	attendees: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}]
});



const Event = mongoose.model('Event', eventSchema);

module.exports = Event;