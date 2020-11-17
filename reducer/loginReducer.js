import produce from 'immer'
import {LOGGEDIN, NOTLOGGEDIN, LOGIN_STATUS, CREATE_USER_STOP,LOGOUT_WARNING,
    VERIFICATION, V_NUMBER, CREATE_USER_LOADING, WELCOME, SIGN_UP_ERR, EXIT_LOGIN, exitLogin } from '../actions/login'

const initialState = {
    login: '',
    status: 'inactive',
    verification: false,
    v_number : null,
    createUser: false, 
    welcome: 'Home',
    signUpErr: null,
    logoutWarning: false,
    exitLogin: false
}

export default function loginReducer(state = initialState, action) {
    switch (action.type){
        case LOGGEDIN: {
            return produce(state, draft => {
			    draft.login = action.payload ;			    
			})
        }
        case NOTLOGGEDIN: {
            return produce(state, draft => {
			    draft.login = action.payload ;			    
			})
        }
        case LOGIN_STATUS: {
            return produce(state, draft => {
			    draft.status =  action.payload  		    
			})
        }
        case VERIFICATION: {
            return produce(state, draft => {
			    draft.verification =  action.payload  		    
			})
        }
        case EXIT_LOGIN: {
            return produce( state, draft => {
                draft.exitLogin = action.payload
            })
        }
        case V_NUMBER: {
            return produce(state, draft => {
                draft.v_number = action.payload
            })
        }
        case WELCOME: {
            return produce(state, draft => {
                draft.welcome = action.payload
            })
        }
        case CREATE_USER_LOADING: {
            return produce(state, draft => {
                draft.createUser = true
            })
        }
        case CREATE_USER_STOP: {
            return produce (state, draft => {
                draft.createUser = false
            })
        }
        case SIGN_UP_ERR: {
            return produce(state, draft => {
                draft.signUpErr = action.payload
            })
        }
        case LOGOUT_WARNING: {
            return produce( state, draft => {
                draft.logoutWarning = action.payload
            })
        }
        default:{
            return state;
        }
    }
}