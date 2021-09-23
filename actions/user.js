import {db} from '../processes/db'

export const USER_PROFILE = 'USER_PROFILE';
export const UPDATE_USER = 'UPDATE_USER';
export const DELETE_ACCOUNT = 'DELETE_ACCOUNT';

export const userProfile = payload => {
    return {
        type: USER_PROFILE,
        payload
    }
}

export const updateUser= payload => {
    return {
        type: UPDATE_USER,
        payload
    }
}

export const deleteAccountWarning = payload => {
    return {
        type: DELETE_ACCOUNT,
        payload
    }
}

export const updateUserinfo = payload => {
    return dispatch => {
        (async () => {
            const {name, value} = payload
            const sql = `UPDATE user SET ${name} = ? `
            db.transaction(tx => {
                tx.executeSql(sql, [value], 
                    (txObj, {rowsAffected}) => {
                        console.log(rowsAffected, 'row affected')
                        dispatch(updateUser({name, value}))
                    },
                    err => console.log(err, 'err in updating')
                )
            }, 
            err => console.log(err, 'err in transaction'),
            () => console.log('transaction successful'))
        })()
    }
}