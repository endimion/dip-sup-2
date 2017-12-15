import React, { Component } from 'react'
import {SideNav, SideNavItem, Button, Icon} from 'react-materialize'


import officeImg from '../static/img/office.jpg';
import accountImg from '../static/img/user.png';

export default class SideNavigation extends React.Component {
    render(){
      const user = this.props.user;
      return   <SideNav
                	trigger={this.props.trig}
                	options={{ closeOnClick: true }}
                  ref={this.props.inputRef}
                	>
                	<SideNavItem userView
                		user={{
                			background: officeImg,
                			image: accountImg,
                			name: user.firstName + " " + user.lastName,
                			email: user.email,
                      userName: user.userName

                		}}
                	/>
                	<SideNavItem divider />
                	<SideNavItem >Logout</SideNavItem>

                </SideNav>
    }

}
