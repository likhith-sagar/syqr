import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

class QrItem extends Component{

    copy = (text)=>{
        let textEle = document.createElement("input");
        textEle.value = text;
        document.body.appendChild(textEle);
        textEle.select();
        document.execCommand("copy");
        textEle.remove();
        this.props.setNotification({
            msg: "link copied successfully!",
            type: true
        });
    }
    
    download = (url, name)=>{
        let a = document.createElement("a");
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        this.props.setNotification({
            msg: name+" is downloaded successfully!",
            type: true
        });
    }
    navigate = (id) =>{
        this.props.history.push("/dashboard/edit/"+id);
    }
    render(){
        return(
            <div className="qr-item">
                <div className="top">
                    <img src={this.props.imgSrc} alt="qr code"/>
                    <div className="buttons">
                        <button id="download" onClick={()=>this.download(this.props.imgSrc, this.props.custom + ".jpg")}>download</button>
                        <button id="copy" onClick={()=>this.copy("http://"+this.props.baseUrl + this.props.custom)}>copy</button>
                    </div>
                </div>
                <div className="down" onClick={()=>this.navigate(this.props._id)}>
                    <div className="name">{this.props.custom.substr(0,15)}{this.props.custom.length>15?'...':''}</div>
                    <span className="clicks">{this.props.clicks} clicks</span>
                    <div className="url">{this.props.url.substr(0,35)}{this.props.url.length>35?'...':''}</div>
                </div>
            </div>
        );
    }
    
}



function mapDispatchToProps(dispatch){
    return{
        setNotification: (notification)=>{
            dispatch({
                type: "NOTIFICATION",
                notification
            });
        }
    }
}

export default connect(null, mapDispatchToProps)(withRouter(QrItem));