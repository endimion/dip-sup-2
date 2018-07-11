import Cookies from 'universal-cookie';

export function fetchUser() {
 return {
      type: "FETCH_USER_FULLFILED",
      payload: {
        name:"Nikos",
        age: "34"
      }
    }
}


export function setUserName(name) {
 return {
      type: "SET_USER_NAME",
      payload: name
    }
  }

export function setUser(user) {
 return {
      type: "SET_USER",
      payload: user
    }
}

 export function logout(){
   document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
   const cookies = new Cookies();
   cookies.remove('access_token');
   window.location="/";
   return { type:"LOG_OUT"
          }
 }


 export function reduceTime(minutes,seconds){
   console.log("reduce time called with ", minutes, seconds);

   if(minutes === 0 && seconds === 0){
      document.cookie = "access_token" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;';
     window.location="/app/logout";
     return { type:"LOG_OUT"}
   }else{
     return function(dispatch){
       dispatch({type: "REDUCE_SECOND",payload: ""} );
    }
  }
}




 export function restartClock(){
   return function(dispatch){
     dispatch({  type: "RESTART_CLOCK",
       payload: ""} );
   }

 }



 export function consentClick(prevConsentValue) {
     return {
          type: "CONSENT_CHANGE",
          payload: !prevConsentValue
        }
 }
