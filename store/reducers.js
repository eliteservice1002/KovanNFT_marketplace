export const walletReducer = (state = null, action) => {
    switch(action.type){
        case "setWalletAddress":
            return action.payload.walletAddress
        default:
            return state;
    }
}

export const adminReducer = (state = null, action) => {
    switch(action.type){
        case "setAdmins":
            let _state = state.slice(0);
            _state[action.payload.ind] = action.payload.admin;
            return _state;
        case "readAdmins":
            return action.payload;
        default:
            return state;
    }
}