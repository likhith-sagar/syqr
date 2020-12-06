import React, {Component} from 'react';
import {Link} from 'react-router-dom';


class Homescreen extends Component{
    render(){
        return (
            <div className="homescreen">
                <div className="top">
                    <div className="heading">
                        <div className="title">SYQR</div>
                        <div className="sub-title">Simple QR-Code and Short-Link creating platform</div>
                    </div>
                </div>
                <p className="para">Create your QR-code in three simple steps!</p>
                <div className="mid">
                    <div className="block">
                        <div className="icon">
                            <i className="fa fa-user"></i>
                        </div>
                        <div className="text">
                            step 1: Create Account and login
                        </div>
                    </div>
                    <div className="block">
                        <div className="icon">
                            <i className="fa fa-qrcode"></i>
                        </div>
                        <div className="text">
                            step 2: Create your QR-code
                        </div>
                    </div>
                    <div className="block">
                        <div className="icon">
                            <i className="fa fa-share-alt"></i>
                        </div>
                        <div className="text">
                            step 3: Share your QR-code
                        </div>
                    </div>
                </div>
                <div className="started">
                    <Link to="/login">Lets get started!</Link>
                </div>
            </div>
        )
    }
}

export default Homescreen;