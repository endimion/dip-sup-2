import React, { Component } from 'react'
import {connect} from 'react-redux'

import {  Card  , CardPanel, Icon,
          Tag, Modal, Button, ProgressBar,
          CollectionItem, Collection,
          Row, Col,input} from 'react-materialize'


import RequestSupplementModal from "./requestSupplementModal.jsx"

import { updateCode
        } from "../actions/inviteActions"


@connect( (store)=>{
  return {
            code: store.invite.code
        };
})

export default class ValidateCard extends React.Component {

  constructor(props) {
    super(props);
    this.updateCode = this.updateCode.bind(this);
    this.sendValidation = this.sendValidation.bind(this);
  }

  sendValidation(){
    let university = this.props.university;
    // this.props.dispatch(requestPublication(university,universityId,email));
  }


  updateCode(code){
    this.props.dispatch(updateCode(code));
  }


componentDidMount(){
    // $(document).ready(function() {
    //   $('select').material_select();
    // });
    // $(this.refs.mySelectBox).on('change',this.updateUnivValue);
  }




  render(){
    return (
      <div>
        <div className="container" style={{marginTop:"2em"}}>
        <Row>
          <div className="input-field col s6">
            <input id="code" type="text" class="validate" onChange={e =>this.updateCode(e.target.value)}/>
            <label for="Code">Validation Code</label>
          </div>
        </Row>
         <Row>
            <Button onClick={this.sendPubrequest}>Submit</Button>
        </Row>
      </div>
    </div>

    );
  }
}
