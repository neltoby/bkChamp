import produce from 'immer'
import { SEARCH_ARRAY, 
    SEARCH_ITEM_ARRAY, 
    ADD_SEARCH_ITEM, 
    LOAD_SEARCH, 
    SEARCH_ERR,
    SEARCH_TEXT,
    SORT_SEARCH } from '../actions/search'

const initialState = {
    searchItemArray: [],
    searchArray: [],
    loading: false,
    err: null,
    search: '',
    sort_search: false
}

export default function searchReducer (state = initialState, action) {
    switch (action.type) {
        case SEARCH_ARRAY: {
            return produce( state, draft => {
                draft.searchArray = action.payload
            })
        }
        case SEARCH_ITEM_ARRAY: {
             return produce( state, draft => {
                 draft.searchItemArray = action.payload
             })
        }
        case ADD_SEARCH_ITEM: {
            return produce(state, draft => {
                draft.searchItemArray = [action.payload, ...state.searchItemArray]
            })
        }
        case LOAD_SEARCH: {
            return produce( state, draft => {
                draft.loading = action.payload
            })
        }
        case SEARCH_ERR: {
            return produce( state, draft => {
                draft.err = action.payload
            })
        }
        case SEARCH_TEXT: {
            return produce( state, draft => {
                draft.search = action.payload
            })
        } 
        case SORT_SEARCH: {
            return produce( state, draft => {
                draft.sort_search = action.payload
            })
        }
        default:
            return state
    }
}