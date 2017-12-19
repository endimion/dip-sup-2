import React, { Component } from 'react'
import {connect} from 'react-redux'

import {  Card  , CardPanel, Icon,
          Tag, Modal, Button, ProgressBar,
          CollectionItem, Collection,
          Row, Col,input} from 'react-materialize'


import RequestSupplementModal from "./requestSupplementModal.jsx"

import {  getInvAndGenValCode
        } from "../actions/inviteActions"


@connect( (store)=>{
  return {  eId: store.user.user.eid,
            fetching : store.invite.fetching,
            message : store.invite.message,
            supplements: store.invite.supplements,
            validate: store.invite.validate
        };
})
export default class InviteViewCard extends React.Component {

  constructor(props) {
    super(props);
    this.validateInvite = this.validateInvite.bind(this);
  }

  validateInvite(){
    //this.props.dispatch(requestPublication(university,userName,eId,universityId,email));
  }

  componentDidMount(){
      let id = this.props.inviteId;
      this.props.dispatch(getInvAndGenValCode(id));
  }

  render(){
    if(this.props.fetching){
      return (<div>
              <div>this.props.message</div>
                <ProgressBar />
              </div>);
    }else{
      return (
        <div>Not fetching</div>
      );
    }


  }
}
