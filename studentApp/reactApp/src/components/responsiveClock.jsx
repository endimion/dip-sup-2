import React, { Component } from 'react'
import Clock from "./clock.jsx";


export default class ResponsiveClock extends React.Component {



    render(){
      let clockComponent = <span>
                            <a href="#!" class="brand-logo" > <Clock isMain={false}/></a>
                            <a href="#!" class="brand-logo" style={{marginLeft: "2rem"}}> e-DS Service</a>
                        </span>;

      if (typeof(window)!== 'undefined') {
        alert("hi");
        if(window.innerWidth <= 992){
            alert("small");
          clockComponent = <span>
                                <a href="#!" class="brand-logo" style={{left:"30%"}}> <Clock isMain={true}/></a>
                                // <a href="#!" class="brand-logo" style={{marginLeft: "5rem"}}> e-DS Service</a>
                            </span>;
        }
      }
      return clockComponent;
    }



  }
