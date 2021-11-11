import producer, { produce } from 'immer'
import {AWAITING_REQUEST, SUCCESSFUL_REQUEST, FAILED_REQUEST} 
from '../actions/request'

const initialState = {
    status: 'awaiting',
    err: ''
}

export default function (state = initialState, action) {
    switch (action.type) {
        case AWAITING_REQUEST:{
            return produce(state, draft => {
                draft.status = 'awaiting',
                draft.err = ''
            })
        }
            
        case SUCCESSFUL_REQUEST:{
            return produce(state, draft => {
                draft.status = 'success'
            })
        } 
        
        case FAILED_REQUEST:{
            return produce(state, draft => {
                draft.status = 'failed',
                draft.err = action.payload
            })
        }
    
        default:
            return state
    }
}