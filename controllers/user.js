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
		const foundUser = User.findById(req.params.id)
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
		const foundUser = await User.findById(req.params.body);
		if(foundUser.isOrganizer === true){
			// need to delete all the created events
				//go into those deleted event sand find all the attendees
					//delete the deleted event(s) from those attendees "attending events" array
			// delete the user from database
			// reroute to the main index page
			res.redirect('/');
		} else{
			// go into all events attending and remove them from those events attendees list
			const userEventsAttending = foundUser.attendingEvents;
			console.log("Events the deleted user was going to attend:", userEventsAttending);
			for(let i = 0; i < userEventsAttending.length; i++){
				console.log("finding event id:", userEventsAttending[i])
				let foundEvent = await Event.findById(userEventsAttending[i]);
				console.log("event found:",foundEvent.attendees)
				await foundEvent.attendees.findManyAndRemove({id: req.params.id});
				console.log("attendee removed:", foundEvent.attendee);
				await foundEvent.save();
				console.log("event updated");
			}
			//delete the user
			console.log("deleting user");
			await foundUser.remove();
			console.log("user deleted");
			res.redirect('/');
		}
	} catch(err){
		res.send(err);
	}
})


module.exports = router;

