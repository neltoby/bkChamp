export const SET_DAILY_WINNERS = 'SET_DAILY_WINNERS';
export const LOADING_WEEKLY_WINNERS = 'LOADING_WEEKLY_WINNERS';
export const LOADING_DAILY_WINNERS = 'LOADING_DAILY_WINNERS';
export const LOADING_WEEKLY_WINNERS_STOP = 'LOADING_WEEKLY_WINNERS_STOP';
export const LOADING_DAILY_WINNERS_STOP = 'LOADING_DAILY_WINNERS_STOP';
export const SET_WEEKLY_WINNERS = 'SET_WEEKLY_WINNERS';
export const WEEKLY_WINNER_LOADING_FAILED = 'WEEKLY_WINNER_LOADING_FAILED';
export const DAILY_WINNER_LOADING_FAILED = 'DAILY_WINNER_LOADING_FAILED';

//=================================Weekly Wins==========================//
// action function for setting upp the loading icon
export const loadingWeeklyWinners = () => {
  return {
    type: LOADING_WEEKLY_WINNERS,
  };
};

export const onWeeklyWinnersSuccess = (payload) => {
  return async function (dispatch, getState) {
    console.log(payload);
    await dispatch(setWeeklyWinners(payload));
    await dispatch(loadingWeeklyWinnersStop());
  };
};
export const setWeeklyWinners = (payload) => {
  return {
    type: SET_WEEKLY_WINNERS,
    payload: payload,
  };
};
export const weeklyWinnersLoadingFailed = () => {
  return {
    type: WEEKLY_WINNER_LOADING_FAILED,
  };
};

export const loadingWeeklyWinnersStop = () => {
  return {
    type: LOADING_WEEKLY_WINNERS_STOP,
  };
};

//=============================Daily Wins================================
export const loadingDailyWinners = () => {
  return {
    type: LOADING_DAILY_WINNERS,
  };
};

// create Table `Winners` onFocusEffect SelectHome
// onWinnersSuccess insert the payload into the Table Winners
export const onDailyWinnersSuccess = (payload) => {
  return function (dispatch, getState) {
    console.log(payload, '<====payload');
    let new_arr = [];
    payload.forEach((user) => {
      // returns the user_id in the new array, if it exists
      let temp = new_arr.filter((item) => item.user_id === user.user_id)[0];
      if (temp) {
        // if it exists, update the score to the highest score
        let new_score = temp.score >= user.score ? temp.score : user.score;
        new_arr[new_arr.indexOf(temp)].score = new_score;
      } else {
        // if it doesn't push the user item to the new array
        new_arr.push(user);
      }
    });
    dispatch(setDailyWinners(new_arr));
    dispatch(loadingDailyWinnersStop());
  };
};

export const setDailyWinners = (payload) => {
  return {
    type: SET_DAILY_WINNERS,
    payload: payload,
  };
};

export const dailyWinnersLoadingFailed = () => {
  return {
    type: DAILY_WINNER_LOADING_FAILED,
  };
};

export const loadingDailyWinnersStop = () => {
  return {
    type: LOADING_DAILY_WINNERS_STOP,
  };
};

export const winnersErrDis = (payload) => {
  return function (dispatch, getState) {
    if (payload === 'weekly') {
      dispatch(weeklyWinnersLoadingFailed());
      dispatch(loadingWeeklyWinnersStop());
    } else {
      dispatch(dailyWinnersLoadingFailed());
      dispatch(loadingDailyWinnersStop());
    }
  };
};
