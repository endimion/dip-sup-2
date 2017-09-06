/*jslint es6,  node:true */
'use strict';


const bcrypt = require('bcrypt');
const  jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY?process.env.SECRET_KEY:"testSecret"; //the secret comes from an enviroment variable


exports.authorizeAll =  (req, res, next) =>{
  let  token = req.cookies.access_token;
  jwt.verify(token,secretKey,function(err,token){
    if(err){
      // respond to request with error
      console.log(err);
      res.status(401).json({"message":"User not authorized"});
    }else{
      // continue with the request
      next();
    }
  });
};


exports.authorizeAdmin =  (req, res, next) =>{
  let  token = req.cookies.access_token;
  jwt.verify(token,secretKey,function(err,token){
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

//TODO does not reutrn bevause it si in the scope of the callback
// fix this
exports.userDetailsFromToken = (req,res) =>{
  let  token = req.cookies.access_token;
  let verificationPromise = new Promise( (resolve,reject) =>{
    jwt.verify(token,secretKey,function(err,token){
      if(err){
        console.log(err);
        return {"message":"User not authorized"};
      }else{
        console.log(token);
        console.log("token SUB:::::");
        console.log(token.sub);
        return token.sub;
      }
    });
  });

}
