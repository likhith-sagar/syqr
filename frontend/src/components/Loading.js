import React, {Component} from 'react';
import './styles/Loading.css';
import {connect} from 'react-redux';
import mySvg from '../extras/Vanilla2-0.svg';

class Loading extends Component{
    state = {
        class: 'hide'
    }
    static getDerivedStateFromProps(props, state){
        let isLoading = props.loading; //get from redux as props
        if(isLoading){
            return {...state, class: 'show'};
        }
        return {...state, class: 'hide'};
    }
    render(){
        return(
        <div className={`loading ${this.state.class}`}>
            <div className="loader">
                <img src={mySvg} alt="Loading.." className={this.state.class}/>
            </div>
        </div>
        )
    }
}

function mapStateToProps(state, ownProps){
    return {
        loading: state.loading
    }
}

export default connect(mapStateToProps)(Loading);