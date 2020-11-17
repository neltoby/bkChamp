import {db} from '../processes/db'
import { userProfile } from './user'

export const CREATE_USER_LOADING = 'CREATE_USER_LOADING'
export const CREATE_USER_STOP = 'CREATE_USER_STOP'
export const V_NUMBER = 'V_NUMBER'
export const LOGGEDIN = 'LOGGEDIN'
export const NOTLOGGEDIN = 'NOTLOGGEDIN'
export const LOGIN_STATUS = 'LOGIN_STATUS'
export const VERIFICATION = 'VERIFICATION'
export const WELCOME = 'WELCOME'
export const EXIT_LOGIN = 'EXIT_LOGIN'
export const LOGOUT_WARNING = 'LOGOUT_WARNING'
export const SIGN_UP_ERR = 'SIGN_UP_ERR'

export const createUserLoading = () => ({type: CREATE_USER_LOADING})

export const createUserStop = () => ({type: CREATE_USER_STOP})

export const logoutWarning = payload => ({type: LOGOUT_WARNING, payload})

export const login = () => {
    return {
        type: LOGGEDIN,
        payload: LOGGEDIN
    }
}

export const exitLogin = payload => ({type: EXIT_LOGIN, payload})

export const welcome = payload => ({type: WELCOME, payload})

export const notLogin = () => {
    return {
        type: NOTLOGGEDIN,
        payload: NOTLOGGEDIN
    }
}
export const loginStatus = payload => {
    return {
        type: LOGIN_STATUS,
        payload: payload
    }
}
export const vNumber = payload => {
    return {
        type: V_NUMBER,
        payload
    }
}
export const verification = payload => {
    return {
        type: VERIFICATION,
        payload
    }
}
export const signUpErr = payload => ({type: SIGN_UP_ERR, payload})

export const loginDetails = payload => {
    return (dispatch, getState) => {
        (async () => {
            const sql = 'DROP TABLE IF EXISTS user'
            const sqli = 'CREATE TABLE IF NOT EXISTS user(id INT PRIMARY KEY, username TEXT, email TEXT, phone_number INT, fullname TEXT, institution TEXT, date_of_birth TEXT, gender TEXT, image TEXT, points INT)'
            const sqlii = 'INSERT INTO user(username, fullname, phone_number, gender, email, points, date_of_birth, institution, image) VALUES(?,?,?,?,?,?,?,?,?)'
            delete payload.token
            await db.transaction(tx => {
                tx.executeSql(sql, null, (txObj, {rowsAffected}) => {
                    txObj.executeSql(sqli, null, (txO, {rowsAffected}) => {
                        txO.executeSql(sqlii, Object.values(payload), (txOI, {rowsAffected}) => {
                            dispatch(userProfile(payload))
                        }, err => console.log(err, 'sqlii query failed loginDetails'))
                    }, err => console.log(err, 'sqli query failed loginDetails'))
                }, err => console.log(err, 'sql query failed loginDetails'))
            }, err => console.log(err, 'form transacto'),
            () => console.log('user trnsaction success loginDetails'))
        })()
    }
}
export const verificationPoint = payload => {
    return (dispatch, getState) => {
        (async () => {
            const sql = 'DROP TABLE IF EXISTS user'   
            const sqli = 'CREATE TABLE IF NOT EXISTS user(id INT PRIMARY KEY, username TEXT, email TEXT, phone_number INT, fullname TEXT, institution TEXT, date_of_birth TEXT, gender TEXT, image TEXT, points INT)'
            const sqlii = 'INSERT INTO user(id, username, email, phone_number, fullname, institution, date_of_birth, gender, points, image) VALUES(?,?,?,?,?,?,?,?,?,?)'
            delete payload.token
            db.transaction(tx => {
                tx.executeSql(sql, null, (txObj, {rowsAffected}) => {
                    txObj.executeSql(sqli, null, (txO, {rowsAffected}) => {
                        txO.executeSql(sqlii, Object.values(payload), (txOI, {rowsAffected}) => {
                            dispatch(userProfile(payload))
                        }, err => console.log(err, 'sqlii query failed'))
                    }, err => console.log(err, 'sqli query failed'))
                }, err => console.log(err, 'sql query failed'))
            }, err => console.log(err),
            () => console.log('user trnsaction success'))
        })()
    }
} 

export const loginWithUser = (payload) => {
    return dispatch => {
        (async() => {
            const sql = 'SELECT * FROM user'
            db.transaction(tx => {
                tx.executeSql(sql, null, (txObj, {rows}) => {
                    const {_array} = rows
                    console.log(_array[0])
                    dispatch(userProfile(_array[0]))
                    if(payload === true){
                        dispatch(login())
                    }else{
                        dispatch(verification())
                    }                    
                }, err => console.log(err, 'failed getting details'))
            }, 
            err => console.log(err, 'err from login transaction'),
            () => console.log('login transaction successful')
            )
        })()
    }
}