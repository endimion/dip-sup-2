import axios from "axios"


export function requestPublication(university,username,eID,universityId,email,date) {
  return  function(dispatch){
     console.log("wil dispatch");
     dispatch({type:"PUBLISH_MODAL_OPEN"});
     dispatch({type:"REQUEST_PUBLISH_SENT"});
    $('#modal1').modal('open');
     axios.post("/supplement/rest/request",{uniName:university,email:email, univId:universityId, dateOfBirth:date})
     .then(response =>{
       dispatch({type:"REQUEST_PUBLISH_FULLFILED",payload:response.data})
       dispatch({type:"PUBLISH_MODAL_CLOSE"});
        $('#modal1').modal('close');
     })
     .catch(err=>{
       dispatch({type:"REQUEST_PUBLISH_REJECTED",payload:err})
     });

   }
}


export function updateUnivId(universityId) {
     return {type:"UPDATE_UNIVID" ,payload:universityId};
}

export function updateUniversity(university) {
     return {type:"UPDATE_UNINIVERSITY", payload:university};
}

export function updateEmail(mail) {
     return {type:"UPDATE_EMAIL",payload:mail};
}
