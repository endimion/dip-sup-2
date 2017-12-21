
import DS from "../assets/fakeDS"

import axios from "axios"


export function  updateCode(code) {
  return  function(dispatch){
      dispatch({type: "UPDATE_CODE",payload:code} );
}};


export function sendValidation(_code,invHash){
  return function(dispatch){
    axios.post("/back/supplement/rest/invite/"+invHash+"/authorize",
                    { validationCode:_code,
                      inviteHash: invHash
              }).then(res =>{
                  dispatch({type: "GET_INV_SUP_FULLFILED", payload:JSON.parse(res.data)});
    }).catch(err =>{
      dispatch({type:"GET_INV_REJECTED",payload:err});

    })
  }

}


export function  getInvAndGenValCode(inviteId) {
  return  function(dispatch){
      dispatch({type: "GET_INV"} );
      console.log("the id is "+ inviteId);
      axios.get("/back/supplement/rest/invite/"+inviteId)
         .then(response =>{
           let invite = JSON.parse(response.data);
           // console.log(invite)  ;
           dispatch({type: "GET_INV_FULLFILED",payload:invite})
           let promise = new Promise(function(resolve, reject){
                resolve({recip: invite.Recipient, id: invite.DSId});
           });
           return promise;
         }).then( res =>{
            console.log(res);
            let recipient = res.recip;
            let id = res.id;
            if(recipient!== ""){
                //$.get("/supplement/rest/view/"+invite.DSId).done(resp=>{
                dispatch({type: "GET_INV_SUP"});
                axios.get("/back/supplement/rest/view/"+id).then( resp =>{
                  dispatch({type: "GET_INV_SUP_FULLFILED", payload:JSON.parse(resp.data)});
                });
            }else{
                dispatch({type: "SEND_VAL_CODE"});
                axios.post("/back/supplement/rest/invite/"+inviteId+"/sendMail").then(resp =>{
                  dispatch({type: "SEND_VAL_CODE_FULLFILED"});
                })
            }
         })
         .catch(err =>{
           dispatch({type:"GET_INV_REJECTED",payload:err})
         });


  }

}

export function  openShareByMail(supId) {
  return  function(dispatch){
     dispatch({type: "OPEN_SHARE_BY_MAIL"} );
      console.log(supId)  ;
     $('#mailModal'+supId).modal('open');
  }
}

export function  shareByMail(_supId,_email) {
  return  function(dispatch){
  dispatch({type: "SHARE_SUP"});
  let data = {email: _email, supId: _supId };

       axios.post("/back/supplement/rest/inviteByMail",data)
        .then(response =>{
          dispatch({type: "SHARE_SUP_FULLFILED"});
          console.log('#modal'+_supId);
          $('#mailModal'+_supId).modal('close');
        })
        .catch(err=>{
          dispatch({type:"SHARE_SUP_REJECTED",payload:err.toString()})
        });
  }
}




export function  openShareByQR(supId) {
  return  function(dispatch){
     dispatch({type: "OPEN_SHARE_BY_QR"} );
      console.log(supId)  ;
     $('#qrModal'+supId).modal('open');
  }
}

export function  shareByQR(_supId,_email) {
  return  function(dispatch){
  dispatch({type: "SHARE_SUP_QR"});
       axios.post("/back/supplement/rest/inviteByQR",{"supId":_supId, "email":_email})
        .then(response =>{
          // console.log(response);
          dispatch({type: "SHARE_SUP_QR_FULLFILED",
                    //payload:'<svg width="100" height="100"><circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" /></svg>'
                      payload:response.data
                  });
        })
        .catch(err=>{
          dispatch({type:"SHARE_SUP_QR_REJECTED",payload:err.toString()})
        });
  }
}
