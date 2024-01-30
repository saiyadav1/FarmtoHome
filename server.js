const express = require('express');
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const corsOptions = {
  origin: 'http://localhost:3000/',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // Enable credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 204,
};
require('dotenv').config();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//mongodb connection
require('./app/models/index')
//all api routes
require("./app/routes/allroutes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('listening at port 8000')
})

