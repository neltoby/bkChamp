import {db} from '../processes/db'
// import { getKey } from '../processes/keyStore'
// import { loginValue } from '../processes/lock'

export const SEARCH_ARRAY = 'SEARCH_ARRAY'
export const SEARCH_ITEM_ARRAY = 'SEARCH_ITEM_ARRAY' 
export const ADD_SEARCH_ITEM = 'ADD_SEARCH_ITEM'
export const LOAD_SEARCH = 'LOAD_SEARCH' 
export const SEARCH_ERR = 'SEARCH_ERR'
export const SEARCH_TEXT = 'SEARCH_TEXT'
export const SORT_SEARCH = 'SORT_SEARCH'

export const actionCreator = (action, payload = null) => {
    if (payload === null){
        return {type: action}
    }else{
        return {type: action, payload}
    }
}

export const addSearchToDb = payload => {
    return dispatch => {
        (
            async () => {
                const sql = 'INSERT INTO search(searched) VALUES(?)'
                db.transaction(tx => {
                    tx.executeSql(sql, [payload], (txO, {rowsAffected}) => {
                        if(rowsAffected > 0) {
                            dispatch(actionCreator(ADD_SEARCH_ITEM, payload))
                            console.log('inserted successful')
                        }                      
                    }, err => console.log('failed insert'))
                }, 
                err => console.log(err), 
                () => console.log('successful transxtion'))
            }
        )()
    }
}

export const getSearchItem = () => {
    return dispatch => {
        (async () => {
            const sql = 'SELECT searched from search'
            db.transaction(tx => {
                tx.executeSql(sql, null, (txs, {rows})  => {
                    const {_array} = rows
                    console.log(_array, 'from getSearchItem')
                    dispatch(actionCreator(SEARCH_ITEM_ARRAY, _array))
                }, err => console.log('failed searched'))
            }, err => console.log(err, 'nothing'),
            () => console.log('successful transaction'))
        })()
    }
}