import { db } from '../processes/db';
import { userProfile } from './user';
import { deleteKey } from '../processes/keyStore';
import { loginValue } from '../processes/lock';

export const CREATE_USER_LOADING = 'CREATE_USER_LOADING';
export const CREATE_USER_STOP = 'CREATE_USER_STOP';
export const V_NUMBER = 'V_NUMBER';
export const LOGGEDIN = 'LOGGEDIN';
export const NOTLOGGEDIN = 'NOTLOGGEDIN';
export const LOGIN_STATUS = 'LOGIN_STATUS';
export const VERIFICATION = 'VERIFICATION';
export const WELCOME = 'WELCOME';
export const EXIT_LOGIN = 'EXIT_LOGIN';
export const LOGOUT_WARNING = 'LOGOUT_WARNING';
export const SIGN_UP_ERR = 'SIGN_UP_ERR';

export const createUserLoading = () => ({ type: CREATE_USER_LOADING });

export const createUserStop = () => ({ type: CREATE_USER_STOP });

export const logoutWarning = (payload) => ({ type: LOGOUT_WARNING, payload });

export const login = () => {
  return {
    type: LOGGEDIN,
    payload: LOGGEDIN,
  };
};

export const exitLogin = (payload) => ({ type: EXIT_LOGIN, payload });

export const welcome = (payload) => ({ type: WELCOME, payload });

export const notLogin = () => {
  return {
    type: NOTLOGGEDIN,
    payload: NOTLOGGEDIN,
  };
};
export const loginStatus = (payload) => {
  return {
    type: LOGIN_STATUS,
    payload: payload,
  };
};
export const vNumber = (payload) => {
  return {
    type: V_NUMBER,
    payload,
  };
};
export const verification = () => {
  return {
    type: VERIFICATION,
    payload: true,
  };
};
export const signUpErr = (payload) => ({ type: SIGN_UP_ERR, payload });
export const logOutUser = (payload) => {
  return (dispatch) => {
    const sql = 'DROP TABLE IF EXISTS articles';
    const sqli = 'DROP TABLE IF EXISTS archive';
    const sqlii = 'DROP TABLE IF EXISTS user';
    const sqlx = 'DROP TABLE IF EXISTS archiveunsent';
    const sqlix = 'DROP TABLE IF EXISTS unsent';
    const sqlxi = 'DROP TABLE IF EXISTS search';
    const sqlxii = 'DROP TABLE IF EXISTS endquestions';

    deleteKey(loginValue);
    db.transaction(
      (tx) => {
        tx.executeSql(
          sql,
          null,
          (txO, { rows }) => {
            txO.executeSql(
              sqli,
              null,
              (txOb, { rows }) => {
                txOb.executeSql(
                  sqlii,
                  null,
                  (txObx, { rows }) => {
                    txObx.executeSql(
                      sqlx,
                      null,
                      (tx, { rows }) => {
                        tx.executeSql(
                          sqlix,
                          null,
                          (txO, { rows }) => {
                            txO.executeSql(
                              sqlxi,
                              null,
                              (txO, { rows }) => {
                                txO.executeSql(
                                  sqlxii,
                                  null,
                                  (txOb, { rows }) => {
                                    null
                                    dispatch(notLogin());
                                  },
                                  (err) =>
                                    null
                                );
                              },
                              (err) => null
                            );
                          },
                          (err) => null
                        );
                      },
                      (err) => null
                    );
                  },
                  (err) => null
                );
              },
              (err) => null
            );
          },
          (err) => null
        );
      },
      (err) => null
    );
  };
};

export const loginDetails = (payload) => {
  return (dispatch, getState) => {
    (async () => {
      const sql = 'DROP TABLE IF EXISTS user';
      const sqli =
        'CREATE TABLE IF NOT EXISTS user(id INT PRIMARY KEY, user_pk INT, username TEXT, email TEXT, phone_number INT, fullname TEXT, institution TEXT, date_of_birth TEXT, gender TEXT, image TEXT, points INT)';
      const sqlii =
        'INSERT INTO user(user_pk, username, fullname, phone_number, gender, email, points, date_of_birth, institution, image) VALUES(?,?,?,?,?,?,?,?,?,?)';
      delete payload.token;
      await db.transaction(
        (tx) => {
          tx.executeSql(
            sql,
            null,
            (txObj, { rowsAffected }) => {
              txObj.executeSql(
                sqli,
                null,
                (txO, { rowsAffected }) => {
                  txO.executeSql(
                    sqlii,
                    Object.values(payload),
                    (txOI, { rowsAffected }) => { dispatch(userProfile({user_pk: payload.id, ...payload}));},
                    (err) => null
                  );
                },
                (err) => null
              );
            },
            (err) => null
          );
        },
        (err) => null
      );
    })();
  };
};
export const verificationPoint = (payload) => {
  return (dispatch, getState) => {
    (async () => {
        null
      dispatch(userProfile({user_pk: payload.id, ...payload}));
      dispatch(vNumber(payload.email_token))
       const sql = 'DROP TABLE IF EXISTS user';
      const sqli =
        'CREATE TABLE IF NOT EXISTS user(id INT PRIMARY KEY, user_pk INT, username TEXT, email TEXT, phone_number INT, fullname TEXT, institution TEXT, date_of_birth TEXT, gender TEXT, image TEXT, points INT)';
      const sqlii =
        'INSERT INTO user(username, email, phone_number, fullname, institution, date_of_birth, gender, points, image) VALUES(?,?,?,?,?,?,?,?,?,?)';
      delete payload.token;
      delete payload.email_token;
      delete payload.id
      delete payload.referee
      delete payload.referral_code
      null
      db.transaction(
        (tx) => {
          tx.executeSql(
            sql,
            null,
            (txObj, { rowsAffected }) => {
              txObj.executeSql(
                sqli,
                null,
                (txO, { rowsAffected }) => {
                  txO.executeSql(
                    sqlii,
                    Object.values(payload),
                    (txOI, { rowsAffected }) => {
                      null
                      dispatch(userProfile(payload));
                    },
                    (err) => null
                  );
                },
                (err) => null
              );
            },
            (err) => null
          );
        },
        (err) => null
      );
    })();
  };
};

export const loginWithUser = (payload) => {
  return (dispatch) => {
    (async () => {
      const sql = 'SELECT * FROM user';
      db.transaction(
        (tx) => {
          tx.executeSql(
            sql,
            null,
            (txObj, { rows }) => {
              const { _array } = rows;
              null
              if (payload === true && _array[0]) {
                dispatch(userProfile(_array[0]));
                dispatch(login());
              } else {
                dispatch(verification());
              }
            },
            (err) => null
          );
        },
        (err) => null
        // () => null
      );
    })();
  };
};
