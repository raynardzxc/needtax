import {
    NEW_TAX_INFO,
    CLEAN_TAX_OBJ,
    CLEAN_OP_OBJ,
    SUBMIT_OP_OBJ
} from './types';

import history from '../History';

export const newTaxInfo = (data) => {
    return { type: NEW_TAX_INFO, payload: { field: data.field, value: data.value } }
}

export const cleanTaxObj = () => {
    return (dispatch) => {
        dispatch({ type: CLEAN_TAX_OBJ });
    }
}

export const cleanOpObj = () => {
    return (dispatch) => {
        dispatch({ type: CLEAN_OP_OBJ });
        history.push('/');
    }
}

export const submitInfo = () => {
    return (dispatch) => {
        dispatch({ type: SUBMIT_OP_OBJ });
        history.push('/report');
    }
}