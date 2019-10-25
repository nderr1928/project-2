const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
	name: {type: String, required: true}, 
	location: {type: String, required: true},
	date: {type: Date, required: true},
	time: {type: Date, required: true},
	eventPic: String,
	description: String,
	attendees: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}]
});



const Event = mongoose.model('Event', eventSchema);

module.exports = Event;