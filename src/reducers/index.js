import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import taxReducer from './taxReducer';

export default combineReducers ({
    routing: routerReducer,
    tax: taxReducer
})