import React, {Component} from 'react';
import './styles/LSform.css';
import {connect} from 'react-redux';
import MiniLoader from './MiniLoader';

class Login extends Component{
    state = {
        showForm: false,
        errors: {
            email: '',
            password: ''
        },
        loggingIn: false
    }

    abortController = new AbortController();
    aborted = false;

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
    resetErrors(){
        this.setState({errors: {
                email: '',
                password: ''
            }
        });
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
                    this.props.logUserIn(data.user);
                    // this.props.setUser(data.user); :delete this line
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
    submitForm = async (e)=>{
        e.preventDefault();
        if(this.state.loggingIn) return;
        let form = e.target;
        let email = form.email.value.trim();
        let password = form.password.value;
        let remember = form.remember.checked;
        this.resetErrors();
        try{
            this.setState({loggingIn: true});
            let response = await fetch('/api/login',
            {   
                signal: this.abortController.signal,
                method: "post",
                headers: {'Content-Type': "application/json"},
                body: JSON.stringify({email, password, remember})
            });
            let data = await response.json();
            if(data.errors){
                this.setState({errors: data.errors, loggingIn: false});
            } else {
                if(data.user){
                    //store it in redux
                    this.props.logUserIn(data.user);
                } else {
                    throw new Error("unexpected error");
                }
            }
        }
        catch(err){
            //handle these errors (unexpected errors)
            if(this.aborted) return;
            console.log(err);
            this.setState({
                loggingIn: false,
                errors: {
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
                    {this.state.loggingIn?<MiniLoader/>:null}
                    <div className="header">Log in</div>
                    <form onSubmit={this.submitForm}>
                    <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" required autoComplete='off'/>
                        <div className="email error">{this.state.errors.email}</div>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" required/>
                        <div className="password error">{this.state.errors.password}</div>
                        <div className="remember">
                            <input type="checkbox" name="remember" id="remember"/>
                            <span>Remember me</span>
                        </div>
                        <button type="submit">{this.state.loggingIn?'wait..':'Log in'}</button>
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
export default connect(mapStateToProps, mapDispatchToProps)(Login);