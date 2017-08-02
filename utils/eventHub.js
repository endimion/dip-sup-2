/*jslint es6,  node:true */
'use strict';

const helper = require('./helper.js');
const fs = require('fs');
const path = require('path');


/**
  registers an event hub for the given organisation
  for the given chaincode
  listening for the specified events
  @param org the name of the organisation e.g. org1
  @param chaincodeName the name of the chaincode, e.g. dipSup_cc4
  @param eventName teh name of the event as that is defined in the chaincode
  @param successCallback the function to call upon receiving an event. It is applied to
         the unencoded (originally it is unit8 bytearray) event payload
**/
exports.registerEventHubForOrg = function(org,chaincodeName,eventName, successCallback){

  let client = helper.getClientForOrg(org);
  helper.getOrgAdmin(org).then((admin) => { //this is required to add a user to the client object
  	let caCert = fs.readFileSync(path.join(__dirname,
  		"../artifacts/channel/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt"));
  	// console.log(data);
  	let eh = client.newEventHub();
  	eh.setPeerAddr("grpcs://localhost:7053", {
  		 pem: Buffer.from(caCert).toString(),
  		'ssl-target-name-override': "peer0.org1.example.com"
  	});

  	let eventObj = eh.registerChaincodeEvent(chaincodeName, eventName,
                    event =>{
                            let unEncodedEvnet = String.fromCharCode.apply(null, event.payload);
                            successCallback(unEncodedEvnet,eh,eventObj);
                    },
  									err => {console.log(err)});
  	eh.connect();


  });
}


exports.txDetectionEvent = function(reject,resolve){
  console.log(util.format("Custom event received, payload: %j\n", event.payload.toString()));
  let eventJSON = JSON.parse(event.payload.toString());
  let eventMessage = eventJSON.Message;
  let eventBODY = eventJSON.Body;
  let eventTXID = eventJSON.TxId;

  if(eventMessage.indexOf("Error") >= 0){
    if(eventTXID === txHash){ //resolve promise only when the current transaction has finished
      eh.unregisterChaincodeEvent(regid);
      reject(eventMessage);
    }
  }
  if(eventMessage.indexOf("Tx chaincode finished OK") >= 0){
      if(eventTXID === txHash){ //resolve promise only when the current transaction has finished
        eh.unregisterChaincodeEvent(regid);
        resolve(eventMessage);
      }
      networkConfig.chain.setInvokeWaitTime(20);
  }

}
