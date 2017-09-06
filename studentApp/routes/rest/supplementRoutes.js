/*jslint es6,  node:true */
'use strict';


const express = require('express');
const router = express.Router()
const request = require('request');
const authorizeAll = require('../../utils/authUtils').authorizeAll;
const authorizeAdmin = require('../../utils/authUtils').authorizeAdmin;
const getUserDetails = require('../../utils/authUtils').userDetailsFromToken;


module.exports = router




router.get('/view',authorizeAll,(req,res) =>{
    let useDetails = getUserDetails(req,res);
    console.log("Details");
    console.log(useDetails);
    res.status(200).json(useDetails);
    // let userEid = req.session.eID;
    // let userType =  req.session.userType;
    // console.log("\nSupplementsRouts.js /view :: userEid" +userEid );
    // console.log("\nSupplementsRouts.js /view :: userType" +userType );
    //
    // hfcService.getSupplements(userEid,userType)
    // .then(result => {
    //   console.log(req.session);
    //
    //   res.render('viewSupplements',{ title: 'Published Supplements',
    //         message: 'Welcome user: ' + req.session.userName  ,
    //         userType: req.session.userType,
    //         supplements: result,
    //         eID: req.session.eID,
    //         userName: req.session.userName,
    //         firstName: req.session.firstName,
    //         lastName: req.session.lastName});
    // })
    // .catch(err =>{
    //   res.render('errorMessage',{ title: 'Ooops... an error occured!',
    //               message: err,
    //               stdId: req.session.eID});
    // });
});
