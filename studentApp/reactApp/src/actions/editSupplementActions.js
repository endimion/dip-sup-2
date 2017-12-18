import axios from "axios"

export function addUserToRem(userEmail) {
    return {
        type: "ADD_USER_REM",
        payload: userEmail
      }
}

export function remUsers(supplementId,users) {
  return  function(dispatch){
     console.log("wil dispatch");
     dispatch({type:"MODAL_OPEN"});
     dispatch({type:"REM_USERS_SENT"});
     console.log("wil open");

     let data = {};
     data.supId = supplementId;
     data.emails = users;

    $('#modal1').modal('open');
     axios.post("/supplement/rest/removeInvites",data)
     .then(response =>{
       dispatch({type:"REM_USERS_FULLFILED",payload:response.data})
       dispatch({type:"MODAL_CLOSE"});
        $('#modal1').modal('close');
     })
     .catch(err=>{
       dispatch({type:"REM_USERS_REJECTED",payload:err})
     });

   }
}
