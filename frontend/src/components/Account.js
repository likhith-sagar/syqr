import  React, {Component} from 'react';
import {connect} from 'react-redux';
import "./styles/Account.css";

class Account extends Component{
    deleteAccount = async ()=>{
        let option = window.confirm("This deletes everything related to your Account!");
        if(!option) return;
        this.props.startLoader();
        let res = await fetch("/api/deleteuser");
        let data = await res.json();
        if(data.status){
            this.props.setNotification({
                msg: "Account deleted Successfully!",
                type: true
            });
            this.props.stopLoader();
            this.props.logUserOut();
            this.props.history.replace("/login");
        } else {
            this.props.setNotification({
                msg: "sorry, try again!",
                type: false
            });
            this.props.stopLoader();
        }
    }
    render(){
        let totalClicks = 0;
        let totalLinks = 0;
        let qrListJsx = this.props.qrcodes.map(qrcode=>{
            totalLinks += 1;
            totalClicks += qrcode.clicks;
            return (
                <div className="item" key={qrcode._id}>
                    <div className="name">{qrcode.custom}</div>
                    <div className="clicks">clicks: {qrcode.clicks}</div>
                </div>
            )
        });
        return (
            <div className="account">
                <div className="name">{this.props.user.name}</div>
                <div className="email">{this.props.user.email}</div>
                <div className="list">
                    {qrListJsx}
                </div>
                <div className="info">total links: {totalLinks}</div>
                <div className="info">total Clicks: {totalClicks}</div>
                <button className="delete" onClick={this.deleteAccount}>Delete Account</button>
            </div>
        )
    }
}


function mapStateToProps(state){
    return {
        qrcodes: state.qrcodes,
        user: state.user
    }
}
function mapDispatchToProps(dispatch){
    return {
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);