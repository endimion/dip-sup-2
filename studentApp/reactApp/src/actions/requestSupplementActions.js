import axios from "axios"


export function requestPublication(university,username,eID,universityId,email) {
  return  function(dispatch){
     console.log("wil dispatch");
     dispatch({type:"PUBLISH_MODAL_OPEN"});
     dispatch({type:"REQUEST_PUBLISH_SENT"});
    $('#modal1').modal('open');
     axios.get("http://rest.learncode.academy/api/test123/tweets")
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
