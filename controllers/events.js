// Require all needed files and modules
const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const Event = require('../models/events.js');

//index route -> lists all events
router.get('/', async (req, res) => {
  try{
    const allEvents = await Event.find({}); // find all events in database
    //render events index page with all events listed and the session id
    res.render('events/index.ejs', {
      event: allEvents,
      userId: req.session.userId
    });
  } catch(err){
    res.send(err);
  }
});

// create route -> Create new event page
router.get('/new',async (req, res) => {
  try{
    // render event new.ejs page, passing sessionId for reference  
    res.render('events/new.ejs', {
      userId: req.session.userId
    });
  } catch(err){
      res.send(err);
  }
});

// create post route -> make newly created event in data base
router.post('/', async (req, res)=>{
  try {
    const createEvent = await Event.create(req.body); //create new event using the req.body from new.ejs form
    const foundUser = await User.findById(req.session.userId); //grab the user using the sessionID
    foundUser.createdEvents.push(createEvent); //push the newly created event to the organizers (current user) array
    await foundUser.save(); // save the user so the array stays updated
    res.redirect(`/users/${req.session.userId}`); // redirect to the user index page
  } catch(err){
    console.log('error')
    res.send(err);
  }
});

// edit route -> go to events edit.ejs page
router.get('/:id/edit', async (req, res) => {
  try{
    const selectedEvent = await Event.findById(req.params.id); // gets the event information from the event being clicked on
    // render event edit.ejs page with the selected event information and sessionID
    res.render('events/edit.ejs', {
      event: selectedEvent,
      userId: req.session.userId
    });
  } catch(err) {
    res.send(err);
  }
});

// edit put route -> updates the event information
router.put('/:id', async (req, res) => {
  try{
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {new: true}); // updates the event using the ID and form from edit page
    res.redirect(`/events/${req.params.id}`); //redirect to the event show page
  } catch(err){
    res.send(err);
  }
})

//show route -> display all details for the event
router.get('/:id', async (req, res) => {
  try{
    // will find the id of the event clicked on
    const foundEvent = await Event.findById(req.params.id) // find event by ID
      .populate({path: 'attendees'}) //populate the found event with the attendees array
      .exec(); // execute populate
    // render event show page with the found event and session ID
    res.render('events/show.ejs', {
      event: foundEvent,
      userId: req.session.userId
    });
  } catch(err){
    res.send(err);
  }
});

// Post route to get the attend button to push to the event attendees array
router.post('/:id', async (req, res) => {
  try {
    const findAttendee = await User.findById({_id: req.session.userId}); // get the current users information from the session ID
    const findEvent = await Event.findById(req.params.id); //find event by id that relates to array
    // console logs to see what is going through
    console.log("Found attendee:", findAttendee._id);
    console.log("Found event:", findEvent._id);

    findEvent.attendees.push(findAttendee); // push the user to the events attendee array
    findAttendee.attendingEvents.push(findEvent); // push the event to the users attending events array
    await findAttendee.save(); //save the attendee array
    await findEvent.save(); //save the event array

    //console log to see if everything updated correctly
    console.log(findAttendee.attendingEvents);
    console.log(findEvent.attendees);
    // redirect the the event show page
    res.redirect(`/events/${req.params.id}`);
  } catch(err) {
      console.log('error');
      res.send(err);
  }
});

//backout
// router.post('/:id', async (req, res) => {
//   try {
//    // delete the user from the
//     const findAttendee = await User.findById(req.sessions.userId);

//     //find event by id that relates to array
//     const findEvent = await Event.findById(req.params.id)
//     // find the user the event belongs too
//     findEvent.attendees.splice(findEvent.findIndex(user.session.userId), 1)

//     await findEvent.save()
//     console.log(findEvent.attendees)
//     res.redirect(`/events/${req.params.id}`)
//     // const findEvent = User.findOne({'events': req.params.id});


//   } catch(err) {
//     console.log('errrrrror')
//     res.send(err)
//   }

// })

// Delete route to delete an event
router.delete('/:id', async (req, res)=>{
  // when we delete an event, we want to remove that
  // event from the event array
  try {
    console.log('delete:', req.params.id);
    // delete the event
    const eventOrganizer = await User.findOne({'createdEvents': req.params.id}); //find the event organizer for the event
    console.log("event organizer:", eventOrganizer);
    await eventOrganizer.createdEvents.remove(req.params.id); // delete the event from the event organizer array
    console.log("event deleted from organizer array");
    await eventOrganizer.save(); // save the updated eventOrganzier
    console.log(eventOrganizer.createdEvents);

    const foundAttendees =  await User.find({'attendingEvents': req.params.id});
    console.log("found attendees:", foundAttendees);
    for(let i=0; i < foundAttendees.length; i++){
      console.log("before delete:", foundAttendees[i].attendingEvents);
      await foundAttendees[i].attendingEvents.findOneAndRemove({id: req.params.id});
      console.log("event deleted");
      await foundAttendees[i].save();
      console.log("after delete:",foundAttendees[i].attendingEvents);
    }
    
    console.log("event to be deleted from database")
    const deleteEvent = Event.findByIdAndRemove(req.params.id); // delete the event from the database
    console.log("event deleted");

    res.redirect('/events'); //redirect to events index page
  } catch(err){
    console.log(err)
    res.send(err);
  }
});





module.exports = router;