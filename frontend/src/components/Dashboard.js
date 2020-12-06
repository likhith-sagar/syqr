import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import Create from './Create';
import QrList from './QrList';
import Edit from './Edit';
import Account from './Account';
import E404 from './404';
import qrcode from 'qrcode-generator';

class Dashboard extends Component{
    state = {
        show: false
    }
    static getDerivedStateFromProps(props, state){
        if(props.loggedIn){
            return {...state, show: true}
        }
        return state;
    }
    addImgSrc = async (qrcodes)=>{
        for(let i=0; i<qrcodes.length; i++){
            let typeNumber = qrcodes[i].typeNumber;
            let errorCorrectionLevel = 'M';
            let qr = qrcode(typeNumber, errorCorrectionLevel);
            qr.addData("http://"+this.props.baseUrl+qrcodes[i].custom);
            qr.make();
            qrcodes[i].imgSrc = qr.createDataURL(10,5);
        }
    }
    async componentDidMount(){
        //get data, if received, login the user if not
        //store data to redux
        //if no data received, logout the user n redirect to login page
        try{
            this.props.startLoader();
            let response = await fetch('/api/getData');
            let data = await response.json();
            if(data.status){
                if(!this.props.loggedIn){
                    // this.props.setUser(data.user); :delete this line
                    this.props.logUserIn(data.user);
                }
                // store baseurl in redux
                this.props.setBaseUrl(data.baseUrl);
                // add qr code image data to all qr data
                this.addImgSrc(data.data);
                // store qr data to redux
                this.props.setQrs(data.data);
                this.props.stopLoader();
            } else {
                this.props.logUserOut();
                this.props.stopLoader();
                this.props.history.push('/login');
            }
        }
        catch(err){
            console.log(err);
            this.props.stopLoader();
            //handle these errors later (unexpected errors)
            this.props.setNotification({
                msg: "Unexpected error! try again",
                type: false
            });
        }
    }
    render(){
        if(this.state.show){
            return(
                <div className="dashboard">
                    {/* <h1>This is Dashboard(home)</h1>
                    <p>here, we'll be having list of all the qr codes</p> */}
                    <Switch>
                        <Route exact path='/dashboard' component = {QrList} />
                        <Route path='/dashboard/create' component = {Create} />
                        <Route path='/dashboard/edit/:id' component = {Edit} />
                        <Route path='/dashboard/account' component = {Account} />
                        <Route component = {E404} />
                    </Switch>
                    

                </div>

            )
        } else {
            return (
                <div></div>
            )
        }
    }
}

function mapStateToProps(state, ownProps){
    return {
        loggedIn: state.loggedIn,
        qrcodes: state.qrcodes,
        baseUrl: state.baseUrl
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
        logUserIn: (user)=>{
            dispatch({
                type: 'LOG_IN',
                user
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
        },
        setQrs: (qrcodes)=>{
            dispatch({
                type: "SET_QRS",
                qrcodes
            });
        },
        setBaseUrl: (baseUrl)=>{
            dispatch({
                type: "SET_BASEURL",
                baseUrl
            });
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);