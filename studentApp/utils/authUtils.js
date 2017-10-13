/*jslint es6,  node:true */
'use strict';


const bcrypt = require('bcrypt');
const  jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY?process.env.SECRET_KEY:"secret"; //the secret comes from an enviroment variable
const stripchar = require('stripchar').StripChar;
const fs = require('fs');
const path = require('path');
const  nJwt = require('njwt');
/**
  check if a user eID exists on teh session,
  if not verify the existance of a jwt token and its validity
  retrieve the user credentials from the token and then save those
**/
exports.authorizeAll =  (req, res, next) =>{
  let  token = req.cookies.access_token;

  // let certName = "public_key.pem";
  // let keyPath = path.join(__dirname, '..', 'resources',  certName);
  // let cert = fs.readFileSync(keyPath);
  console.log(token);
  // var secret = new Buffer("testSecret", "base64");
  jwt.verify(token,"secret",{ algorithms: ['HS256'] }, function(err,token){
    if(err){
    console.log("ERRORRRR");
        // res.status(401).json({"message":"User not authorized"});
        res.redirect("/login/landing");
    }else{
      console.log(token); // Will contain the header and body
      next();
    }
  }) ;


  // jwt.verify(token,secretKey,function(err,token){
  //   if(err){
  //     // respond to request with error
  //     console.log(err);
  //     // res.status(401).json({"message":"User not authorized"});
  //     res.redirect("/login/landing");
  //   }else{
  //     next();
  //   }
  // });
};


exports.authorizeAdmin =  (req, res, next) =>{
  let  token = req.cookies.access_token;
  //read the private key:
  let cert = fs.readFileSync('../../resources/publicDScert.pem');


  jwt.verify(token,cert,function(err,token){
    if(err){
      console.log(err);
      res.status(401).json({"message":"User not authorized"});
    }else{
      console.log(token);
      if (token.scope.split(",").indexOf("admin") >= 0){
          next();
      }else{
        res.status(401).json({"message":"Only admin user may perform this action"});
      }
    }
  });
};




/*
  Returns the user credentials from the JWT token
*/
exports.userDetailsFromToken = (req,res) =>{
  let  token = req.cookies.access_token;
  return new Promise( (resolve,reject) =>{
    jwt.verify(token,secretKey,{ algorithms: ['HS256']},function(err,token){
      if(err){
        console.log(err);
        reject(err);
        return {"message":"User not authorized"};
      }else{
        // console.log(token);
        console.log(token.sub);
        let result = JSON.parse(token.sub);
        result.eid = stripchar.RSExceptUnsAlpNum(result.eid);
        if(!result.firstName){
          result.firstName = result.currentGivenName;
        }
        if(!result.familyName){
          result.firstName = result.currentFamilyName;
        }
        result.userName = result.firstName+"_"+result.familyName;
        resolve(result);
      }
    });
  });
}
