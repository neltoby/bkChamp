import produce from 'immer'
import {category} from '../processes/category'
import { ARCHIVE , 
    UNARCHIVE, 
    SEARCH_ARCHIVE, 
    PREV_SEARCH, 
    LOAD_ARCHIVE,
    ERR_ARCHIVE,
    LOADING_ARCHIVE,
    ARCHIVED_ARTICLE,
    UNARCHIVED_ARTICLE
    } from '../actions/learn'
import isJson from '../processes/isJson'

const initialState = {
    archive : [], 
    archivedArticle: [],
    category: isJson(category),
    searchRes: [],
    searchText: [],
    searchTextDisplay: [],
    loading: false,
    error: null
}

export default function archiveReducer (state=initialState, action) {
    switch(action.type) {
        case ARCHIVE: {
            return produce(state, draft => {
                let val = false
                state.archive.forEach(element => {
                    if(element.category === action.payload.item.category.toLowerCase()){
                        val = true
                    }
                });
                if(!val){
                    let newObj = {}
                    newObj['category'] = action.payload.item.category.toLowerCase()
                    newObj['value'] = [action.payload.item.id]
                    draft.archive.push(newObj)
                }else{
                    draft.archive = state.archive.map((item, i) => {
                        if(item.category === action.payload.item.category.toLowerCase()){
                            item.value = [action.payload.item.id, ...item.value]
                            return item
                        }else{
                            return item
                        }
                    })
                }
            })
        }
        case UNARCHIVE: {
            return produce(state, draft => {
                draft.archive = isJson(state.archive.slice()).map((item, i) => {
                    let index = item.value.indexOf(action.payload.item.id)
                    if(index !== -1){
                        item.value.splice(index, 1)
                        return item
                    }else{
                        return item
                    }
                })
            })
        }
        case UNARCHIVED_ARTICLE: {
            return produce( state, draft => {
                draft.archivedArticle = isJson(state.archivedArticle).filter(item => item.id !== action.payload.id)
            })
        }
        case SEARCH_ARCHIVE: {
            return produce(state, draft => {
                let textArr = action.payload.trim().split(' ')
                let newArchive = state.archive.filter((element, i) => {
                    element = isJson(element)
                    // console.log(element, 'line 45 archive reducer')
                    if (textArr.some(arr => element.item.text.includes(arr))) return element
                })
                draft.searchRes = newArchive
                if(!state.searchText.includes(action.payload.trim())){
                    draft.searchText.push(action.payload.trim())
                }
            })
        }
        case PREV_SEARCH: {
            return produce(state, draft => {
                let textArr = action.payload.trim().split(' ')
                let newSearchText = state.searchText.filter((element, i) => {
                    if (textArr.some(arr => element.includes(arr))) return element
                })
                draft.searchTextDisplay = newSearchText
            })
        }
        case LOAD_ARCHIVE: {
            return produce( state, draft => {
                draft.archive = action.payload
            })
        }
        case LOADING_ARCHIVE: {
            return produce( state, draft => {
                draft.loading = action.payload
            })
        }
        case ARCHIVED_ARTICLE: {
            return produce( state, draft => {
                draft.archivedArticle = action.payload
            })
        }
        case ERR_ARCHIVE: {
            return produce( state, draft => {
                draft.error = action.payload
            })
        }
        default: {
            return state
        }
    }
}