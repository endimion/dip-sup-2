/*jslint es6,  node:true */
'use strict';


const express = require('express');
const app = express();
const port = 8002||process.env.SRV_PORT;
const address= "127.0.0.1"||process.env.SRV_ADDR;
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cookieParser = require('cookie-parser')
const morgan  = require('morgan');
const https = require('https');
const fs = require('fs');


/**** routes **/
let adminRoutes = require('./routes/view/admin');

// view engine setup
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');

//middlewares
app.use('/',express.static('public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser());
app.use(session({
  store: new FileStore,
  name: 'dbAppCookie',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
})); //set up middleware for session handling
app.use(morgan('tiny')); //http request logger
app.use('/admin',adminRoutes);



//start the server
const server = app.listen(port,"127.0.0.1", (err,res) => {
  if(err){
    console.log("error!!", err);
  }else{
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
    console.log("server started");
    console.log("SRV address"+ process.env.SRV_ADDR);

  }
});
