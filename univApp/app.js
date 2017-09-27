/*jslint es6,  node:true */
'use strict';

const basic = require('./model/hlf/basic.js');
const evHelper = require('./utils/eventHelper.js');
const dsService = require('./service/DSService.js');
const hash = require('hash.js');
const signService = require('./service/SignService.js');
/* configuration */
const config = require('./config.json');
const peer = config.peer;
const peerAddr = config.peerAddress;
const channel = config.channelName;
const org = config.org;
const chaincode = config.chaincode;


evHelper.registerEventHubForOrg(org,chaincode,'evtsender', event => {
    console.log("event");
		console.log(event);
    
    let pubReq = JSON.parse(event).Body;
    console.log(pubReq);
    let univName = process.env.universityName||"UAgean";

    console.log(pubReq.University === univName);
    if(pubReq.University === univName){
      dsService.findAllDiplomaByCriterria(pubReq).then(result =>{

          return result.map(dbDipSup =>{
             //map the supplement from the DB to a full DiplomaSupplement Structure
             //owner value, denotes the eidas eid,  is retreived from the event,
             // the val. does not exist in the db
             console.log("match found")  ;
             console.log(dbDipSup);

             let supplement =  {
               "Owner" : pubReq.EidHash,
               "Name" : dbDipSup.name,
               "Surname" : dbDipSup.surname,
               "University" : univName,
               "Authorized" : [],
               "Id" :  dbDipSup._id.valueOf(),
               "Holder_Info": dbDipSup.Holder_Info,
               "Qualification_Info": dbDipSup.Qualification_Info,
               "Qualification_Level": dbDipSup.Qualification_Level,
               "Content_Info": dbDipSup.Content_Info,
               "Qualification_Function":dbDipSup.Qualification_Function,
               "Additional_Info": dbDipSup.Additional_Info,
               "Supplement_Certification":dbDipSup.Supplement_Certification,
               "HigherEducationSystem_Info":dbDipSup.HigherEducationSystem_Info     
            };
            let supHash = hash.sha256().update(JSON.stringify(supplement)).digest('hex');
            supplement.signature =signService.signHash(supHash);

            return supplement;
        });
     })
     .then(results =>{
        // console.log(results);
        results.forEach(dsResult =>{
          //console.log(dsResult);
          basic.queryChaincode(peer, channel, chaincode, [dsResult.Id.toString(),'UAgean'], "getSupplementById", 'UAgean', org)
          .then( resp =>{
            // console.log("RESponse");
            // console.log(resp);
	    // 
            console.log("STRINGIFIED");
           console.log(JSON.stringify(dsResult));
            if(resp.indexOf("error") !== -1){ //if not sup with given Id is found
                console.log("will publish");
                basic.invokeChaincode([peerAddr], channel, chaincode, "publish",
      							[JSON.stringify(dsResult),'UAgean'],'UAgean', org)
            }

          });

        });
     }) ;
    }

});
