/* eslint-disable import/no-cycle */
import {
  loginStatus,
  login,
  vNumber,
  createUserStop,
  createUserLoading,
  verificationPoint,
  loginDetails,
  signUpErr,
} from './login';
import { storeKey, getKey } from '../processes/keyStore';
import { loginValue, confirm } from '../processes/lock';
import isJson from '../processes/isJson';
import { RELOAD_RANK, LOAD_LIVE_RANK } from './rank';
import {
  actionCreator,
  addSearchToDb,
  ADD_SEARCH_ITEM,
  SEARCH_ITEM_ARRAY,
  LOAD_SEARCH,
  SORT_SEARCH,
} from './search';
import {
  onArticleSuccess,
  setArticle,
  articleErrDis,
  onFailedLike,
  getArchived,
  setSubject,
  likeDisperse,
  archiveDisperse,
  archived,
  like,
  resolveArchive,
  resolveUnarchivedArticles,
  errArchive,
} from './learn';
import {
  registerQuestion,
  loadQuiz,
  startGameErr,
  quizDispatcher,
  removeQuestions,
  loadQuestion,
} from './quiz';

import { db } from '../processes/db';

export const AWAITING_REQUEST = 'AWAITING_REQUEST';
export const SUCCESSFUL_REQUEST = 'SUCCESSFUL_REQUEST';
export const FAILED_REQUEST = 'FAILED_REQUEST';

const domain = 'https://bookchamp.herokuapp.com/api/v1/';

export const awaitingRequest = () => ({
  type: AWAITING_REQUEST,
});

export const successfulRequest = () => ({
  type: SUCCESSFUL_REQUEST,
});

export const failedRequest = (payload) => ({
  type: FAILED_REQUEST,
  payload,
});

const successLogin = (payload) => function (dispatch, getState) {
  storeKey(loginValue, payload.token);
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
const failedLogin = (payload) => function (dispatch, getState) {
  // set request to failed
  dispatch(failedRequest(payload));
  setTimeout(() => {
    // reset request to the default
    dispatch(awaitingRequest());
    // stop the login activity indicator
    dispatch(loginStatus('inactive'));
  }, 500);
};

export const request = (endpoint, param, callback, errCallback, dispatch) => {
  const fet = (param) ? fetch(`${domain}${endpoint}`, param) : fetch(`${domain}${endpoint}`);
  fet
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } if (endpoint === 'login') {
        throw new Error('A user with this username and password was not found');
      } else {
        throw new Error(`Failed request with code ${res.status}`);
      }
    })
    .then((res) => dispatch(callback(res)))
    .catch((error) => {
      // console.log(error.message)
      // const err = error.message === 'A user with this username and password was not found' ?
      // 'A user with this username and password was not found' : 'Failed request' ;
      dispatch(errCallback(error.message));
    });
};
export const loginRequest = (body) => function (dispatch, getState) {
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

export const fetchArchived = () => (dispatch) => {
  (
    async () => {
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
          .then((res) => setTimeout(() => {
            dispatch(getArchived());
          }, 1000));
      }
    }
  )();
};

export const getArticles = (payload) => function (dispatch, getState) {
  (async () => {
    console.log('getArticles was called');
    // set article array to empty
    dispatch(setArticle([]));

    // set the selected subject
    dispatch(setSubject(payload));

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
      request(`articles?category=${payload.toLowerCase()}`, param, callback, err, dispatch);
    }
  })();
};

export const likeFxn = (payload) => function (dispatch, getState) {
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
        .then((json) => dispatch(likeDisperse({ id: json.id, state: 1 })))
        .catch((err) => {
          console.log(err);
          return dispatch(onFailedLike({ id: payload, state: 1 }));
          // return showTaoster({text:'Poor network', type: 'danger', })
        });
    }
  })();
};

export const unlikeFxn = (payload) => function (dispatch, getState) {
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

export const archiveFxn = (payload) => function (dispatch, getState) {
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
        .then((json) => dispatch(archiveDisperse({ ...payload, state: 1 })))
        .catch((err) => dispatch(onFailedArchive({ ...payload, state: 1 })));
      // return showTaoster({text:'Poor network', type: 'danger', })
    }
  })();
};

export const unarchivedFromServer = (payload) => (dispatch) => {
  (
    async () => {
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
    }
  )();
};

export const unarchiveFxn = (payload) => function (dispatch, getState) {
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

// buy points
export const endGame = (payloads) => function (dispatch, getState) {
  (async () => {
    // get token from securestore
    const val = await getKey(loginValue);
    const { payload } = payloads;
    const fxn = payloads.fxn !== undefined ? payloads.fxn : null;
    // settin up params
    const { undisplayed, skipped, score } = payload;
    console.log(payload);
    const unanswered = [...undisplayed, ...skipped];

    const param = {
      method: 'POST',
      headers: {
        Authorization: `Token ${val}`,
      },
      body: JSON.stringify({ unanswered, score }),
    };
    if (val !== undefined && val !== null) {
      fetch(`${domain}end_game`, param)
        .then((res) => res.json())
        .then((res) => {
          consol.log(res, 'res from end game');
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

export const signUp = (payload, navigateFxn) => (dispatch, getState) => {
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
        const obj = isJson(json);
        if (obj.constructor === Object && obj.token) {
          const objs = JSON.parse(JSON.stringify(obj));
          dispatch(verificationPoint(objs));
          dispatch(vNumber(23456));
          return obj;
        }
        const val = Object.entries(obj);
        throw new Error(`${val[0][0]}: ${val[0][1][0]}`);
      })
      .then((obj) => storeKey(confirm, obj.token))
      .then((response) => navigateFxn())
      .catch((err) => {
        dispatch(signUpErr(err.message));
        dispatch(createUserStop());
        setTimeout(() => {
          dispatch(signUpErr(null));
        }, 3000);
      });
  })();
};
export const callStartGame = (fxn = null) => (dispatch) => {
  (
    async () => {
      dispatch(loadQuiz(true));
      dispatch(loadQuestion({}));
      const sql = 'SELECT id, desc FROM endquestions WHERE desc IN (?,?)';
      db.transaction((tx) => {
        tx.executeSql(sql, ['skipped', 'undisplayed'], (txO, { rows: { _array, length } }) => {
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
            payload = { skipped, undisplayed };
            dispatch(endGame({ payload, fxn }));
          } else if (fxn !== null) {
            dispatch(startGameFxn(fxn));
          } else {
            dispatch(startGameFxn());
          }
        }, (err) => {});
      }, (err) => {},
      () => {});
    })();
};

export const startGameFxn = (fxn = null) => (dispatch) => {
  (async () => {
    // get token from securestore
    const val = await getKey(loginValue);
    // set headers and other params
    const param = {
      method: 'POST',
      headers: {
        Authorization: `Token ${val}`,
      },
    };
    if (val !== undefined && val !== null) {
      fetch(`${domain}start_game`, param)
        .then((res) => res.json())
        .then((resp) => {
          const response = isJson(resp);
          if (response.questions !== undefined) {
            return quizDispatcher(resp);
          }
          throw new Error('No question sent');
        })
        .then((json) => {
          dispatch(loadQuestion(json));
          if (fxn !== null) fxn();
        })
        .catch((err) => {
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

export const getSearchArray = ({ subject, search }) => (dispatch) => {
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
        .catch((e) => {})
        .then((res) => {
          dispatch(actionCreator(LOAD_SEARCH, false));
        });
    } else {
      dispatch(actionCreator(ADD_SEARCH_ITEM, search));
    }
  })();
};

export const getLiveRank = ({ reload = false, errorHandler }) => (dispatch, getState) => {
  (async () => {
    const val = await getKey(loginValue);
    const param = {
      method: 'GET',
      headers: {
        Authorization: `Token ${val}`,
      },
    };
    if (val !== undefined && val !== null) {
      if (reload) { dispatch(actionCreator(RELOAD_RANK, true)); }
      try {
        const res = await fetch(`${domain}winners`, param);
        if (res.status === 502) {
          console.log('error 502');
          await dispatch(getLiveRank({ reload: false, errorHandler }));
        } else if (res.status !== 200) {
          console.log(await res.json());
          errorHandler(res.statusText);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await dispatch(getLiveRank({ reload: false, errorHandler }));
        } else {
          const resp = await res.json();
          dispatch(actionCreator(LOAD_LIVE_RANK, resp));
          const currentState = getState();
          if (currentState.rank.reloadPage) {
            dispatch(actionCreator(RELOAD_RANK, false));
          }
          await dispatch(getLiveRank({ reload: false, errorHandler }));
        }
      } catch (e) {
        console.log(e);
        errorHandler(e?.message || e);
      }
    }
  })();
};
