const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const Event = require('../models/events.js');

//index route
router.get('/', async (req, res) => {
    try{
      const allEvents = await Event.find({});
      res.render('events/index.ejs', {
        event: allEvents,
        userId: req.session.userId
      });
    } catch(err){
      res.send(err);
    }
});

// create route
router.get('/new',async (req, res) => {
    res.render('events/new.ejs', {
      userId: req.session.userId
    });
})

// edit route
router.get('/:id/edit', async (req, res) => {
    try{
        const selectedEvent = await Event.findById(req.params.id);
        res.render('events/edit.ejs', {
            event: selectedEvent,
            userId: req.session.userId
        })
    } catch(err) {
        res.send(err);
    }
})

// edit part 2 to get back to show
router.put('/:id', async (req, res) => {
    try{
      console.log(req.params.id);
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {new: true});
        console.log(updatedEvent);
        res.redirect(`/events/${req.params.id}`)
    } catch(err){
        res.send(err);
    }
})

//show route
router.get('/:id', async (req, res) => {
  try{
    // will find the id of the event clicked on
    const foundEvent = await Event.findById(req.params.id);
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

  } catch(err){
    console.log('errroor')
     res.send(err);
  }
});



router.delete('/:id', async (req, res)=>{
  // when we delete an event, we want to remove that
  // event from the event array
  console.log('delete')
  try {
    // delete the event
    const deleteEvent = Event.findByIdAndRemove(req.params.id);
    // find the user the event belongs too
    // so we can remove the event from their array
    const findUser = User.findOne({'events': req.params.id});

    // Using promise all just as we did above
    const [deletedEventResponse, foundUser] = await Promise.all([deleteEvent, findUser]);
    console.log(foundUser, ' found user')
    // here we are using mongooses method remove
    // to remove the event by its id
    // we are mutating the array
    foundUser.events.remove(req.params.id);
    // if we mutate the array we have to save it
    await foundUser.save()
    // now we can send a response back to the client
    // the browser
    console.log('after save')
    res.redirect('/events');
  } catch(err){
    console.log(err)
    res.send(err);
  }
});





module.exports = router;