import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Card  , CardPanel, ProgressBar, Row, Col} from 'react-materialize'
import {Link} from 'react-router-dom'

import {logout } from '../actions/supplementActions'

import SupplementCard from './supplementCard.jsx'



@connect( (store)=>{
  return { user: store.user.user,
        };
})
export default class  AccountInfo extends React.Component {

  constructor(props) {
      super(props);
  }

  componentDidMount(){
  }

 render(){
      return (  <div className="main container" style={{marginTop: "3%"}}>
                  <div className="row">
                    <div className="col s12">
                      Your Personal Information
                    </div>
                  </div>
                  <div className="row">
                    <form className="col s12">
                      <div className="row">
                        <div className="input-field col s12">
                          <input id="userName" type="text" />
                          <label for="userName" value={user.userName}   data-success="right">User Name</label>
                        </div>
                        <div className="input-field col s12">
                          <input id="currentFamilyName" type="text" />
                            <label for="currentFamilyName" value={user.currentFamilyName}  data-success="right">Family Name</label>
                        </div>
                        <div className="input-field col s12">
                          <input id="currentGivenName" type="text" />
                            <label for="currentGivenName" value={user.currentGivenName}  data-success="right">Given Name</label>
                        </div>
                        <div className="input-field col s12">
                          <input id="dateOfBirth" type="text" />
                            <label for="dateOfBirth" value={user.dateOfBirth}  data-success="right">Date of Birth</label>
                        </div>
                        <div className="input-field col s12">
                          <input id="personIdentifier" type="text" />
                            <label for="personIdentifier" value={user.personIdentifier}  data-success="right">Person Identifier</label>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
          );
  }
}
