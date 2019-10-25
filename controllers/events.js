const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const Event = require('../models/events.js');

//index route
router.get('/', async (req, res) => {
    res.render('events/index.ejs');
})

// create route
router.get('/new',async (req, res) => {
    res.render('events/new.ejs');
})

// edit route
router.get('/:id/edit', async (req, res) => {
    try{
        const selectedEvent = await Event.findById(req.params.id);
        // Selected event = Events.findById(req.params.id)
        res.render('events/edit.ejs', {
            event: selectedEvent
        })
    } catch(err) {
        res.send(err);
    }
})

router.put('/:id', async (req, res) => {
    try{
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.redirect(`/${req.params.id}`)
    } catch(err){
        res.send(err);
    }
})

//show route
router.get('/:id', async (req, res) => {

    // Selected event = Events.findById(req.params.id)
    res.render('events/show.ejs', {
        //event: selectedEvent
    });
})






module.exports = router;