
let initState = {
    firstTime: true,
    loggedIn: false,
    loading: false,
    user: null,
    qrcodes: [],
    notification: null,
    baseUrl: ''
}

function myReducer(state = initState, action){
    if(action.type === 'LOADER'){
        return {...state, loading: action.status};
    }
    if(action.type === 'FIRST_TIME_OFF'){
        return {...state, firstTime: false}
    }
    if(action.type === 'LOG_IN'){
        return {...state, loggedIn: true, firstTime: false, user: action.user}
    }
    if(action.type === 'LOG_OUT'){
        return {...state, loggedIn: false}
    }
    if(action.type === 'NOTIFICATION'){
        return {...state, notification: action.notification}
    }
    if(action.type === "ADD_QR"){
        let qrcodes = [...state.qrcodes, action.qrcode];
        return {...state, qrcodes};
    }
    if(action.type === "SET_QRS"){
        return {...state, qrcodes: action.qrcodes};
    }
    if(action.type === "SET_BASEURL"){
        return {...state, baseUrl: action.baseUrl};
    }
    if(action.type === "UPDATE_QR"){
        let qr = state.qrcodes.find(qr => qr._id === action.id);
        if(action.url) qr.url = action.url;
        if(action.active != null) qr.active = action.active;
        return state;
    }
    if(action.type === "DELETE_QR"){
        let newQrList = state.qrcodes.filter(qr => qr._id !== action.id);
        return {...state, qrcodes: newQrList};
    }
    return state;
}

export default myReducer;

