import React, {Component} from 'react';
import {connect} from 'react-redux';
import "./styles/Notify.css";

class Notify extends Component{
    state = {
        notification: {
            msg: '',
            type: true
        },
        show: false
    }
    static getDerivedStateFromProps(props, state){
        let newState = {...state};
        newState.notification = props.notification;
        if(props.notification){
            if(state.show) return newState;
            newState.show = true;
            setTimeout(()=>{
                props.setNotification(null);
            }, 3000);
        } else {
            newState.show = false;
        }
        return newState;
    }

    render(){
        return(
            <div>
                {
                    this.state.show?
                    <div className={`notification ${this.state.notification.type?"success":"error"}`}>
                        {this.state.notification.msg}
                    </div>
                    :
                    null
                }
            </div>
        )
    }
}

function mapStateToProps(state, ownProps){
    return {
        notification: state.notification
    }
}

function mapDispatchToProps(dispatch){
    return {
        setNotification: (notification)=>{
            dispatch({
                type: "NOTIFICATION",
                notification
            });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notify);