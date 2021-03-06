/*jslint es6,  node:true */
'use strict';


const express = require('express');
const router = express.Router();
const request = require('request');
const authorizeAll = require('../../utils/authUtils').authorizeAll;
const authorizeAdmin = require('../../utils/authUtils').authorizeAdmin;
const getUserDetails = require('../../utils/authUtils').userDetailsFromToken;
const basic = require('../../model/hlf/basic.js');
const supUtils = require('../../utils/supplementUtils.js');
const emailUtil = require('../../utils/emailClient.js');
const randomstring = require("randomstring");
const qr = require('qr-image');

/* configuration */
const config = require('../../config.json');
const peer = config.peer;
const peerAddr = config.peerAddress;
const channel = config.channelName;
const org = config.org;
const chaincode = config.chaincode;


module.exports = router;



/****************** QUERIES ****************************************/


/*
  returns a JSON containing all the DS of the loggedin user
  retrieved from the JWT token
*/
router.get('/view',authorizeAll,(req,res) =>{
    let userDetails = getUserDetails(req,res);
    userDetails.then( details =>{
      let userEid = details.eid;
      console.log("getSupplements userEid " + userEid);
      basic.queryChaincode(peer, channel, chaincode, [userEid], "getSupplements", userEid, org)
      .then( resp =>{
        console.log(resp);
        res.status(200).json(resp);
      }).catch(err =>{
          console.log(err);
          res.status(500);
      });

    }).catch(err =>{
        console.log(err);
        res.status(500);
    });
});


/*
  returns a JSON of the  DS with the given ID provided loggedin user
  can retrieve it
*/
router.get('/view/:supId',authorizeAll,(req,res) =>{
  getUserDetails(req,res).then( details =>{
      let userEid = details.eid;
      let supId = req.params.supId;
      basic.queryChaincode(peer, channel, chaincode, [supId,userEid], "getSupplementById", userEid, org)
      .then( resp =>{
        if(resp.indexOf("error") != -1){
          res.status(401).json(resp);
        }
        res.status(200).json(resp);
      }).catch(err =>{
          console.log("ERROR::");
          console.log(err);
          res.status(500);
      });
    }).catch(err =>{
        console.log(err);
        res.status(500);
    });
});



/*
  returns a JSON of the  DS with the given ID provided loggedin user
  can retrieve it
*/
router.get('/download/:supId',authorizeAll,(req,res) =>{
  getUserDetails(req,res).then( details =>{
      let userEid = details.eid;
      let supId = req.params.supId;
      basic.queryChaincode(peer, channel, chaincode, [supId,userEid], "getSupplementById", userEid, org)
      .then( resp =>{
        if(resp.indexOf("error") != -1){
          res.status(401).json(resp);
        }
        res.status(200).json(resp);
      }).catch(err =>{
          console.log("ERROR::");
          console.log(err);
          res.status(500);
      });
    }).catch(err =>{
        console.log(err);
        res.status(500);
    });
});


/*
  returns the DS invite that contains the given hash
*/
router.get('/invite/:invHash',authorizeAll,(req,res) =>{
  getUserDetails(req,res).then( details =>{
      let userEid = details.eid;
      let invHash = req.params.invHash;
      basic.queryChaincode(peer, channel, chaincode, [invHash], "getDiplomaSupplementInvitesByHash", userEid, org)
      .then( resp =>{
        res.status(200).json(resp);
      }).catch(err =>{
          console.log(err);
          res.status(500);
      });
    }).catch(err =>{
        console.log(err);
        res.status(500);
    });
});





/******************************** ACTIONS ************************/




/*
  Sends a request supplement publication request
  post parameters
  @university (the name of the university)
  @email (the user contact email)
*/
router.post('/request',authorizeAll,(req,res) =>{
    let userDetails = getUserDetails(req,res);
    let universityName = req.body.uniName;
    let universityId = req.body.univId; //user univesrity ID (e.g. ge01117)
    let userEmail = req.body.email;
    // let dateOfBirth = req.body.dateOfBirth;

    userDetails.then( details =>{
      let userEid = details.eid;
      let userFullName = details.firstName + " " + details.familyName;
      let dateOfBirth = details.dateOfBrith;
      console.log([userEid,userFullName, userEid,universityId,userEmail,userEid,universityName,dateOfBirth]);
      basic.invokeChaincode([peerAddr],channel, chaincode, "requestSupplementPublication",
								[userEid,userFullName, userEid,universityId,userEmail,userEid,universityName,dateOfBirth],
								userEid, org)
      .then( resp =>{
        console.log("response");
        console.log(resp);
        res.status(200).json(resp);
      }).catch(err =>{
        res.status(500);
      });
    }).catch(err =>{
        console.log(err);
        res.status(500);
    });
});


/*
  sends an invite to view a specific DS to a user
  identified by his email address
*/
router.post('/inviteByMail',authorizeAll,(req,res) =>{
    let userDetails = getUserDetails(req,res);
    let supId = req.body.supId;
    let email = req.body.email;
    // console.log(supId + email);
    userDetails.then( details =>{
      let inviteHash = supUtils.generateSupplementHash(email,supId,details.userName);
      let eid = details.eid;
      // console.log(inviteHash + eid);
      basic.invokeChaincode([peerAddr], channel, chaincode, "addDiplomaSupplementInvite",
														['{"DSHash":"'+inviteHash+'", "DSId":"'+supId+'","Email":"'+email+'"}',eid],eid, org)
      .then(resp => {
        let emailBody = '<p>Click<a href="'+ process.env.SRV_ADDR + '/supplement/view/invite/'
                          +inviteHash +'"> here</a> to view the shared diploma supplement </p>';
        emailUtil.sendEmail(email,emailBody);
        res.status(200).json(resp);
      }).catch(err =>{
        res.status(500);
      });
    }).catch(err =>{
        res.status(500);
    });
});


/*
  sends an invite to view a specific DS to a user
  identified by his email address by generating a QR code
  and returns the svg generated QR code
*/
router.post('/inviteByQR',authorizeAll,(req,res) =>{
    let userDetails = getUserDetails(req,res);
    let supId = req.body.supId;
    let email = req.body.email;
    // console.log(supId + email);
    userDetails.then( details =>{
      let inviteHash = supUtils.generateSupplementHash(email,supId,details.userName);
      let eid = details.eid;
      // console.log(inviteHash + eid);
      basic.invokeChaincode([peerAddr], channel, chaincode, "addDiplomaSupplementInvite",
														['{"DSHash":"'+inviteHash+'", "DSId":"'+supId+'","Email":"'+email+'"}',eid],eid, org)
      .then(resp => {
        let code = qr.image(process.env.SRV_ADDR+'/supplement/view/invite/'+inviteHash, { type: 'svg' });
        res.type('svg');
        code.pipe(res);
      }).catch(err =>{
        res.status(500);
      });
    }).catch(err =>{
        res.status(500);
    });
});

/*
    Generates a random String and adds it as the DSInvite validationCode
    the invite is identified by its unique hash (inviteHash, DSHash in the cc)
    and then sends an email to the address contained within the invite
*/
router.post('/invite/:inviteHash/sendMail',authorizeAll,(req,res) =>{
    let inviteHash = req.params.inviteHash;
    let validationCode = randomstring.generate(4);

    getUserDetails(req,res).then(details =>{
      let eid = details.eid;
      basic.invokeChaincode([peerAddr], channel, chaincode, "addCodeForDSInvite",
      																	[inviteHash,validationCode],eid, org)
                .then(resp => {
                  let emailBody = '<p>Your validation code is: ' +validationCode+'</p>';
                  console.log(emailBody);
                  basic.queryChaincode(peer, channel, chaincode, [inviteHash], "getDiplomaSupplementInvitesByHash", eid, org)
                  .then( resp =>{
                    let dsInvite = JSON.parse(resp);
                    console.log(dsInvite);
                    emailUtil.sendEmail(dsInvite.Email,emailBody)
                    .then(resp =>{
                      res.status(200).json(resp);
                    }).catch(err =>{
                        res.status(500).send(err);
                    });
                  });
                }).catch(err =>{
                  res.status(500);
                });
    }).catch(err =>{
      console.log(err);
      res.status(500);
    });
});




/*
  checks the given validation code, and if it is contained within
  the invte, updates the invite to include the current user eid (and puts the eid in the allowed set of the ds)
  Finally, redirects to the endpoint to retrieve  the ds contained in the invite
*/
router.post('/invite/:inviteHash/authorize',authorizeAll,(req,res) =>{
    let inviteHash = req.params.inviteHash;
    let validationCode = req.body.validationCode;
    let dsId ="";
    getUserDetails(req,res).then(details =>{
        let eid = details.eid;
        basic.queryChaincode(peer, channel, chaincode, [inviteHash], "getDiplomaSupplementInvitesByHash", eid, org)
        .then( resp =>{
          let dsInvite = JSON.parse(resp);

          if (dsInvite.Code === validationCode){
            dsId = dsInvite.DSId;
            basic.invokeChaincode([peerAddr], channel, chaincode, "addRecepientToDSInvite",
            																		[inviteHash,eid,validationCode],eid, org)
          .then(resp=>{
              console.log(dsInvite);
              res.redirect("../../view/"+dsId);
          }).catch(err =>{
              res.status(500).send(err);
          });
          }else{
            res.status(401).json({"message":"wrong validation code"});
          }
        }).catch(err =>{
            res.status(500).send(err);
        });
    });
});



/*
  takes as input an  array  of emails
  and a supplement Id and removes those emails from the supplement invites
*/
router.post('/removeInvites',(req,res) =>{
  let invitesEmails = req.body.emails.join(";");
  let supId = req.body.supId;
  getUserDetails(req,res).then(details =>{
    let eid = details.eid;
    basic.invokeChaincode([peerAddr], channel, chaincode,"uninvite",
    																			[supId,invitesEmails,eid],eid, org)
    .then(resp =>{
      res.status(200).send("ok");
    })
    .catch(err =>{
        console.log(err);
        res.status(400).send(err);
    });
  });


});
