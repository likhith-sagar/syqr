import React, {Component} from 'react';
import './styles/LSform.css';
import {connect} from 'react-redux';
import MiniLoader from './MiniLoader';

class Signup extends Component{
    state = {
        showForm: false,
        errors: {
            email: '',
            password: ''
        },
        signingUp: false
    }

    abortController = new AbortController()
    aborted = false

    static getDerivedStateFromProps(props, state){
        let loggedin = props.loggedIn; //get from redux
        let newState = {...state};
        if(loggedin){
            props.history.replace('/dashboard');
        } else {
            newState.showForm = true;
        }
        return newState;
    }
    async componentDidMount(){
        //set first time to false
        //startloading screen
        //check if user is remembered (make req to server)
        //if so login the user n redirect to dashboard
        //else stoploader n show him the form
        try{
            if(this.props.firstTime){
                this.props.turnOffFirstTime();
                this.props.startLoader();
                let response = await fetch('/api/isLoggedIn');
                let data = await response.json();
                if(data.status){
                    // this.props.setUser(data.user); :delete this line
                    this.props.logUserIn(data.user);
                } else {
                    this.props.stopLoader();
                }
            }
        } catch(err){
            console.log(err);
            this.props.stopLoader();
            //handle errors like no connection
            this.props.setNotification({
                msg: "Unexpected error! try again",
                type: false
            });
        }
    }
    resetErrors(){
        this.setState({errors: {
                name: '',
                email: '',
                password: ''
            }
        });
    }
    submitForm = async (e)=>{
        e.preventDefault();
        if(this.state.signingUp) return;
        this.resetErrors();
        let name = e.target.name.value.trim();
        let email = e.target.email.value.trim();
        let password = e.target.password.value;
        let confirm_password = e.target.confirm_password.value;
        if(password !== confirm_password){
            this.setState({errors: {
                    name: '',
                    email: '',
                    password: 'password confirmation failed'
                }
            });
            return;
        }
        try{
            this.setState({signingUp: true});
            let response = await fetch('/api/signup',
            {
                signal: this.abortController.signal,
                method: "post",
                headers: {'Content-Type': "application/json"},
                body: JSON.stringify({email, password, name})
            });
            let data = await response.json();
            if(data.errors){
                this.setState({errors: data.errors, signingUp: false});
            } else {
                if(data.status){
                    //redirect user to login page for loging in
                    //show message for successfull account creation
                    this.props.setNotification({
                        msg: "Account created successfully! Login to continue...",
                        type: true
                    });
                    this.props.history.replace('/login');
                } else {
                    throw new Error("Unexpected error");
                }
            }
        }
        catch(err){
            //handle these errors (unexpected errors)
            console.log(err);
            if(this.aborted) return;
            this.setState({
                signingUp: false,
                errors: {
                    name: '',
                    email: 'try again',
                    password: 'try again'
                }
            });
            this.props.setNotification({
                msg: "Unexpected error! try again",
                type: false
            });
        }
    }

    componentWillUnmount(){
        this.aborted = true;
        this.abortController.abort();
    }

    render(){
        if(this.state.showForm)
            return(
                <div className="my-form">
                    {this.state.signingUp?<MiniLoader/>:null}
                    <div className="header">Sign up</div>
                    <form onSubmit={this.submitForm}>
                        {/* <label htmlFor="name">Name</label> */}
                        <input type="text" name="name" id="name" required autoComplete='no' placeholder="name"/>
                        <div className="name error">{this.state.errors.name}</div>
                        {/* <label htmlFor="email">Email</label> */}
                        <input type="email" name="email" id="email" required autoComplete='no' placeholder="email"/>
                        <div className="email error">{this.state.errors.email}</div>
                        <div className="input-row">
                            <div className="input-block">
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" id="password" required />
                            </div>
                            <div className="input-block">
                                <label htmlFor="password">Confirm</label>
                                <input type="password" name="confirm_password" id="confirm_password" required />
                            </div>
                        </div>
                        <div className="password error">{this.state.errors.password}</div>
                        <button type="submit">{this.state.signingUp?'wait..':'Sign up'}</button>
                    </form>
                </div>
            )
        else 
                return(
                    <div></div>
                )
    }
}
function mapStateToProps(state, ownProps){
    return {
        loggedIn: state.loggedIn,
        firstTime: state.firstTime
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
        turnOffFirstTime: ()=>{
            dispatch({
                type: 'FIRST_TIME_OFF'
            });
        },
        logUserIn: (user)=>{
            dispatch({
                type: 'LOG_IN',
                user
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
export default connect(mapStateToProps, mapDispatchToProps)(Signup);