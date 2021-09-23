import producer, { produce } from 'immer'
import { USER_PROFILE, UPDATE_USER, DELETE_ACCOUNT } from '../actions/user'

const initialState = {
    user: {
        id: null,
        username: null,
        email: null,
        phone_number: null,
        fullname: null,
        institution: null,
        date_of_birth: null,
        gender: null,
        image: null,
        points: null
    },   
    deleteUserModal: false 
}

export default function(state = initialState, action){
    switch(action.type) {
        case USER_PROFILE: {
            return produce( state, draft => {
                draft.user = action.payload
            })
        }
        case UPDATE_USER: {
            return produce( state, draft => {
                draft['user'][action.payload.name] = action.payload.value
            }) 
        }
        case DELETE_ACCOUNT: {
            return produce( state, draft => {
                draft.deleteUserModal = action.payload
            })
        }
        default:
            return state
        
    }
}