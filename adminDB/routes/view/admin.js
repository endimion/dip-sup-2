/*jslint es6,  node:true */
'use strict';

const express = require('express');
const router = express.Router();
const request = require('request');
const fs = require('fs');
const path = require('path');
const dsService = require("../../service/DSService")
module.exports = router;



router.get('/login', (req,res) =>{
  // return res.json({"welcome": "message"});
  return res.render('login',{ title: 'Login', message: 'Login to the DiplomaSupplement DB connection App' });
});


router.post('/login', (req,res) =>{
  let name = req.body.username;
  let pass = req.body.password;
  let creds = {"name":name, "password":pass};
  let actualUser = "test"||process.env.username;
  let actualPass = "test"||process.env.password;
  // console.log(actualUser + " " + actualPass + " " + creds.name + " " + creds.password);
  if(actualUser === creds.name && actualPass===creds.password){
      // return res.json({"message":"OK"});
      return res.render('manage',{ title: 'Diploma Suplement DB Interface', message: 'Insert New Diploma Supplements to the University Database' });
  }
  return res.json(creds);
});

router.post('/submit', (req,res) =>{
  try{
    let ds = JSON.parse(req.body.dipSup);
    dsService.saveDS(ds).then(resp =>{
      res.json(resp);
    }).catch(err =>{
        res.json({"message":"Error Processing JSON","reason":err});
    });
  }catch(error){
    console.log(error);
    return res.json({"message":"Error Processing JSON","reason":error.message});
  }
});
