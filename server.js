const env = require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');

require('./db/db.js');

app.use(session({
    secret: "secret tunnel",
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(express.static('./public'));

const usersController = require('./controllers/user.js');
app.use('/users', usersController);

const eventsController = require('./controllers/events.js');
app.use('/events', eventsController);

const loginController = require('./controllers/login.js');
app.use('/auth', loginController);

app.get('/', async (req, res) => {
    console.log("home index route");
    res.render('index.ejs', {
        message: req.session.message,
        logOut: req.session.logOutMsg
    });
});

app.listen(process.env.PORT, () => {
  console.log('listening on port 3000');
})