export default function reducer(state={
  user:{},
  fetching:false,
  fetched: false,
  error: null,
  consent:false
},action){

  switch(action.type){
    case "FECTH_USER":{
        return {...state, fetching:true}
    }
    case "FECTH_USER_REJECTED":{
      return {...state, fetching:false,error:action.payload}

    }
    case "FETCH_USER_FULLFILED":{
        return {...state,
          fetching:false,
          fetched: true,
          user:action.payload
        }
    }
    case "SET_USER_NAME":{
      // return {...state,
      //   user.name: action.payload
      // }
      return state

    }
    case "SET_USER":{
      return {...state,
        user: action.payload
      }
      return state
    }

    case "USER_CONSENT_OK":{
      return {...state, consent:true}
    }

    case "USER_CONSENT_NOK":{
      return {...state, consent:false}
    }

  }
  return state

}
