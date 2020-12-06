import React, {Component} from "react";
import {connect} from 'react-redux';
import E404 from "./404";
import "./styles/Edit.css";
import MiniLoader from './MiniLoader';

class Edit extends Component{
    state = {
        url: "",
        active: false,
        initialSet: false,
        updating: false
    }
    static getDerivedStateFromProps(props, state){
        if(!state.initialSet && props.qrcode._id)
            return {...state, url: props.qrcode.url, active: props.qrcode.active, initialSet: true};
        return state;
    }
    updateQr = async ()=>{
        this.setState({updating: true});
        let response = await fetch('/api/updateqr',
        {
            method: "post",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({id: this.props.qrcode._id ,active: this.state.active, url: this.state.url})
        });
        let data = await response.json();
        if(data.status){
            this.props.updateQr(this.props.qrcode._id, this.state);
            this.props.setNotification({
                msg: "qr-code updated successfully!",
                type: true
            });
            this.setState({updating: false});
        } else {
            this.props.setNotification({
                msg: "sorry, try again!",
                type: false
            });
            this.setState({updating: false});
        }
    }
    deleteQr = async ()=>{
        let option = window.confirm(`Delete "${this.props.qrcode.custom}" qr-code?`);
        if(!option) return;
        this.props.startLoader();
        let response = await fetch('/api/deleteqr',
        {
            method: "post",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({id: this.props.qrcode._id})
        });
        let data = await response.json();
        if(data.status){
            this.props.deleteQr(this.props.qrcode._id);
            this.props.setNotification({
                msg: "qr-code deleted successfully!",
                type: true
            });
            this.props.stopLoader();
            this.props.history.goBack();
        } else {
            this.props.setNotification({
                msg: "sorry, try again!",
                type: false
            });
            this.props.stopLoader();
        }
    }
    render(){
        return (
            <div>
            {this.state.initialSet?

                <div className="edit">
                    <div className="top">
                        <div className="image">
                            <img src={this.props.qrcode.imgSrc} alt="qr-code"/>
                        </div>
                        <div className="details">
                            {this.state.updating? <MiniLoader/> : null}
                            <div className="name">{this.props.qrcode.custom}</div>
                            <div className="clicks">clicks: {this.props.qrcode.clicks}</div>
                            <div className="inputs">
                                <div className="url">
                                    <input type="text" name="url" defaultValue={this.state.url}
                                    onChange={(e)=>this.setState({url: e.target.value.trim()})}/>
                                </div>
                                <div className="active">
                                    <span>
                                        status: <span className={this.state.active? "green": "red"}>
                                            {this.state.active? "active" : "inactive"}
                                        </span>
                                    </span>
                                    <button onClick={()=>this.setState({active: !this.state.active})}>
                                        {this.state.active? "Deactivate" : "Activate"}
                                    </button>
                                </div>
                                {(this.state.active !== this.props.qrcode.active) || (this.state.url !== this.props.qrcode.url)?
                                    <button className="update" onClick={this.updateQr}>Update</button>
                                    : <button className="update disabled">Update</button>
                                }
                                <button className="delete" onClick={this.deleteQr}>Delete</button>
                            </div>
                        </div>
                    </div>
                    <button className="back" onClick={()=>this.props.history.goBack()}>back</button>
                </div>
                :
                <E404/>
            }
            </div>
        )
    }
}

function mapStateToProps(state, ownProps){
    let qrcode = state.qrcodes.find(qr=> qr._id === ownProps.match.params.id);
    return {
        qrcode: {...qrcode}
    }
}

function mapDispatchToProps(dispatch){
    return {
        updateQr: (id, {active, url})=>{
            dispatch({
                type: "UPDATE_QR",
                id, active, url
            });
        },
        deleteQr: (id)=>{
            dispatch({
                type: "DELETE_QR",
                id
            })
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
        },
        setNotification: (notification)=>{
            dispatch({
                type: "NOTIFICATION",
                notification
            });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);