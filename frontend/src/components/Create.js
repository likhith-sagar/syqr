import React, {Component} from 'react';
import "./styles/Create.css";
import qrcode from 'qrcode-generator';
import MiniLoader from './MiniLoader';
import {connect} from 'react-redux';

class Create extends Component {
    state = {
        errors: {
            custom: "",
            url: ""
        },
        qrcode: "#",
        creating: false,
        created: false,
        customLink: ''
    }
    typeNumber = 2;
    abortController = new AbortController();
    aborted = false;

    componentDidMount = ()=>{
        this.fillqrcode(this.baseurl);
    }
    fillqrcode = (url)=>{
        try{
            var typeNumber = this.typeNumber;
            var errorCorrectionLevel = 'M';
            var qr = qrcode(typeNumber, errorCorrectionLevel);
            qr.addData("http://"+url);
            qr.make();
            // console.log(qr.createDataURL());
            this.setState({qrcode: qr.createDataURL(10,5)});
        } catch(e){
            this.typeNumber++;
            this.fillqrcode(url);
        }
    }
    handleOnChnage = (e)=>{
        let custom = e.target.value.trim();
        if(!custom.match(/^[a-zA-Z0-9_]*$/)){
            this.setState({errors: {...this.state.errors, custom: "Invalid shork-link"}});
        } else {
            this.setState({errors: {...this.state.errors, custom: ""}});
            this.fillqrcode(this.props.baseUrl + custom);
        }
    }
    handleSubmit = async (e)=>{
        e.preventDefault();
        e.persist();
        let custom = e.target.custom.value.trim();
        let url = e.target.url.value.trim();
        if(!custom.match(/^[a-zA-Z0-9_]*$/)){
            this.setState({errors: {...this.state.errors, custom: "Invalid shork-link"}});
            return;
        }
        this.setState({creating: true});
        try{
            this.setState({
                errors: {
                    custom: '',
                    url: ''
                }
            });
            let response = await fetch('/api/createqr',
            {   
                signal: this.abortController.signal,
                method: "post",
                headers: {'Content-Type': "application/json"},
                body: JSON.stringify({custom, url, typeNumber: this.typeNumber})
            });
            let data = await response.json();
            // console.log(data);
            if(data.errors){
                this.setState({
                    errors: {
                        custom: data.errors.custom,
                        url: data.errors.url
                    }
                });
            } else {
                this.props.setNotification({
                    msg: "QR-code created successfully!",
                    type: true
                });
                data.data.imgSrc = this.state.qrcode; //setting image url to received qr code data
                this.props.addQr(data.data);
                this.setState({created: true, customLink: "http://"+this.props.baseUrl+data.data.custom});
                e.target.reset();
            }
            this.setState({creating: false});
        } catch(err){
            if(this.aborted) return;
            //unexpected errors
            this.setState({
                creating: false,
                errors: {
                    custom: 'try again',
                    url: 'try again'
                }
            });
            this.props.setNotification({
                msg: "Unexpected error! try again",
                type: false
            });
        }
    }
    copy = (e)=>{
        let textEle = e.target.previousElementSibling;
        textEle.select();
        document.execCommand("copy");
        this.props.setNotification({
            msg: "link copied successfully!",
            type: true
        });
        textEle.value += " ";
    }
    ok = (e)=>{
        this.setState({created: false, customLink: ''});
        this.fillqrcode(this.props.baseUrl);
    }
    componentWillUnmount(){
        this.aborted = true;
        this.abortController.abort();
    }

    render(){
        return(
            <div className="create">
                {this.state.creating?<MiniLoader/>:null}
                <img src={this.state.qrcode} alt="qr code"/>
                {this.state.created?
                <div className="created">
                    <div className="input-series">
                        <input type="text" name="custom" readOnly value={this.state.customLink}/>
                        <button className="copy" onClick={this.copy}>copy</button>
                    </div>
                    <button className="ok" onClick={this.ok}>ok</button>
                </div>
                :
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="custom">Custom:</label>
                    <div className="input-series">
                        <div className="baseurl">{this.props.baseUrl}</div>
                        <input type="text" name="custom" id="custom" required autoComplete="off" onChange={this.handleOnChnage}/>
                    </div>
                    <div className="error">{this.state.errors.custom}</div>
                    <label htmlFor="url">Url:</label>
                    <div className="input-series">
                        <input type="text" name="url" id="url" required autoComplete="off" placeholder="http/https"/>
                    </div>
                    <div className="error">{this.state.errors.url}</div>
                    <button type="submit">Add</button>
                </form>
                }
            </div>
        )
    }
}
function mapStateToProps(state, ownProps){
    return {
        baseUrl: state.baseUrl
    }
}
function mapDispatchToProps(dispatch){
    return{
        setNotification: (notification)=>{
            dispatch({
                type: "NOTIFICATION",
                notification
            });
        },
        addQr: (qrcode)=>{
            dispatch({
                type: "ADD_QR",
                qrcode
            });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Create);