const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const bcrypt = require('bcryptjs');


router.post('/login', async (req, res) => {
    console.log("login attempt");
    try{
        const foundUser = await User.findOne({email: req.body.email}); // looks in user database for the email that matches the login form email
        if(foundUser){
            // compare the db encrypted password with the login form password
            if(bcrypt.compareSync(req.body.password, foundUser.password)){
                // if true lets log them in
                // start our session
                req.session.message = '';
                // if there failed attempts get rid of the message
                // from the session
                req.session.userId = foundUser._id;
                req.session.logged = true;

                console.log("Successful login: ", req.session.userId);
                res.redirect(`/users/${foundUser._id}`)
            } else {
                // if the passwords don't match
                req.session.message = 'Username or password is incorrect';
                res.redirect('/');
            }
        
        } else {
            req.session.message = 'Username or password is incorrect';
            res.redirect('/');
            // / is where teh form is
        }
    } catch(err){
        res.send(err)
    }
})

router.get('/registration', async (req, res) => {
    // goes to the user registration page
    res.render('newUser.ejs');
})

router.post('/registration', async (req, res) => {
    try{
        const newUser = {}; // new open variable to store req.body information
        newUser.name =  req.body.name
        newUser.displayName = req.body.displayName
        newUser.profilePic = req.body.profilePic
        newUser.location = req.body.location
        newUser.email = req.body.email
        const password = req.body.password
        const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10)); //encrypt password
        newUser.password = passwordHash; //set new user password to encrypted password
        // check to see if user is organizer or not
        if(req.body.isOrganizer === "on"){
            newUser.isOrganizer = true;
        } else{
            newUser.isOrganizer = false;
        }
        // added the user to the db
        const createdUser = await User.create(newUser);
        req.session.userId = createdUser._id;
        req.session.logged = true;
        res.redirect(`/users/${createdUser._id}`)
    } catch(err){
        res.send(err);
    }
});

router.get('/logout', async (req, res) => {
    try{
        req.session.destroy;
        res.redirect('/');
    } catch(err){
        res.send(err);
    }
})

module.exports = router;
