
const ds = require('../model/DSModel.js');
const DiplomaSupplement = ds.Schema;
// const conn = ds.connection;
const mongoose = require('mongoose');



module.exports.saveDipSup = function(diplomaSupplement){

}


module.exports.saveDS = function(ds){
  let testDS = new  DiplomaSupplement({
    university: ds.university,
    Holder_Info:{
      Name:ds.Holder_Info.Name,
      DateOfBirth:ds.Holder_Info.DateOfBirth,
      StudentId:ds.Holder_Info.StudentId
    },
    Qualification_Info:{
        Name:ds.Qualification_Info.Name,
        FieldsOfStudy:ds.Qualification_Info.FieldsOfStudy,
        InstitutionName:ds.Qualification_Info.InstitutionName,
        InstitutionStatus:ds.InstitutionStatus,
        InstructionLanguage:ds.Qualification_Info.InstructionLanguage
    },
    Qualification_Level:{
      Level:ds.Qualification_Level.Level,
      ProgrammeLength:ds.Qualification_Level.ProgrammeLength,
      AccecssRequirements:ds.Qualification_Level.AccecssRequirements
    },
    Content_Info:{
      ModeOfStudy:ds.Content_Info.ModeOfStudy,
      ProgrammeRequirements:ds.Content_Info.ProgrammeRequirements,
      ProgrammeDetails:ds.Content_Info.ProgrammeDetails,
      GradingScheme:ds.Content_Info.GradingScheme,
      OverallClassificationOfQualification:ds.Content_Info.OverallClassificationOfQualification
    },
    Qualification_Function:{
      AccessToFurtherStudy:ds.Qualification_Function.AccessToFurtherStudy,
      ProfessionalStatus:ds.Qualification_Function.ProfessionalStatus
    },
    Additional_Info:{
      AdditionalInfo:ds.Additional_Info.AdditionalInfo,
      InfoSources:ds.Additional_Info.InfoSources
    },
    Supplement_Certification:{
      Date:ds.Supplement_Certification.Date,
      Name:ds.Supplement_Certification.Name,
      Capacity:ds.Supplement_Certification.Capacity,
      Signature:ds.Supplement_Certification.Signature,
      Stamp:ds.Supplement_Certification.Stamp
    },
    HigherEducationSystem_Info: {
      HigherEductaionSystemInfo:ds.Supplement_Certification.HigherEductaionSystemInfo
    },
    _id:  new mongoose.Types.ObjectId
  });

  console.log("will attempt to save");
  console.log(testDS);
  return new Promise( (resolve,reject) =>{
    testDS.save(function(err) {
      if (err){console.log(err)
        reject(err);
      }
      console.log('DS saved!');
      resolve("ok");
    });
  });

};
