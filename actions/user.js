import { db } from '../processes/db';

export const USER_PROFILE = 'USER_PROFILE';
export const UPDATE_USER = 'UPDATE_USER';

export const userProfile = (payload) => {
  return {
    type: USER_PROFILE,
    payload,
  };
};

export const updateUser = (payload) => {
  return {
    type: UPDATE_USER,
    payload,
  };
};

export const updateUserinfo = (payload) => {
  return function (dispatch, getState) {
    (async () => {
      const { name, value } = payload;
      let newValue;
      if (name === 'points') {
        let currentValue = getState().user.user.points 
        if (value !== null || value !== undefined) {
          newValue = +currentValue + +value;
          newValue.toString();
        } else {
          newValue = currentValue;
        }
      } else {
        newValue = value;
      }
      const sql = `UPDATE user SET ${name} = ? `;
      db.transaction(
        (tx) => {
          tx.executeSql(
            sql,
            [newValue],
            (txObj, { rowsAffected }) => {
              null
              dispatch(updateUser({ name, value: newValue }));
            },
            (err) => null
          );
        },
        (err) => null
      );
    })();
  };
};

export const deleteUser = (payload) => {};
