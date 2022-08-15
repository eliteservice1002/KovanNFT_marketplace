import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { walletReducer, adminReducer } from "./reducers";

const reducers = combineReducers({
    walletAddress: walletReducer,
    admins: adminReducer
});

export default createStore(
    (state, action) => reducers(state, action),
    {walletAddress: '', admins: ['0','0','0']},
    applyMiddleware(thunk)
)