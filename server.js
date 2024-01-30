const express = require('express');
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


//mongodb connection
require('./app/models/index')
//all api routes
require("./app/routes/allroutes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log('listening at port 8000')
})

