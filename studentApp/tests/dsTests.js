/*jslint es6,  node:true */
'use strict';

const basic = require('../model/hlf/basic.js');
let evHelper = require('../utils/eventHub.js');

//
// evHelper.registerEventHubForOrg("org1",'dipSup_cc4','evtsender', event =>
// 															{console.log("event");
// 																console.log(event);})

// console.log(client);


//
// eh.setPeerAddr(ORGS[org][key].events, {
// 	pem: Buffer.from(data).toString(),
// 	'ssl-target-name-override': ORGS[org][key]['server-hostname']
// });

// // register the listeners before calling "connect()" so that we can
// // have the error callback ready to process an error in case the
// // connect() call fails
// eh.registerTxEvent(
//   transactionId,
//      (tx, code) => {
//        eh.unregisterTxEvent(transactionId);
//        console.log(util.format('Transaction %s has completed', transactionId));
//      },
//      (err) => {
//        eh.unregisterTxEvent(transactionId);
//        console.log(util.format('Error %s! Transaction listener for %s has been ' +
//                 'deregistered with %s', transactionId, err, eh.getPeerAddr()));
//      }
// );
//
// eh.connect();








// basic.createChannel();
// basic.joinAllOrgsOnChannel("mychannel");



// basic.installChaincode(["localhost:7051"],"dipSup_cc4","github.com/dipSup_cc","0.1.9", "nikos", "org1");
// basic.instantiateChaincode("mychannel", "dipSup_cc4", "0.1.9", "init", [],"nikos", "org1");

//
//
// basic.invokeChaincode(["localhost:7051"], "mychannel", "dipSup_cc4", "requestSupplementPublication",
// 														["nikos3","Nikos Tr", "nikos3","NTUA_ID","test@test.gr","nikos3","ntua_name"],
// 														"nikos3", "org1", test =>{})
// .then(function(message) {
// 	console.log(message);
// });

// basic.invokeChaincode(["localhost:7051"], "mychannel", "dipSup_cc4", "publish",
// 														['{"Owner": "nikos3", "University":"ntua_name","Authorized":[],"Id":"123"}','ntua_name'],
// 												"nikos3", "org1")
// .then(function(message) {
// 	console.log(message);
// });
//

//
basic.queryChaincode("peer1", "mychannel", "dipSup_cc4", ["ntua_name"], "getSupplements", "nikos3", "org1")
.then(function(message) {
		console.log(message);
});
//







// // name := args[0]
// eid := args[1]
// uniId := args[2]
// email  := args[3]
// eidHash := args[4]
// university := args[5]


//
// basic.queryChaincode("peer1", "mychannel", "example_cc", ["a"], "query", "nikos3", "org1")
// .then(function(message) {
// 	console.log(message);
// });
//
// basic.invokeChaincode(["localhost:7051"], "mychannel", "example_cc", "move",["a","b","10"], "nikos3", "org1")
// .then(function(message) {
// 	console.log(message);
// }).then(resp =>{
//   basic.queryChaincode("peer1", "mychannel", "example_cc", ["a"], "query", "nikos3", "org1")
//   .then(function(message) {
//     console.log(message);
//   });
// });
