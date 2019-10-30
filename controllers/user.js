const express = require('express');
const router = express.Router();
const Event = require('../models/events.js');
const User = require('../models/users.js');


//Index Route for users
router.get('/:id', async (req, res) =>{
	try{
		//User is found by their Id
		// console.log("populating attending routes");
		const foundUser = await User.findById(req.params.id) // find user id based on req/paras.id
			.populate({path: 'attendingEvents'}) //populate thier attendingEvents array
			.exec(); //execute population
		// console.log("check for profile type");
		if(foundUser.isOrganizer === true){ // check if user is an organizer or not
			//if organizer, populate the created events routes
			// console.log("populate organzier made events")
			const organizerUser = await User.findById(req.params.id)
				.populate({path: 'createdEvents'})
				.exec(); 
			// console.log("made events populated")
			// render the organizer index page with the populated variables and session ID
			res.render('organizers/index.ejs', {
				user: foundUser,
				organizer: organizerUser,
				userId: req.session.userId
			});
		} else {
		//If the found user is NOT registered as an organizer, 'attendingEvents' array is populated into 
		//user object and the attendees index.ejs is rendered. 	
		// console.log("attendee page loaded");	
		res.render('attendees/index.ejs', {
				user: foundUser,
				userId: req.session.userId
			})
		}
	} catch(err){
		res.send(err);
	}
});

//Show route
router.get('/:id/show', async (req, res) =>{
	try{
		const foundUser = await User.findById(req.params.id)
			.populate({path: 'attendingEvents'})
			.exec();
		if(foundUser.isOrganizer === true){ // check if user is an organizer or not
			//if organizer, populate the created events routes
			// console.log("populate organzier made events")
			const organizerUser = await User.findById(req.params.id)
				.populate({path: 'createdEvents'})
				.exec(); 
			// console.log("made events populated")
			// render the organizer index page with the populated variables and session ID
			res.render('organizers/show.ejs', {
				user: foundUser,
				organizer: organizerUser,
				userId: req.session.userId
			});
		} else {
		//If the found user is NOT registered as an organizer, 'attendingEvents' array is populated into 
		//user object and the attendees index.ejs is rendered. 	
		// console.log("attendee page loaded");	
		res.render('attendees/show.ejs', {
				user: foundUser,
				userId: req.session.userId
			})
		}
	} catch(err){
		res.send(err);
	}
});

//Edit Route
router.get('/:id/edit', async (req, res) =>{
	try{
		const foundUser = await User.findById(req.params.id);
		if(foundUser.isOrganizer === true){
			//if the user is an organizer, the organizer edit page will be rendered
			res.render('organizers/edit.ejs', {
				user: foundUser,
				userId: req.session.userId
				//foundUser will be defined as user in edit.ejs
			});
		} else {
			//if the user is not registered as an organizer, the attendee edit page will be rendered
			res.render('attendees/edit.ejs', {
				user: foundUser,
				userId: req.session.userId
				//foundUser will be defined as user in edit.ejs
			});
		}
	} catch(err) {
		res.send(err);
	}
});

//Put route for edit
router.put('/:id', async (req, res) =>{
	try{
		const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
		if(foundUser.isOrganizer === true){
			//if the updated user is an organizer, the user will be redirected to the organizer index page
			res.redirect('organizers/index.ejs');
		} else {
			//if the updated user is an attendees, the user will be redirected to the attendee index page
			res.redirect('attendees/index.ejs');
		}
	} catch(err){
		res.send(err);
	}
});

// Delete user route
router.delete('/:id', async (req, res) =>{
	try{
		const foundUser = await User.findById(req.params.id);
		if(foundUser.isOrganizer === true){
			const userCreatedEvents =  await foundUser.createdEvents;
			// find all the created events attendees, go into their attending arrays and remove the event from them
			for(let i = 0; i < userCreatedEvents.length; i++){
				let foundEvent = await Event.findById(userCreatedEvents[i]); // redefine cuurent event into a variable
				let eventAttendees = await foundEvent.attendees; // take the attendees array and store it in a new variable
				//itterate through the event attendees to get each user ID within
				for(let j = 0; j < eventAttendees.length; j++){
					let foundEventUser = await User.findById(eventAttendees[j]); // define the found user using the eventAttendee index
					//itterate through current users array to find an id that matches the events id
					for(let k = 0; k < foundEventUser.attendingEvents.length; k++){ 
						if(foundEventUser.attendingEvents[k].toString() == foundEvent._id.toString()){
							await founderUser.attendingEvents.splice(k, 1);
							k--;
						}
					}
					await foundEventUser.save(); // save the found user after removing the event from their attending
				}
				await Event.findByIdAndRemove(foundEvent); // delete the cuurent event in iteration from the database
			}
			await foundUser.remove();// delete the found user from the database
			// reroute to the main index page
			res.redirect('/'); // redirect to the home page
		} else{
			const userEventsAttending = foundUser.attendingEvents; // create an array with all the users event id's of what they wanted to attend
			// iterate through each event id from the userEventsAttending array
			for(let i = 0; i < userEventsAttending.length; i++){
				let foundEvent = await Event.findById(userEventsAttending[i]); // reassigns current userEvent to a found event 
				// iterate through the found event attendees array to search for the foundUser
				for(let j = 0; j < foundEvent.attendees.length; j++){
					if(foundEvent.attendees[j] == req.params.id){ // if the foundUSer id is found
						await foundEvent.attendees.splice(j, 1); // splice from the attendees array
						j--; // decrease the increment if a attednee is spliced
					}
				}
				await foundEvent.save(); // update the event
			}
			await foundUser.remove(); //remove user from the db
			res.redirect('/'); // redirect to the homepage
		}
	} catch(err){
		res.send(err);
	}
})


module.exports = router;

