import producer, { produce } from 'immer'
import {AWAITING_REQUEST, SUCCESSFUL_REQUEST, FAILED_REQUEST, IDLE_REQUEST} 
from '../actions/request'

const initialState = {
    status: 'idle',
    err: ''
}

export default function (state = initialState, action) {
    switch (action.type) {
        case IDLE_REQUEST:{
            return produce(state, draft => {
                draft.status = 'idle',
                draft.err = ''
            })
        }
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