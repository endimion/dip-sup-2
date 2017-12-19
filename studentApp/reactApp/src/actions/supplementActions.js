
import DS from "../assets/fakeDS"

import axios from "axios"

export function  getSupplementsByEid(userEid) {
  return  function(dispatch){
    console.log(userEid);
       dispatch({type: "GET_SUP"} );
       //here we should make an Ajax call with axios
      // on success it should return GET_SUP_FULLFILED else GET_SUP_REJECTED
      setTimeout(function () {
        // axios.get("http://rest.learncode.academy/api/test123/tweets")
        axios.get("/back/supplement/rest/view")
         .then(response =>{
           // dispatch({type: "GET_SUP_FULLFILED",payload:DS})
            dispatch({type: "GET_SUP_FULLFILED",payload:JSON.parse(response.data)})
         })
         .catch(err=>{
           dispatch({type:"GET_SUP_REJECTED",payload:err})
         });
      }, 2000);


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

  setTimeout(function () {
       axios.post("/back/supplement/rest/inviteByMail",data)
        .then(response =>{
          dispatch({type: "SHARE_SUP_FULLFILED"});
          console.log('#modal'+_supId);
          $('#mailModal'+_supId).modal('close');
        })
        .catch(err=>{
          dispatch({type:"SHARE_SUP_REJECTED",payload:err.toString()})
        });
     }, 2000);
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
  setTimeout(function () {
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
     }, 2000);
  }
}
