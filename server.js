const express = require('express');
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
require('dotenv').config();
app.use(cors(corsOptions));
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

