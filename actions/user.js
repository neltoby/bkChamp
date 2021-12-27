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
              console.log(rowsAffected, 'row affected');
              dispatch(updateUser({ name, value: newValue }));
            },
            (err) => console.log(err, 'err in updating')
          );
        },
        (err) => console.log(err, 'err in transaction'),
        () => console.log('transaction successful')
      );
    })();
  };
};

export const deleteUser = (payload) => {};
