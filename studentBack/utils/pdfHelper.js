'use strict';

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const utf8 = require('utf8');
const tmp = require('tmp');
// create a document and pipe to a blob




exports.genPdf = genPdf;
exports.genPdfPromise= genPdfPromise;





function genPdfPromise(ds){
  // const stream = doc.pipe(blobStream());
  return new Promise((resolve,reject) =>{
    const doc = new PDFDocument();
    tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
      if (err) reject(err);
      console.log('File: ', path);
      console.log('Filedescriptor: ', fd);
      const stream = doc.pipe(fs.createWriteStream(path) ) ;
       doc.registerFont('NotoSans', __dirname +'/../fonts/NotoSans-Regular.ttf');

       // draw some text
       doc.fontSize(25)
          .text('HELENIC REPUBLIC', 200, 80);


       // doc.circle(280, 200, 50)
       //    .fill("#6600FF");
       let uniName="";
       if(ds.Qualification_Info.InstitutionName.indexOf("Aegean") >= 0){
         doc.image(__dirname +'/../public/img/uAegeanLogo.png', 270, 110, {width: 80});
         uniName = "UNIVERSITY OF THE AEGEAN";
       }else{
         if(ds.Qualification_Info.InstitutionName.indexOf("Agri") >= 0){
           doc.image(__dirname +'/../public/img/AgriLogo.png', 270, 110, {width: 80});
           uniName = "AGRICULTURAL UNIVERSITY OF ATHENS";
         }else{
           doc.image(__dirname +'/../public/img/PirLogo.png', 270, 110, {width: 80});
           uniName= "UNIVERSITY OF PIREAUS";
         }
       }
          // .text('Proportional to width', 0, 0)

       // and some justified text wrapped into columns

       let style = {
            width: 412,
            align: 'justify',
           //  indent: 30,
           //  columns: 2,
            height: 300,
            ellipsis: true
          };

       let personalDsc = "1. INFORMATION IDENTIFYING THE HOLDER OF THE QUALIFICATION";
       let fName = ds.Holder_Info.Name.split(" ")[0];
       let gName = ds.Holder_Info.Name.split(" ")[1];
       let personalName = "1.1 Family Name: " + fName;
       let givenName = "1.2 Given Name: " + gName;
       let date = "1.3 Date of birth (day/month/year) - Place, Country of birth: " +
                   ds.Holder_Info.DateOfBirth;
       let stdId = "Student Identification number of code(if available): "
                   + ds.Holder_Info.StudentId;

     let qualDsc = "2. INFORMATION IDENTIFYING THE QUALIFICATION";
     let qualName ="2.1 Name of Qualification and if applicable the title conferred in the original language: ";
     let qualField = "2.2 Main field(s) of study for the qualification:";
     let qualStatus = "2.3 Name of status of awarding Institution (in the original language):"
     let qualStatusExtra = "2.4 Name of status of awarding Instituition (if different from 2.3) administrating studies (in teh origimal language)";
     let qualLang = "2.5 Language(s) of instructions/examination:"


     let levelDsc = "3. INFORMATION ON THE LEVEL OF THE QUALIFICATION";
     let levelQual = "3.1 Level of Qualification:"
     let officialLength = "3.2 Official length of programme:";
     let accecssRequirements = "3.3 Access requirements(s):"

     let infoDsc = "4. INFORMATION ON THE CONTENTS AND RESULTS GAINED ";
     let infoMode = "4.1 Mode of Study";
     let infoProgRequirements = "4.2 Programme requirements";
     let infoProgDetails = "4.3 Programme details (e.g., modules or units studied)"+
      "and the individual grades/marks/credit units obtained (if this information is available on an official transcript, this should be used here):";

     let gradingScheme = "4.4 Grading Scheme and, if available grade distribution guidance:";
     let overallCass = "4.5 Overall classification of the qualification (in the original language)";

     let fuctionOfQual ="5. INFORMATION ABOUT THE FUNCTION OF THE QUALIFICATION";
     let accessToFurtherStudy = "5.1 Access to further study: ";
     let profStatus = "5.2 Professional Status: ";

       doc.fill("black").text(uniName, 140, 200)
          .font('NotoSans', 13)
          .moveDown()
          .text(ds.Qualification_Info.Name, 120, 225)
          .font('NotoSans', 11)
          .moveDown()
          .text(personalDsc, style)
         .moveDown()

          // .font('fonts/AttikaU.ttf')
          .text(personalName, style)
          .text(givenName, style)
          .font('NotoSans', 11)

          .text(date, style)
          .text(stdId, style)
          .moveDown()
          .text(qualDsc, style)
          .moveDown()
          .text(qualName,style)
           .text(ds.Qualification_Info.Name,style)
          .text(qualField,style)
          .text(ds.Qualification_Info.FieldsOfStudy,style)
          .text(qualStatus,style)
         .text(ds.Qualification_Info.InstitutionStatus,style)
         .text(qualStatusExtra,style)
         .text("As in 2.3",style)
         .text(qualLang,style)
         .text("Greek",style)
         .moveDown()
         .text(levelDsc,style)
         .text(levelQual,style)
         .text(ds.Qualification_Level.Level,style)
         .text(officialLength,style)
         .text("Duration              :" + ds.Qualification_Level.ProgrammeLength.Duration)
         .text("Credit Units (ECTS)   : " + ds.Qualification_Level.ProgrammeLength.Credit_Units)
         .moveDown()
         .text(accecssRequirements,style)
         .text(ds.Qualification_Level.AccecssRequirements)
         .moveDown()
         .text(infoDsc,style)
         .text(infoMode,style)
         .text(ds.Content_Info.ModeOfStudy,style)
         .moveDown()
         .text(infoProgRequirements,style)
         .text(ds.Content_Info.ProgrammeRequirements,style)
         .moveDown()
         .text(infoProgDetails,style)
         .text(ds.Content_Info.ProgrammeDetails.Legend)
         .moveDown()
         .text(fuctionOfQual)
         .moveDown()
         .text()
       // let header = {"ModuleCode":"Module Code","NameOfTheModule":"Name of Module","TypeOfModule":"Type of Module","ExamPeriod":"Exam Period","Grade":"Grade","InWriting":"In Writting"};
       ds.Content_Info.ProgrammeDetails.Modules.forEach(mod =>{
         addTableRow(mod,doc);
       }) ;
       doc.text(ds.Content_Info.ProgrammeDetails.Legend)
         .moveDown()
         .text(gradingScheme)
         .text(ds.Content_Info.ProgrammeDetails.GradingScheme)
         .moveDown()
         .text(overallCass)
         .text(ds.Content_Info.ProgrammeDetails.OverallClassificationOfQualification)
         .moveDown()
         .text(fuctionOfQual)
         .moveDown()
         .text(accessToFurtherStudy)
         .text(ds.AccessToFurtherStudy)
         .text(profStatus)
         .text(ds.ProfessionalStatus)
         .moveDown(2)
         .text("6. ADDITIONAL INFORMATION")
         .moveDown()
         .text("6.1 Additionanl Information: ")
         .text(ds.Additional_Info.AdditionalInfo)
         .text("6.2 Further information of sources: ")
         .text(ds.Additional_Info.InfoSources)
         .moveDown()
         .text("7. CERTIFICATION OF THE SUPPLEMENT")
         .text("7.1 Date " + ds.Supplement_Certification.Date)
         .text("7.2 Signature and name: (by order of the Rector)" + ds.Supplement_Certification.Name)
         .text(ds.Supplement_Certification.Signature)
         .text("7.3 Capacity: " + ds.Supplement_Certification.Capacity)
         .text("7.4 Official seal: " + ds.Supplement_Certification.Stamp)
         .moveDown(2)
         .text("8. INFORMATION ON THE NATIONAL HIGHER EDUCTAION SYSTEM")
         .text(ds.HigherEducationSystem_Info.HigherEductaionSystemInfo)
       // end and display the document in the iframe to the right
       doc.end();
       stream.on('finish', function() {
         // iframe.src = stream.toBlobURL('application/pdf');
         resolve(path);

       });



      // If we don't need the file anymore we could manually call the cleanupCallback
      // But that is not necessary if we didn't pass the keep option because the library
      // will clean after itself.
      //cleanupCallback();
    });



  });



}












/*
  res http response object
  ds Diploma Supplement in JSON format
*/
function genPdf(ds,res){
  // const stream = doc.pipe(blobStream());
  const doc = new PDFDocument();
//  const stream = doc.pipe(res);
  tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
    if (err) throw err;

    console.log('File: ', path);
    console.log('Filedescriptor: ', fd);

    // const stream = doc.pipe(fs.createWriteStream('test.pdf') ) ;
    const stream = doc.pipe(fs.createWriteStream(path) ) ;

     doc.registerFont('NotoSans', __dirname +'/../fonts/NotoSans-Regular.ttf');

     // draw some text
     doc.fontSize(25)
        .text('HELENIC REPUBLIC', 200, 80);


     // doc.circle(280, 200, 50)
     //    .fill("#6600FF");
     let uniName="";
     if(ds.Qualification_Info.InstitutionName.indexOf("Aegean") >= 0){
       doc.image(__dirname +'/../public/img/uAegeanLogo.png', 270, 110, {width: 80});
       uniName = "UNIVERSITY OF THE AEGEAN";
     }else{
       if(ds.Qualification_Info.InstitutionName.indexOf("Agri") >= 0){
         doc.image(__dirname +'/../public/img/AgriLogo.png', 270, 110, {width: 80});
         uniName = "AGRICULTURAL UNIVERSITY OF ATHENS";
       }else{
         doc.image(__dirname +'/../public/img/PirLogo.png', 270, 110, {width: 80});
         uniName= "UNIVERSITY OF PIREAUS";
       }
     }
        // .text('Proportional to width', 0, 0)

     // and some justified text wrapped into columns

     let style = {
          width: 412,
          align: 'justify',
         //  indent: 30,
         //  columns: 2,
          height: 300,
          ellipsis: true
        };

     let personalDsc = "1. INFORMATION IDENTIFYING THE HOLDER OF THE QUALIFICATION";
     let fName = ds.Holder_Info.Name.split(" ")[0];
     let gName = ds.Holder_Info.Name.split(" ")[1];
     let personalName = "1.1 Family Name: " + fName;
     let givenName = "1.2 Given Name: " + gName;
     let date = "1.3 Date of birth (day/month/year) - Place, Country of birth: " +
                 ds.Holder_Info.DateOfBirth;
     let stdId = "Student Identification number of code(if available): "
                 + ds.Holder_Info.StudentId;

   let qualDsc = "2. INFORMATION IDENTIFYING THE QUALIFICATION";
   let qualName ="2.1 Name of Qualification and if applicable the title conferred in the original language: ";
   let qualField = "2.2 Main field(s) of study for the qualification:";
   let qualStatus = "2.3 Name of status of awarding Institution (in the original language):"
   let qualStatusExtra = "2.4 Name of status of awarding Instituition (if different from 2.3) administrating studies (in teh origimal language)";
   let qualLang = "2.5 Language(s) of instructions/examination:"


   let levelDsc = "3. INFORMATION ON THE LEVEL OF THE QUALIFICATION";
   let levelQual = "3.1 Level of Qualification:"
   let officialLength = "3.2 Official length of programme:";
   let accecssRequirements = "3.3 Access requirements(s):"

   let infoDsc = "4. INFORMATION ON THE CONTENTS AND RESULTS GAINED ";
   let infoMode = "4.1 Mode of Study";
   let infoProgRequirements = "4.2 Programme requirements";
   let infoProgDetails = "4.3 Programme details (e.g., modules or units studied)"+
    "and the individual grades/marks/credit units obtained (if this information is available on an official transcript, this should be used here):";

   let gradingScheme = "4.4 Grading Scheme and, if available grade distribution guidance:";
   let overallCass = "4.5 Overall classification of the qualification (in the original language)";

   let fuctionOfQual ="5. INFORMATION ABOUT THE FUNCTION OF THE QUALIFICATION";
   let accessToFurtherStudy = "5.1 Access to further study: ";
   let profStatus = "5.2 Professional Status: ";

     doc.fill("black").text(uniName, 140, 200)
        .font('NotoSans', 13)
        .moveDown()
        .text(ds.Qualification_Info.Name, 120, 225)
        .font('NotoSans', 11)
        .moveDown()
        .text(personalDsc, style)
       .moveDown()

        // .font('fonts/AttikaU.ttf')
        .text(personalName, style)
        .text(givenName, style)
        .font('NotoSans', 11)

        .text(date, style)
        .text(stdId, style)
        .moveDown()
        .text(qualDsc, style)
        .moveDown()
        .text(qualName,style)
         .text(ds.Qualification_Info.Name,style)
        .text(qualField,style)
        .text(ds.Qualification_Info.FieldsOfStudy,style)
        .text(qualStatus,style)
       .text(ds.Qualification_Info.InstitutionStatus,style)
       .text(qualStatusExtra,style)
       .text("As in 2.3",style)
       .text(qualLang,style)
       .text("Greek",style)
       .moveDown()
       .text(levelDsc,style)
       .text(levelQual,style)
       .text(ds.Qualification_Level.Level,style)
       .text(officialLength,style)
       .text("Duration              :" + ds.Qualification_Level.ProgrammeLength.Duration)
       .text("Credit Units (ECTS)   : " + ds.Qualification_Level.ProgrammeLength.Credit_Units)
       .moveDown()
       .text(accecssRequirements,style)
       .text(ds.Qualification_Level.AccecssRequirements)
       .moveDown()
       .text(infoDsc,style)
       .text(infoMode,style)
       .text(ds.Content_Info.ModeOfStudy,style)
       .moveDown()
       .text(infoProgRequirements,style)
       .text(ds.Content_Info.ProgrammeRequirements,style)
       .moveDown()
       .text(infoProgDetails,style)
       .text(ds.Content_Info.ProgrammeDetails.Legend)
       .moveDown()
       .text(fuctionOfQual)
       .moveDown()
       .text()
     // let header = {"ModuleCode":"Module Code","NameOfTheModule":"Name of Module","TypeOfModule":"Type of Module","ExamPeriod":"Exam Period","Grade":"Grade","InWriting":"In Writting"};
     ds.Content_Info.ProgrammeDetails.Modules.forEach(mod =>{
       addTableRow(mod,doc);
     }) ;
     doc.text(ds.Content_Info.ProgrammeDetails.Legend)
       .moveDown()
       .text(gradingScheme)
       .text(ds.Content_Info.ProgrammeDetails.GradingScheme)
       .moveDown()
       .text(overallCass)
       .text(ds.Content_Info.ProgrammeDetails.OverallClassificationOfQualification)
       .moveDown()
       .text(fuctionOfQual)
       .moveDown()
       .text(accessToFurtherStudy)
       .text(ds.AccessToFurtherStudy)
       .text(profStatus)
       .text(ds.ProfessionalStatus)
       .moveDown(2)
       .text("6. ADDITIONAL INFORMATION")
       .moveDown()
       .text("6.1 Additionanl Information: ")
       .text(ds.Additional_Info.AdditionalInfo)
       .text("6.2 Further information of sources: ")
       .text(ds.Additional_Info.InfoSources)
       .moveDown()
       .text("7. CERTIFICATION OF THE SUPPLEMENT")
       .text("7.1 Date " + ds.Supplement_Certification.Date)
       .text("7.2 Signature and name: (by order of the Rector)" + ds.Supplement_Certification.Name)
       .text(ds.Supplement_Certification.Signature)
       .text("7.3 Capacity: " + ds.Supplement_Certification.Capacity)
       .text("7.4 Official seal: " + ds.Supplement_Certification.Stamp)
       .moveDown(2)
       .text("8. INFORMATION ON THE NATIONAL HIGHER EDUCTAION SYSTEM")
       .text(ds.HigherEducationSystem_Info.HigherEductaionSystemInfo)
     // end and display the document in the iframe to the right
     doc.end();
     stream.on('finish', function() {
       // iframe.src = stream.toBlobURL('application/pdf');

     });



    // If we don't need the file anymore we could manually call the cleanupCallback
    // But that is not necessary if we didn't pass the keep option because the library
    // will clean after itself.
    cleanupCallback();
  });



}


function addTableRow(mod,doc){
  //  {"ModuleCode":"OIO103","NameOfTheModule":"Introduction to Economics","TypeOfModule":"CC","ExamPeriod":"Feb. 2012","Grade":"6","InWriting":"six"},
  let modCode = "Module Code: "+mod.ModuleCode;
  let modName = "Module Name: " + mod.NameOfTheModule;
  let modeType = "Type of Module: "+ mod.TypeOfModule;
  let examPer = "Exam Period: "+ mod.ExamPeriod;
  let grade = "Grade: "+mod.Grade;
  let writting = "In Writting: "+ mod.InWriting;
  doc.font('NotoSans', 11)
    .moveDown(0.5)
    .text(modCode)
    .text(modName)
    .text(modeType)
    .text(examPer)
    .text(grade)
    .text(writting)
    .moveDown(0.5)
}
