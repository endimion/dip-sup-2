export default function reducer(state={
  modal:false,
  univId:"",
  email:"",
  univsersity:"",
  sendingRequest:false
},action){

  switch(action.type){
    case "REQUEST_PUBLISH_SENT":{
      return {...state, sendingRequest:true}
    }
    case "REQUEST_PUBLISH_FULLFILED":{
      return {...state, sendingRequest:false,removedUser:true,usersToRem:[]}
    }
    case "REQUEST_PUBLISH_REJECTED":{
      return {...state, sendingRequest:false,removedUser:true,remError:action.payload}
     }
    case "PUBLISH_MODAL_OPEN":{
      return {...state,modal:true}
    }
    case "PUBLISH_MODAL_CLOSE":{
      return {...state,modal:false}
    }
    case "UPDATE_UNIVID":{
      return {...state,univId:action.payload}
    }
    case "UPDATE_UNINIVERSITY":{
      return {...state,university:action.payload}
    }
    case "UPDATE_EMAIL":{
      return {...state,email:action.payload}
    }
  }
  return state
}
