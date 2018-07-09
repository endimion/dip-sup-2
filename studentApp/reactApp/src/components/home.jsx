import React, { Component } from 'react'
import {Card  , CardPanel, CardTitle, Row, Col} from 'react-materialize'
import {Link} from 'react-router-dom'
import SideNavigation from "./sideNav.jsx"

import '../styles/navbar.css'


import supImg from '../static/img/manage-documents.png';
import accountImg from '../static/img/publish-document.png';
import manageImg from '../static/img/manage-user.png';
import { Cookies, CookiesProvider, CookieBannerUniversal, CookieBanner } from 'react-cookie-banner'

export default class HomePage extends React.Component {

      componentDidMount(){
        $('.button-collapse').sideNav('hide');
      }

      componentWillReceiveProps(){
        $('.button-collapse').sideNav('hide');
      }

      render(){

        const imgStyle = {margin: "0 auto", display: "block"};
        const imgTitleStyle = {width: "100%",
                              background:" rgba(54, 25, 25, .3)"};

        let manageCard = <div className="card">
          <div className="card-image">
            <img src={supImg} style={imgStyle}></img>
            <span className="card-title" style={imgTitleStyle}>Manage Supplements</span>
          </div>
          <div className="card-content">
            <p>View published Supplements on the Blockchain | Manage User Access </p>
          </div>
          <div className="card-action">
            <Link to="/app/manage" style={{color:"#06114e"}}>VIEW SUPPLEMENTS</Link>
          </div>
        </div>;

        let requestCard = <div className="card">
          <div className="card-image">
            <img src={accountImg} style={ {margin: "0 auto", display: "block", width: "59%"}}></img>
            <span className="card-title" style={imgTitleStyle}>Request Supplement</span>
          </div>
          <div className="card-content">
            <p>Request the publication of a Diploma Supplement on the Blockchain</p>
          </div>
          <div className="card-action">
            <Link to="/app/request" style={{color:"#06114e"}}>SUBMIT A REQUEST</Link>

          </div>
        </div>;

        let accountCard = <div className="card">
          <div className="card-image">
            <img src={manageImg} style={ {margin: "0 auto", display: "block", width: "65%"}}></img>
            <span className="card-title" style={imgTitleStyle}>Manage Account</span>
          </div>
          <div className="card-content">
            <p>Review Your Profile Details</p>
          </div>
          <div className="card-action">
            <Link to="/app/account" style={{color:"#06114e"}}>MY PROFILE</Link>
          </div>
        </div>;


        const cookies = new Cookies(/* Your cookie header, on browsers defaults to document.cookie */)


        const styles = {
              banner: {
                fontFamily: 'Source Sans Pro',
                height: 57,
                background: 'rgba(52, 64, 81, 0.88) url(/cookie.png) 20px 50% no-repeat',
                backgroundSize: '30px 30px',
                backgroundColor: '',
                fontSize: '15px',
                fontWeight: 600,
                clear: 'both',
                position: 'relative',
                zIndex: '10',
                height: '3em',
                marginTop: '-3em'
              },
              button: {
                border: '1px solid white',
                borderRadius: 4,
                width: 66,
                height: 32,
                lineHeight: '32px',
                background: 'transparent',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                opacity: 1,
                right: 20,
                marginTop: -18
              },
              message: {
                display: 'block',
                padding: '9px 67px',
                lineHeight: 1.3,
                textAlign: 'left',
                marginRight: 244,
                color: 'white'
              },
              link: {
                textDecoration: 'none',
                fontWeight: 'bold'
              }
            }

        // let CookieLink = React.createClass({
        //                     render: function() {
        //                         return <a href="https://docs.google.com/document/d/1JpXJIOfo8FodjI1MvEFVRxC846VIW2ySlTdTkQ_Ctb4/edit?usp=sharing">More information on our use of cookies</a>
        //                     }
        //                 });
        // let cookieConset = <CookiesProvider cookies={cookies}>
        //                     <CookieBannerUniversal
        //                       styles={styles}
        //                       message="This site use cookies only to make user authentication more user friendly. "
        //                       link="https://docs.google.com/document/d/1JpXJIOfo8FodjI1MvEFVRxC846VIW2ySlTdTkQ_Ctb4/edit?usp=sharing" //<CookieLink style={styles.link} />
        //                       buttonMessage='OK'
        //                       dismissOnScroll={false}
        //                       onAccept={() => {}}
        //                       cookie="user-has-accepted-cookies" />
        //                       </CookiesProvider>
        //                   ;
        let message= "This site use cookies only to make user authentication more user friendly. ";
        let cookieConset = <CookieBanner
                              styles={styles}
                              message={message}
                              link={<a href='http://nocookielaw.com/'>More information on our use of cookies</a>}
                              buttonMessage='Close'
                              dismissOnScroll={false}
                              dismissOnClick={true}
                              onAccept={() => {}}
                            />;

        return (  <div className="main container" style={{marginTop: "3%"}}>
              <Row key={1}>
                <Col s={12} m={6}className='grid-example'>{requestCard}</Col>
                <Col s={12} m={6} className='grid-example'>
                    {manageCard}
                </Col>
              </Row>
              <Row>
                <Col s={12} m={6} className='grid-example'>
                        {accountCard}
                </Col>
                {cookieConset}
              </Row>
            </div>
            );



    }

}
