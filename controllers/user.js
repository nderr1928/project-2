const express = require('express');
const router = express.Router();
const Event = require('../models/events.js');
const User = require('../models/users.js');

//Index Route

router.get('/:id', async (req, res) =>{
	try{
		//User is found by their Id
		const foundUser = await User.findById(req.params.id);
		if(foundUser.isOrganizer === true){
		//If the found user is registered as an organizer, 'createdEvents' array is populated into 
		//user object and the organizers index.ejs is rendered. 
			foundUser.populate({path: 'createdEvents'})
			.exec()
			res.render('organizers/index.ejs', {
				user: foundUser
			});
		} else {
		//If the found user is NOT registered as an organizer, 'attendingEvents' array is populated into 
		//user object and the attendees index.ejs is rendered. 	
			foundUser.populate({path: 'attendingEvents'})
			.exec()
			res.render('attendees/index.ejs', {
				user: foundUser
			})
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
		//If the found user is registered as an organizer, 'createdEvents' array is populated into 
		//user object and the organizers show.ejs is rendered. 
			foundUser.populate({path: 'createdEvents'})
			.exec()
			res.render('organizers/show.ejs', {
				user: foundUser
			});
		} else {
		//If the found user is NOT registered as an organizer, 'attendingEvents' array is populated into 
		//user object and the attendees show.ejs is rendered. 	
			foundUser.populate({path: 'attendingEvents'})
			.exec()
			res.render('attendees/show.ejs', {
				user: foundUser
			})
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

router.delete(':id', async (req, res) =>{
	try{
	const deletedUser = await User.findByIdAndRemove(req.params.id);
	if(deletedUser.isOrganizer === true){
		Event.remove({
			_id: {
				$in: deletedUser.createdEvents
			}
		});
		res.redirect('/registration');
	} else {
		Event.remove({
			_id: {
				$in: deletedUser.attendingEvents
			}
		});
		res.redirect('/registration');
	}
	} catch(err){
		res.send(err);
	}
})


module.exports = router;

