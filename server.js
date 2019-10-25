const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

require('./db/db.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.get('/registration', (req, res) => {
    res.render('newUser.ejs');
})




app.listen(PORT, () => {
    console.log('Server is up on port:', PORT);
})