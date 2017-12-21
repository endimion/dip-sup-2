import React, { Component } from 'react'
import {Navbar, NavItem, Button, Icon} from 'react-materialize'
import {Link,NavLink} from 'react-router-dom'
import SideNavigation from "./sideNav.jsx"

import {  Card  , CardPanel, Icon,
          Tag, Modal, Button, ProgressBar,
          CollectionItem, Collection,
          Row, Col,input, Preloader} from 'react-materialize'


export default class ServerLoading extends React.Component {


      render(){
        let user = this.props.user;
        return (
            <div>
              <NavigationBar user={user}/>
              <div className ="container" style={{marginTop:"2em"}}>
                <div className="row" style={{marginLeft:"50%"}}>
                  <Preloader  size="big" flashing />
                </div>
              </div>
            </div>
          )  ;

    }

}
