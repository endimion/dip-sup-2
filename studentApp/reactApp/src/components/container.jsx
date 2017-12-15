//This will be inside src/components

import React, { Component } from 'react'
import {connect} from 'react-redux'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

import {sideBarOnOff} from '../actions/sideBarActions'
import {setUser } from '../actions/userActions'

import { withCookies, Cookies } from 'react-cookie';


import TweetList from "./tweetList.jsx"
import NavigationBar from "./navBar.jsx"
import SideNavigation from "./sideNav.jsx"
import Dummy from "./dummy.jsx"
import HomePage from "./home.jsx"
import Supplements from "./supplements.jsx"
import EditSup from "./editSupplement.jsx"
import RequestSupplementCard from "./requestSupplementCard.jsx"

@connect( (store)=>{
  return { user: store.user.user,
        };
})
export default class Container extends React.Component {

  constructor(props) {
    super(props);
  }


    componentWillMount(){
      const { cookies } = this.props;
      const  userAccount = {
        firstName: "Nikos ",
        lastName: "Trintafylloy",
        email: "test@test.gr",
        userName: "handlename",
        eid: "123"
        };

      // let  name = cookies.get('name') || 'Ben';

      this.props.dispatch(setUser(userAccount));
    }

    render(){
      const  {user,tweets,sideNav} = this.props;

      // let root = () => <div><NavigationBar user={user}/><Dummy user={user}/></div>;
      let home = () => <div><NavigationBar user={user}/><HomePage user={user}/></div>;
      let manage = () => <div><NavigationBar user={user}/><Supplements user={user} /></div>;
      let request = () => <div><NavigationBar user={user}/><RequestSupplementCard name={"user"} eID={"eID"}/></div>;
      let edit = ({match}) => (<div><NavigationBar user={user}/><EditSup match={match}/></div> );


      return  <Router>
                  <Switch>
                    <Route path="/" exact component={home} />
                    <Route path="/test" exact component={home} />
                    <Route path="/home" exact component={home} />
                    <Route path="/manage" exact component={manage} />
                    <Route path="/request" exact component={request} />
                    <Route path="/edit/:id" component={edit}/>
                  </Switch>
                </Router>

      // return null;
    }

}
