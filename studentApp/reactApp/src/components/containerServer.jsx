//This will be inside src/components

import React, { Component } from 'react'
import {connect} from 'react-redux'
import {
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'
import StaticRouter from 'react-router-dom/StaticRouter';

import {sideBarOnOff} from '../actions/sideBarActions'
import {setUser } from '../actions/userActions'

import { withCookies, Cookies } from 'react-cookie';

import {  Card  , CardPanel, Icon,
          Tag, Modal, Button, ProgressBar,
          CollectionItem, Collection,
          Row, Col,input} from 'react-materialize'



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
      // const { cookies } = this.props;
      // const  userAccount = {
      //   firstName: "Nikos ",
      //   lastName: "Trintafylloy",
      //   email: "test@test.gr",
      //   userName: "handlename",
      //   eid: "123"
      //   };

      // let  name = cookies.get('name') || 'Ben';
      // console.log("User:");
      // console.log(this.props.usr);
      // this.props.dispatch(setUser(this.props.usr));
    }

    render(){
      const  {user,tweets,sideNav} = this.props;

      // let root = () => <div><NavigationBar user={user}/><Dummy user={user}/></div>;
      let home = () => <div><NavigationBar user={user}/><ProgressBar /></div>;
      let manage = () => <div><NavigationBar user={user}/><ProgressBar /></div>;
      let request = () => <div><NavigationBar user={user}/><ProgressBar /></div>;
      let edit = ({match}) => (<div><NavigationBar user={user}/><ProgressBar /></div> );


      return  <StaticRouter location={this.props.location} context={this.props.context}>
                  <Switch>
                    <Route path="/app/" exact component={home} />
                    <Route path="/app/test" exact component={home} />
                    <Route path="/app/home" exact component={home} />
                    <Route path="/app/manage" exact component={manage} />
                    <Route path="/app/request" exact component={request} />
                    <Route path="/app/edit/:id" component={edit}/>
                  </Switch>
                </StaticRouter>

      // return null;
    }

}
