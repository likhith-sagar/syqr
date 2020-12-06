import React, {Component} from 'react';
import {connect} from 'react-redux';
import "./styles/QrList.css";
import QrItem from "./QrItem";

class QrList extends Component {
    state = {
        query: ''
    }
    onChangeHandler = (e)=>{
        let query = e.target.value.trim();
        this.setState({query});
    }
    render(){
        let qrcodesJsx = this.props.qrcodes.reverse().map(qrcode=>{ //reverse because for recent to appear first
            if(qrcode.custom.includes(this.state.query))
                return(
                    <QrItem {...qrcode} key={qrcode._id} baseUrl={this.props.baseUrl}/>
                );
            return null;
        });
        return(
            <div className="qrlist">
                <div className="topbar">
                    <input type="search" name="search" id="search" onChange={this.onChangeHandler} autoComplete="off" placeholder="search"/>
                </div>
                <div className="list">
                    {qrcodesJsx.length? qrcodesJsx : "no qr-codes currently!"}
                </div>
            </div>
        )
    }
}
function mapStateToProps(state){
    return {
        qrcodes: state.qrcodes,
        baseUrl: state.baseUrl
    }
}
export default connect(mapStateToProps)(QrList);