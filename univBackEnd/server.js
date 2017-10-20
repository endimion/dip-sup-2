var PROTO_PATH = __dirname + '/protos/ds_backend_service.proto';

const fs = require('fs');
const parseArgs = require('minimist');
const path = require('path');
const _ = require('lodash');
const grpc = require('grpc');
const dsBackend = grpc.load(PROTO_PATH).dsbackend;
const dsService = require('./service/DSService.js');


/*
* @param {Writable} call Writable stream for responses with an additional
*     request property for the request value.
*/
function getDiplomaSupplements(call) {
  console.log("getDiplomaSupplements called");
   let counter = 0;
   dsService.findAllDiplomaByCriterria(call.request).then(result =>{
       result.forEach(ds =>{
        console.log("writing DS " + counter);
        let resp = {
          university: ds.university,
          Holder_Info: ds.Holder_Info,
          Qualification_Info: ds.Qualification_Info,
          Qualification_Level :ds.Qualification_Level,
          Content_Info : ds.Content_Info,
          Qualification_Function: ds.Qualification_Function,
          Additional_Info: ds.Additional_Info,
          Supplement_Certification : ds.Supplement_Certification,
          HigherEducationSystem_Info: ds.HigherEducationSystem_Info,
          id: ds._id
        }
        call.write(resp);
        counter++;
       });
       call.end();
  });

}



function getServer() {
  var server = new grpc.Server();
  server.addService(dsBackend.DsBackend.service, {
    getDiplomaSupplements: getDiplomaSupplements
  });
  return server;
}


if (require.main === module) {
  console.log("strating server");
  // If this is run as a script, start a server on an unused port
  var routeServer = getServer();
  routeServer.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  routeServer.start();
}
