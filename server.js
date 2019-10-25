const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));







app.listen(PORT, () => {
    console.log('Server is up on port:', PORT);
})