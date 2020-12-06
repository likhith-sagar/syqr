import React, {Component} from 'react';
import {withRouter, NavLink} from 'react-router-dom';
import './styles/Navbar.css';
import {connect} from 'react-redux';
import './styles/toggleSwitch.css';

class Navbar extends Component{
    state = {
        links: []
    }
    static getDerivedStateFromProps(props, state){
        let links = [];
        if(props.loading){
            return {...state, links};
        }
        let loggedIn = props.loggedIn; //later get state from redux
        if(loggedIn){
            links = [
                {name: 'Home', url: '/dashboard'},
                {name: 'Create', url: '/dashboard/create'},
                {name: 'Account'}
            ];
        } else {
            links = [
                {name: 'Log in', url: '/login'},
                {name: 'Sign up', url: '/signup'}
            ];
        };
        return {...state, links};
    }
    logOut = async (e)=>{
        try{
            if(this.props.loggedIn){
                this.props.startLoader();
                let response = await fetch('/api/logout');
                let data = await response.json();
                if(data.status){
                    this.props.logUserOut();
                    this.props.setNotification({msg: "logged out successfully!", type: true});
                }
                this.props.stopLoader();
            }
            this.props.history.replace('/login');   
        }
        catch(err){
            //unexpected errors
            console.log(err);
            this.props.setNotification({msg: "error! try again", type: false});
        }
    }
    render(){
        let links = this.state.links.map((link,i)=>{
            if(link.url){
                return(
                    <li key={i}><NavLink exact to={link.url}>{link.name}</NavLink></li>
                );
            } else {
                return(
                    <li key={i} className='acc'>
                        <button>{link.name}</button>
                        <ul className="sub">
                <li><NavLink exact to='/dashboard/account'>{this.props.user.name}</NavLink></li>
                            <li>
                                <div className='dmode'>
                                    <label>Dark mode</label>
                                    <label className="switch">
                                        <input type="checkbox" name="dmode" id="dmode"/>
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </li>
                            <li><div className='logout-btn' onClick={this.logOut}>Logout</div></li>
                        </ul>
                    </li>
                )
            }
        });
        return(
            <nav>
                <div className="nav-container">
                <span className='title'><NavLink exact to="/">SyQR</NavLink></span>
                <ul className='navlinks'>
                    {links}
                </ul>
                </div>
            </nav>
        )
    }
}

function mapStatesToProps(state, ownProps){
    return {
        loggedIn : state.loggedIn,
        loading: state.loading,
        user: state.user
    }
}
function mapDispatchToProps(dispatch){
    return {
        startLoader: ()=>{
            dispatch({
                type: 'LOADER',
                 status: true
            });
        },
        stopLoader: ()=>{
            dispatch({
                type: 'LOADER',
                 status: false
            });
        },
        logUserOut: ()=>{
            dispatch({
                type: 'LOG_OUT'
            });
        },
        setNotification: (notification)=>{
            dispatch({
                type: "NOTIFICATION",
                notification
            });
        }
    }
}
export default connect(mapStatesToProps, mapDispatchToProps)(withRouter(Navbar));