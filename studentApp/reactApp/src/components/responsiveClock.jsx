import React, { Component } from 'react'
import Clock from "./clock.jsx";


export default class ResponsiveClock extends React.Component {


  // <a href="#!" class="brand-logo" style={{marginLeft: "5rem"}}> e-DS Service</a>

    render(){
      let clockComponent = <span>
                            <a href="#!" class="brand-logo" > <Clock isMain={false}/></a>
                            <a href="#!" class="brand-logo" style={{marginLeft: "2rem"}}> e-DS Service</a>
                        </span>;

      if (typeof(window)!== 'undefined') {
        if(window.innerWidth <= 992){
          clockComponent = <span>
                                <a href="#!" class="brand-logo" style={{left:"30%"}}> <span> <Clock isMain={true}/> e-DS Service<span></a>
                            </span>;
        }
      }
      return clockComponent;
    }



  }
