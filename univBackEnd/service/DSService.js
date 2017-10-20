
const ds = require('../model/DSModel.js');
const signServ = require("./SignService.js");
const DiplomaSupplement = ds.Schema;
// const conn = ds.connection;
const mongoose = require('mongoose');
/*
  Returns a promise
*/
module.exports.findAllDiplomaByCriterria = function(criteria){
  console.log("will query " );
  console.log(criteria);
  console.log("By " + criteria)  ;
  return DiplomaSupplement.find({
    'Holder_Info.StudentId':criteria.UniId,
    'Holder_Info.Name':criteria.Name,
    'Holder_Info.DateOfBirth':criteria.DateOfBirth
  }).exec();
};
