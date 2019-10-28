const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const User = require('./models/users.js');
const bcrypt = require('bcrypt.js');

require('./db/db.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(express.static('./public'));

const usersController = require('./controllers/user.js');
app.use('/users', usersController);

const eventsController = require('./controllers/events.js');
app.use('/events', eventsController);

app.get('/', async (req, res) => {
    res.render('index.ejs');
})

app.get('/registration', async (req, res) => {
    res.render('newUser.ejs');
})

app.post('/registration', async (req, res) => {
    try{
        const newUser = {};
        newUser.name =  req.body.name
        newUser.displayName = req.body.displayName
        newUser.profilePic = req.body.profilePic
        newUser.location = req.body.location
        newUser.email = req.body.email
        const password = req.body.password
        const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        newUser.password = passwordHash;
        if(req.body.isOrganizer === "on"){
            newUser.isOrganizer = true;
        } else{
            newUser.isOrganizer = false;
        }
        // added the user to the db
        const createdUser = await User.create(newUser);
        console.log(createdUser);
        res.redirect(`/users/${createdUser._id}`);
    } catch(err){
        res.send(err);
    }
});



app.listen(PORT, () => {
    console.log('Server is up on port:', PORT);
})