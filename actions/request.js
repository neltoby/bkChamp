import { db } from '../processes/db';
import isJson from '../processes/isJson';
import { deleteKey, getKey, storeKey } from '../processes/keyStore';
import { confirm, loginValue } from '../processes/lock';
import { createUserLoading, createUserStop, login, loginDetails, loginStatus, logOutUser, signUpErr, verificationPoint, vNumber } from './login';
import {
  loadQuestion, loadQuiz, quizDispatcher, registerQuestion, removeQuestions, startGameErr
} from './quiz';
import {
  actionCreator,
  addSearchToDb,
  ADD_SEARCH_ITEM, LOAD_SEARCH, SEARCH_ITEM_ARRAY, SORT_SEARCH
} from './search';
import { updateUserinfo } from './user';
import {
  onDailyWinnersSuccess, onWeeklyWinnersSuccess, winnersErrDis
} from './winners';
export const AWAITING_REQUEST = 'AWAITING_REQUEST';
export const SUCCESSFUL_REQUEST = 'SUCCESSFUL_REQUEST';
export const FAILED_REQUEST = 'FAILED_REQUEST';
export const IDLE_REQUEST = 'IDLE_REQUEST';

const domain = 'https://bookchamp.herokuapp.com/api/v1/';

export const idleRequest = () => {
  return {
    type: IDLE_REQUEST
  }
}
export const awaitingRequest = () => {
  return {
    type: AWAITING_REQUEST,
  };
};

export const successfulRequest = () => {
  return {
    type: SUCCESSFUL_REQUEST,
  };
};

export const failedRequest = (payload) => {
  return {
    type: FAILED_REQUEST,
    payload,
  };
};

const successLogin = (payload) => {
  return function (dispatch, getState) {
    storeKey(loginValue, payload.token);
    null
    const newObj = JSON.parse(JSON.stringify(payload));
    dispatch(loginDetails(newObj));
    dispatch(successfulRequest());
    setTimeout(() => {
      // update the login state to LOGGEDIN
      dispatch(login());

      // stop the login activity indicator
      dispatch(loginStatus('inactive'));

      // reset request to the default
      dispatch(awaitingRequest());
    }, 0);
  };
};
const failedLogin = (payload) => {
  return function (dispatch, getState) {
    // set request to failed
    dispatch(failedRequest(payload));
    setTimeout(() => {
      // reset request to the default
      dispatch(awaitingRequest());
      // stop the login activity indicator
      dispatch(loginStatus('inactive'));
    }, 500);
  };
};

export const request = (endpoint, param, callback, errCallback, dispatch) => {
  let fet = param
    ? fetch(`${domain}${endpoint}`, param)
    : fetch(`${domain}${endpoint}`);
  fet
    .then((res) => {
      // null
      if (res.status === 200) {
        return res.json();
      } else if (endpoint === 'login') {
        throw new Error('A user with this username and password was not found');
      } else {
        throw new Error('Failed request with code ' + res.status);
      }
    })
    .then((res) => {
      dispatch(callback(res));
    })
    .catch((error) => {
      // const err = error.message === 'A user with this username and password was not found' ?
      // 'A user with this username and password was not found' : 'Failed request' ;
      dispatch(errCallback(error.message));
    });
};
export const loginRequest = (body) => {
  return function (dispatch, getState) {
    // set the login activity Indicator rolling
    dispatch(loginStatus('loading'));
    // set the headers of the request
    const param = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    // onsuccess callback
    const callback = successLogin;
    // onfail callback
    const err = failedLogin;
    request('login', param, callback, err, dispatch);
  };
};

export const deleteUser = (payload) => {
  return function (dispatch, getState) {
    async () => {
      null
      // let pk = getState().user.user.id
      let pk = payload;
      null
      const val = getKey(loginValue);
      const param = {
        method: 'POST',
        headers: {
          Authorization: `Token ${val}`,
          'Content-Type': 'application/json',
        },
      };
      if (val !== undefined && val !== null) {
        await fetch(`${domain}/user/${pk}/delete`)
          .then((resp) => resp.json)
          .then((response) => null)
          .then(dispatch(logOutUser()))
          .catch((err) => null)
      }
    };
  };
};

export const fetchArchived = () => {
  return (dispatch) => {
    (async () => {
      // get token from securestore
      const val = await getKey(loginValue);
      // set headers and other params
      const param = {
        method: 'GET',
        headers: {
          Authorization: `Token ${val}`,
        },
      };
      if (val !== undefined && val !== null) {
        await fetch(`${domain}articles/archive`, param)
          .then((res) => res.json())
          .then((resp) => dispatch(resolveArchive(resp)))
          .catch((err) => null)
          .then((res) => {
            return setTimeout(() => {
              dispatch(getArchived());
            }, 1000);
          });
      }
    })();
  };
};

export const getArticles = (payload) => {
  return function (dispatch, getState) {
    (async () => {
      null
      // set article array to empty
      dispatch(setArticle([]));

      // set the selected subject
      // dispatch(setSubject(payload))

      // get token from securestore
      const val = await getKey(loginValue);
      // set headers and other params
      const param = {
        method: 'GET',
        headers: {
          Authorization: `Token ${val}`,
        },
      };
      // onsuccess callback
      const callback = newOnArticleSuccess;
      // onfail callback
      const err = articleErrDis;
      if (val !== undefined && val !== null) {
        request(`articles`, param, callback, err, dispatch);
      }
    })();
  };
};

export const getLiveRanks = () => {
  return function (dispatch, getState) {
    (async () => {
      null
      //get the auth token from the store
      const val = await getKey(loginValue);
      //set headers and pother params
      const param = {
        method: 'GET',
        headers: {
          Authorization: `Token ${val}`,
        },
      };
      // on success callback
      const callback = onDailyWinnersSuccess;
      //on fail callback
      const err = () => winnersErrDis('daily');
      if (val !== undefined && val !== null) {
        request(`daily_winners`, param, callback, err, dispatch);
      }
    })();
  };
};

export const getWeeklyWinners = () => {
  return function (dispatch, getState) {
    (async () => {
      null
      // dispatch(setDailyWinners([]));
      //get the auth token from the store
      const val = await getKey(loginValue);
      //set headers and pother params
      const param = {
        method: 'GET',
        headers: {
          Authorization: `Token ${val}`,
        },
      };
      // on success callback
      const callback = onWeeklyWinnersSuccess;
      //on fail callback
      const err = () => winnersErrDis('weekly');
      if (val !== undefined && val !== null) {
        request(`winners`, param, callback, err, dispatch);
      }
    })();
  };
};

export const likeFxn = (payload) => {
  return function (dispatch, getState) {
    (async () => {
      // dispatch the like id to update redux store
      dispatch(like(payload));
      // get token from securestore
      const val = await getKey(loginValue);
      // set headers and other params
      const param = {
        method: 'GET',
        headers: {
          Authorization: `Token ${val}`,
        },
      };
      if (val !== undefined && val !== null) {
        await fetch(`${domain}articles/${payload}/like`, param)
          .then((res) => res.json())
          .then((json) => {
            return dispatch(likeDisperse({ id: json.id, state: 1 }));
          })
          .catch((err) => {
            null
            return dispatch(onFailedLike({ id: payload, state: 1 }));
            // return showTaoster({text:'Poor network', type: 'danger', })
          });
      }
    })();
  };
};

export const unlikeFxn = (payload) => {
  return function (dispatch, getState) {
    (async () => {
      // dispatch the like id to update redux store
      dispatch(like(payload));
      // get token from securestore
      const val = await getKey(loginValue);
      // set headers and other params
      const param = {
        method: 'GET',
        headers: {
          Authorization: `Token ${val}`,
        },
      };
      if (val !== undefined && val !== null) {
        await fetch(`${domain}articles/${payload}/unlike`, param)
          .then((res) => res.json())
          .then((json) => {
            dispatch(likeDisperse({ id: json.id, state: 0 }));
          })
          .catch((err) => {
            null
            return dispatch(onFailedLike({ id: payload, state: 0 }));
            // return showTaoster({text:'Poor network', type: 'danger', })
          });
      }
    })();
  };
};

export const archiveFxn = (payload) => {
  return function (dispatch, getState) {
    (async () => {
      dispatch(archived(payload));
      // get token from securestore
      const val = await getKey(loginValue);
      // set headers and other params
      const param = {
        method: 'GET',
        headers: {
          Authorization: `Token ${val}`,
        },
      };
      if (val !== undefined && val !== null) {
        fetch(`${domain}articles/${payload.item.id}/archive`, param)
          .then((res) => res.json())
          .then((json) => {
            return dispatch(archiveDisperse({ ...payload, state: 1 }));
          })
          .catch((err) => dispatch(onFailedArchive({ ...payload, state: 1 })));
        // return showTaoster({text:'Poor network', type: 'danger', })
      }
    })();
  };
};

export const unarchivedFromServer = (payload) => {
  return (dispatch) => {
    (async () => {
      // get token from securestore
      const val = await getKey(loginValue);
      // set headers and other params
      const param = {
        method: 'GET',
        headers: {
          Authorization: `Token ${val}`,
        },
      };
      if (val !== undefined && val !== null) {
        await fetch(`${domain}articles/${payload.id}/unarchive`, param)
          .then((res) => res.json())
          .then((json) => {
            dispatch(resolveUnarchivedArticles(payload));
          })
          .catch((err) => {
            dispatch(errArchive(err.message));
            setTimeout(() => {
              dispatch(errArchive(null));
            }, 2000);
          });
      }
    })();
  };
};

export const unarchiveFxn = (payload) => {
  return function (dispatch, getState) {
    (async () => {
      // articles/2
      // get token from securestore
      const val = await getKey(loginValue);
      // set headers and other params
      const param = {
        method: 'GET',
        headers: {
          Authorization: `Token ${val}`,
        },
      };
      if (val !== undefined && val !== null) {
        await fetch(`${domain}articles/${payload.item.id}/unarchive`, param)
          .then((res) => res.json())
          .then((json) => {
            dispatch(archiveDisperse({ ...payload, state: 0 }));
          })
          .catch((err) => dispatch(onFailedArchive({ ...payload, state: 0 })));
      }
    })();
  };
};

// buy points
export const buyPoints = (payload) => {
  return function (dispatch, getState) {
    (async () => {
      const val = await getKey(loginValue);
      null
      const param = {
        method: 'POST',
        headers: {
          Authorization: `Token ${val}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };
      if (val !== undefined || val !== null) {
        await fetch(`${domain}purchase_game_points`, param)
          .then((res) => res.json())
          .then((response) => {
            null
          })
          .catch(err => null)
      }
    })()
  };
};
export const endGame = (payloads) => {
  return function (dispatch, getState) {
    (async () => {
      const id = getState().quiz.game_id;
      null
      // get token from securestore
      const val = await getKey(loginValue);
      const { payload } = payloads;
      const fxn = payloads.fxn !== undefined ? payloads.fxn : null;
      // settin up params
      const { undisplayed, skipped, score } = payload;
      const unanswered = [...undisplayed, ...skipped];

      const param = {
        method: 'POST',
        headers: {
          Authorization: `Token ${val}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, score }),
      };
      if (val !== undefined && val !== null) {
        fetch(`${domain}end_game`, param)
          .then((res) => res.json())
          .then((res) => {
            null
            if (fxn !== null) {
              dispatch(startGameFxn(fxn));
              removeQuestions(payload);
            }
          })
          .catch((err) => {
            null
            registerQuestion(payload);
            if (fxn !== null) {
              dispatch(loadQuiz(false));
            }
          });
      }
    })();
  };
};

export const signUp = (payload, onSuccess, onFail) => {
  return (dispatch, getState) => {
    (async () => {
      // dispatch creating user loading
      dispatch(createUserLoading());
      // settin up params
      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };
      await fetch(`${domain}signup`, param)
        .then((res) => res.json())
        .then((json) => {
          console.log(json)
          // dispatch stop creating user loading
          dispatch(createUserStop());
          const obj = isJson(json);
          if (obj.constructor === Object && obj.token) {
            const objs = JSON.parse(JSON.stringify(obj));
            storeKey(confirm, obj.token)
            console.log(objs)
            dispatch(verificationPoint(objs));
            // dispatch(vNumber(23456));
            return obj;
          } else {
            const val = Object.entries(obj);
            throw new Error(`${val[0][0]}: ${val[0][1][0]}`);
          }
        })
        .then((obj) => storeKey(confirm, obj.token))
        .then((response) => onSuccess())
        .catch((err) => {
          console.log(err.message)
          dispatch(signUpErr(err.message));
          onFail({message: getState().login.signUpErr})
          dispatch(createUserStop());
          setTimeout(() => {
            dispatch(signUpErr(null));
          }, 3000);
        });
    })();
  };
};

export const editUserProfile = (payload, onSuccess, onFail) => {
  return (dispatch, getState) => {
    (async () => {
      const val = await getKey(loginValue);
      const param = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          Authorization: `Token ${val}`,
      },
      body: JSON.stringify(payload),
      };
      dispatch(awaitingRequest())
      await fetch(`${domain}user/edit`, param)
        .then(res => res.json())
        .then((data) => {
          console.log(data)
          if (data.status === "success") {
            dispatch(successfulRequest())
            onSuccess()
          } else {
             const val = Object.entries(data);
            throw new Error(`${val[0][0]}: ${val[0][1][0]}`);
          }
        })
        .catch((error) => {
          console.log(error)
          dispatch(failedRequest())
          dispatch(signUpErr(error.message));
          onFail({message: getState().login.signUpErr})
      })
    })()
  }
}
export const requestVerification = (payload, onSuccess, onFail) => {
  return (dispatch, getState) => {
    (async () => {
      const val = await getKey(confirm);
      null
      const param = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          Authorization: `Token ${val}`,
      },
      body: JSON.stringify(payload),
      };
      dispatch(awaitingRequest())
      await fetch(`${domain}verify_email_request`, param)
        .then(res => res.json())
        .then((data) => {
          console.log(data, "<====verify request")
          onSuccess()
          dispatch(successfulRequest())
        })
        .catch((error) => {
          onFail()
        dispatch(failedRequest())
      })
    })()
  }
}

export const verifyEmail = (payload, onSuccess, onFail) => {
  return (dispatch, getState) => {
    (async () => {
      const val = await getKey(confirm);
      console.log(payload)
      const param = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          Authorization: `Token ${val}`,
      },
      body: JSON.stringify(payload),
      };
     dispatch(awaitingRequest())
      await fetch(`${domain}verify_email`, param)
        .then(res => res.json())
        .then((data) => {
          if (data.message === "success") {
            console.log(data, "<=========")
            storeKey(loginValue, data.token)
            deleteKey("confirm")
            dispatch(successfulRequest())
            onSuccess()
          } else {
            console.log(data)
            dispatch(failedRequest())
            onFail()
          }
        })
        .catch((error) => {
            dispatch(failedRequest())
        })
    })()
  }
}

export const callStartGame = (fxn = null) => {
  return (dispatch, getState) => {
    (async () => {
      dispatch(loadQuiz(true));
      dispatch(loadQuestion({}));
      const sql = 'SELECT id, desc FROM endquestions WHERE desc IN (?,?)';
      db.transaction(
        (tx) => {
          tx.executeSql(
            sql,
            ['skipped', 'undisplayed'],
            (txO, { rows: { _array, length } }) => {
              if (length) {
                let skipped = [];
                let undisplayed = [];
                _array.forEach((item) => {
                  if (item.desc === 'skipped') {
                    skipped = [...skipped, item.id];
                  } else {
                    undisplayed = [...undisplayed, item.id];
                  }
                });
                let payload = { skipped, undisplayed };
                dispatch(endGame({ payload, fxn }));
              } else {
                if (fxn !== null) {
                  dispatch(startGameFxn(fxn));
                } else {
                  dispatch(startGameFxn());
                }
              }
            },
            (err) => null
          );
        },
        (err) => null
      );
    })();
  };
};

export const startGameFxn = (fxn = null) => {
  return (dispatch) => {
    (async () => {
      null
      // get token from securestore
      const val = await getKey(loginValue);
      // set headers and other params
      const param = {
        method: 'POST',
        headers: {
          Authorization: `Token ${val}`,
        },
      };
      null
      if (val !== undefined && val !== null) {
        fetch(`${domain}start_game`, param)
          .then((res) => res.json())
          .then((resp) => {
            null
            const response = isJson(resp);
            if (response.questions !== undefined) {
              return quizDispatcher(resp);
            } else {
              throw new Error('No question sent');
            }
          })
          .then((json) => {
            dispatch(loadQuestion(json));
    dispatch(updateUserinfo({ name: "points", value: "-1" }))
            if (fxn !== null) fxn();
          })
          .catch((err) => {
            null
            dispatch(startGameErr(err.message));
            setTimeout(() => {
              dispatch(startGameErr(null));
            }, 2000);
          })
          .then((res) => {
            dispatch(loadQuiz(false));
          });
      }
    })();
  };
};

export const getSearchArray = ({ subject, search }) => {
  return (dispatch) => {
    (async () => {
      const val = await getKey(loginValue);
      const param = {
        method: 'POST',
        headers: {
          Authorization: `Token ${val}`,
        },
        body: JSON.stringify({ category: subject, body: search }),
      };
      if (val !== undefined && val !== null) {
        dispatch(actionCreator(SORT_SEARCH, false));
        dispatch(addSearchToDb(search));
        dispatch(actionCreator(LOAD_SEARCH, true));
        fetch(`${domain}articles/search`, param)
          .then((res) => res.json())
          .then((resp) => {
            dispatch(actionCreator(SEARCH_ITEM_ARRAY, resp));
          })
          .catch((e) => null)
          .then((res) => {
            dispatch(actionCreator(LOAD_SEARCH, false));
          });
      } else {
        dispatch(actionCreator(ADD_SEARCH_ITEM, search));
      }
    })();
  };
};
