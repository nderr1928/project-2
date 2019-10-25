const express = require('express');
const router = express.Router();
const Event = require('../models/events.js');
const User = require('../models/users.js');

//Index Route

router.get('/:id', async (req, res) =>{
	try{
		const foundUser = await User.findById(req.params.id);
		//grabs user by their id so that their unique data and load in the index page
		if(foundUser.isOrganizer === true){
			//if the user is an organizer, the organizer index page will render
			res.render('organizers/index.ejs', {
				user: foundUser
				//foundUser will be defined as user in index.ejs
			});
		} else {
//if the user is not registered as an organizer, the attendee index page will be rendered
			res.render('attendees/index.ejs', {
				user: foundUser
				//foundUser will be defined as user in index.ejs
			});
		}
	} catch(err){
		res.send(err);
	}
});

//Show route
router.get('/:id/show', async (req, res) =>{
	try{
		const foundUser = await User.findById(req.params.id);
		if(foundUser.isOrganizer === true){ 
			//if the user is an organizer, the organizer show page will be rendered
			res.render('organizers/show.ejs', {
				user: foundUser 
				//foundUser will be defined as user in show.ejs 
			});	
		} else {
			//if the user is not registered as an organizer, the attendee show page will be rendered
			res.render('attendees/show.ejs', {
				user: foundUser
				//foundUser will be defined as user in show.ejs 
			});
		}

	} catch(err) {
		res.send(err);
	}
});

//Create --Serever
//Post -- Server
//Edit -- Here
//Put -- Here
//Destroy -- Here

//Edit Route
router.get('/:id/edit', async (req, res) =>{
	try{
		const foundUser = await User.findById(req.params.id);
		if(foundUser.isOrganizer === true){
			//if the user is an organizer, the organizer edit page will be rendered
			res.render('organizers/edit.ejs', {
				user: foundUser
				//foundUser will be defined as user in edit.ejs
			});
		} else {
			//if the user is not registered as an organizer, the attendee edit page will be rendered
			res.render('attendees/edit.ejs', {
				user: foundUser
				//foundUser will be defined as user in edit.ejs
			});
		}
	} catch(err) {
		res.send(err);
	}
});

//Put route
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


module.exports = router;

