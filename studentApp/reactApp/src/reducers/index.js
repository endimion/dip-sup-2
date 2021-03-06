import {combineReducers} from "redux"

// import tweets from "./tweetReducer"
import user from "./userReducer"
// import sideNav from "./sideNavReducer"
import sups from "./supplementsReducer"
import edit from "./editSupReducer"
import publish from "./requestPubReducer"
import invite from "./invitesReducer"
import clock from "./clockReducer"

export default combineReducers({
                  user,
                  sups,
                  edit,
                  publish,
                  invite,
                  clock
})
