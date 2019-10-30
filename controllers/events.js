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
    // createEvent.eventOrganizer = foundUser._id;
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
<<<<<<< HEAD

          // will find the id of the event clicked on
          const foundEvent = await Event.findById(req.params.id)
            .populate({path: 'attendees'}).exec();
          // will populate found event with all the attendees signed up
          // foundEvent.populate({path: 'User'})
          // .exec()
          // render event show page
          res.render('events/show.ejs', {
            event: foundEvent,
            userId: req.session.userId
          })
  } catch(err){
      res.send(err);
  }
})

// post route
router.post('/', async (req, res)=>{
   try {

      // Why do we have to find the User and, create the event?
      // When we create an events is it stored in the User's events array
      // Look at the Users model

        // Here we are defining are database queries
      // we can wait for both of them to finish, instead of await
      // each one, because the result from each one are not
      // dependent on each other,
      // we can wait for the concurrently by using Promise.all as seen
      // below
      // const findUser = User.findById(req.body.userId);
      // const createEvent = Event.create(req.body);

      // Promise All returns an array of the repsonse from DB queries,
      // Using array destructing to save the corresponding responses
      // as the variables foundUser, and createdevents
      // the array destructering is the const [foundUser, createdevents]
      // Basially what this is doing is creating varaibles for each index in the array that
      // is returned from await Promise.all([findevents, findUser])
      //if you are still confused look up array destructering, its fancy new javascript
      // const [foundUser, createdEvent] = await Promise.all([findUser, createEvent]);

      // Is this where you are adding the events to the User's model
      // What is foundUser? What is it the result of? Read the code above
      // and think through it
      // foundUser.events.push(createdEvent);
      const createEvent = await Event.create(req.body);
      const foundUser = await User.findById(req.session.userId);
      foundUser.createdEvents.push(createEvent);
      await foundUser.save();
      // remember when you mutate a document, something
      // that is returned from your model, you have to
      // save it
      // await foundUser.save();
      res.redirect(`/users/${req.session.userId}`);

=======
    // will find the id of the event clicked on
    const foundEvent = await Event.findById(req.params.id) // find event by ID
      .populate({path: 'attendees'}) //populate the found event with the attendees array
      .exec(); // execute populate
    // render event show page with the found event and session ID
    res.render('events/show.ejs', {
      event: foundEvent,
      userId: req.session.userId
    });
>>>>>>> a55af1801f41da3a587f9af69607c799df6f2c89
  } catch(err){
    res.send(err);
  }
});

<<<<<<< HEAD


router.post('/:id', async (req, res) => {
  // try {
    const findAttendee = await User.findOne({_id:req.session.userId});
    //find event by id that relates to array
    const findEvent = await Event.findById(req.params.id)
    console.log("Found attendee:", findAttendee._id);
    console.log("Found event:", findEvent._id);
    // if (findAttendee = user.findOne) {
    //   findEvent.event.findOne
    // }
    // find the user the event belongs too
    console.log(findEvent);


    //if event attendee = user attender, then do nothing,  else push
    if (findEvent.attendees.indexOf(findAttendee._id) === -1) {
      findEvent.attendees.push(findAttendee)
      findAttendee.attendingEvents.push(findEvent)
    } else {
      console.log('derpderpDERPPP')
      prompt('You are already attending - invite your friends!');
    }
      await findAttendee.save()
      await findEvent.save()
=======
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
>>>>>>> a55af1801f41da3a587f9af69607c799df6f2c89

    //console log to see if everything updated correctly
    console.log(findAttendee.attendingEvents);
    console.log(findEvent.attendees);
<<<<<<< HEAD
    res.redirect(`/events/${req.params.id}`)
    // const findEvent = User.findOne({'events': req.params.id});
  // } catch(err) {
    // console.log('errrrrror')
    // res.send(err)
  // }

})


=======
    // redirect the the event show page
    res.redirect(`/events/${req.params.id}`);
  } catch(err) {
      console.log('error');
      res.send(err);
  }
});

>>>>>>> a55af1801f41da3a587f9af69607c799df6f2c89
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
    //delete event from organizer database
    const eventOrganizer = await User.findOne({'createdEvents': req.params.id}); //find the event organizer for the event
    console.log("event organizer:", eventOrganizer.createdEvents);
    await eventOrganizer.createdEvents.remove(req.params.id); // delete the event from the event organizer array
    console.log("event deleted from organizer array");
    await eventOrganizer.save(); // save the updated eventOrganzier
    console.log(eventOrganizer.createdEvents);

    //delete event from attenddes attending events
    const foundAttendees =  await User.find({'attendingEvents': req.params.id});
    for(let i=0; i < foundAttendees.length; i++){
      console.log("found attendees:", foundAttendees[i].attendingEvents);
    }
    for(let i=0; i < foundAttendees.length; i++){
      console.log("before delete:", foundAttendees[i].attendingEvents);
      for(let j=0; j < foundAttendees[i].attendingEvents.length; j++){
        // console.log(foundAttendees[i].attendingEvents[j]);
        // console.log(foundAttendees[i].attendingEvents[j] == req.params.id);
        if(foundAttendees[i].attendingEvents[j] == req.params.id){
          await foundAttendees[i].attendingEvents.splice(j, 1);
          j--;
        }
      }
      console.log("event deleted");
      await foundAttendees[i].save();
      console.log("after delete:",foundAttendees[i].attendingEvents);
    }
    
    console.log("event to be deleted from database")
    await Event.findByIdAndRemove(req.params.id); // delete the event from the database
    console.log("event deleted");

    res.redirect('/events'); //redirect to events index page
  } catch(err){
    console.log(err)
    res.send(err);
  }
});





module.exports = router;