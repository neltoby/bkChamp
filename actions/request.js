import { db } from '../processes/db';
import isJson from '../processes/isJson';
import { getKey, storeKey } from '../processes/keyStore';
import { confirm, loginValue } from '../processes/lock';
import {
  archived, archiveDisperse, articleErrDis, errArchive, getArchived, like, likeDisperse, onArticleSuccess, onFailedArchive, onFailedLike, resolveArchive,
  resolveUnarchivedArticles, setArticle
} from './learn';
import { createUserLoading, createUserStop, login, loginDetails, loginStatus, logOutUser, signUpErr, verificationPoint, vNumber } from './login';
import {
  loadQuestion, loadQuiz, quizDispatcher, registerQuestion, removeQuestions, startGameErr
} from './quiz';
import {
  actionCreator,
  addSearchToDb,
  ADD_SEARCH_ITEM, LOAD_SEARCH, SEARCH_ITEM_ARRAY, SORT_SEARCH
} from './search';
import {
  onDailyWinnersSuccess, onWeeklyWinnersSuccess, winnersErrDis
} from './winners';
export const AWAITING_REQUEST = 'AWAITING_REQUEST';
export const SUCCESSFUL_REQUEST = 'SUCCESSFUL_REQUEST';
export const FAILED_REQUEST = 'FAILED_REQUEST';

const domain = 'https://bookchamp.herokuapp.com/api/v1/';

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
    console.log(payload.token);
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
      // console.log(res)
      if (res.status === 200) {
        return res.json();
      } else if (endpoint === 'login') {
        throw new Error('A user with this username and password was not found');
      } else {
        throw new Error('Failed request with code ' + res.status);
      }
    })
    .then((res) => {
      console.log(res);
      dispatch(callback(res));
    })
    .catch((error) => {
      // console.log(error.message)
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
      console.log('delete user was called');
      // let pk = getState().user.user.id
      let pk = payload;
      console.log('requests log==>', pk);
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
          .then((response) => console.log(response))
          .then(dispatch(logOutUser()))
          .catch((err) => console.log(err));
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
          .catch((err) => console.log(err))
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
      console.log('getArticles was called');
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
      const callback = onArticleSuccess;
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
      console.log('getWinners was called');
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
      console.log('getWinners was called');
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
            console.log(err);
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
            console.log(err);
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
      console.log(payload)
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
            console.log(response)
          })
          .catch(err => console.log(err));
      }
    })()
  };
};
export const endGame = (payloads) => {
  return function (dispatch, getState) {
    (async () => {
      const id = getState().quiz.game_id;
      console.log(id, '<====endGame id');
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
            console.log(res, '<===response from end_game');
            if (fxn !== null) {
              dispatch(startGameFxn(fxn));
              removeQuestions(payload);
            }
          })
          .catch((err) => {
            console.log(err, 'err from end game');
            registerQuestion(payload);
            if (fxn !== null) {
              dispatch(loadQuiz(false));
            }
          });
      }
    })();
  };
};

export const signUp = (payload, navigateFxn) => {
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
          // dispatch stop creating user loading
          dispatch(createUserStop());
          console.log(json, 'line 296');
          const obj = isJson(json);
          if (obj.constructor === Object && obj.token) {
            const objs = JSON.parse(JSON.stringify(obj));
            dispatch(verificationPoint(objs));
            dispatch(vNumber(23456));
            return obj;
          } else {
            const val = Object.entries(obj);
            console.log(val);
            throw new Error(`${val[0][0]}: ${val[0][1][0]}`);
          }
        })
        .then((obj) => storeKey(confirm, obj.token))
        .then((response) => navigateFxn())
        .catch((err) => {
          console.log(err, err.message);
          dispatch(signUpErr(err.message));
          dispatch(createUserStop());
          setTimeout(() => {
            dispatch(signUpErr(null));
          }, 3000);
          console.log(err.message, 'fro request.js eror reporting 322');
        });
    })();
  };
};
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
            (err) => console.log(err)
          );
        },
        (err) => console.log(err),
        () => console.log('susx')
      );
    })();
  };
};

export const startGameFxn = (fxn = null) => {
  return (dispatch) => {
    (async () => {
      console.log('startGame was called');
      // get token from securestore
      const val = await getKey(loginValue);
      // set headers and other params
      const param = {
        method: 'POST',
        headers: {
          Authorization: `Token ${val}`,
        },
      };
      console.log(val);
      if (val !== undefined && val !== null) {
        fetch(`${domain}start_game`, param)
          .then((res) => res.json())
          .then((resp) => {
            console.log(resp);
            const response = isJson(resp);
            if (response.questions !== undefined) {
              return quizDispatcher(resp);
            } else {
              throw new Error('No question sent');
            }
          })
          .then((json) => {
            dispatch(loadQuestion(json));
            if (fxn !== null) fxn();
          })
          .catch((err) => {
            console.log(err, 'from start game');
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
          .catch((e) => console.log(e))
          .then((res) => {
            dispatch(actionCreator(LOAD_SEARCH, false));
          });
      } else {
        dispatch(actionCreator(ADD_SEARCH_ITEM, search));
      }
    })();
  };
};
