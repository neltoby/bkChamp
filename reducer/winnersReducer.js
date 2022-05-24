import produce from 'immer';
import {
  DAILY_WINNER_LOADING_FAILED, LOADING_DAILY_WINNERS, LOADING_DAILY_WINNERS_STOP, LOADING_WEEKLY_WINNERS, LOADING_WEEKLY_WINNERS_STOP, SET_DAILY_WINNERS, SET_WEEKLY_WINNERS,
  WEEKLY_WINNER_LOADING_FAILED
} from '../actions/winners';

const initialState = {
  daily_winners: [],
  weekly_winners: [],
  loading_weekly_winners: false,
  loading_daily_winners: false,
  loading_weekly_err: false,
  loading_daily_err: false,
};

export default function winnersReducer(state = initialState, action) {
  switch (action.type) {
    case LOADING_WEEKLY_WINNERS: {
      return produce(state, (draft) => {
        draft.loading_weekly_winners = true;
      });
    }
    case SET_WEEKLY_WINNERS: {
      return produce(state, (draft) => {
        draft.weekly_winners = action.payload
      })
    }
    case WEEKLY_WINNER_LOADING_FAILED: {
      return produce(state, (draft) => {
        draft.loading_weekly_err = true;
      });
    }
    case LOADING_WEEKLY_WINNERS_STOP: {
      return produce(state, (draft) => {
        draft.loading_weekly_winners = false;
      });
    }
    case LOADING_DAILY_WINNERS: {
      return produce(state, (draft) => {
        draft.loading_daily_winners = true;
      });
    }
    case SET_DAILY_WINNERS: {
      return produce(state, (draft) => {
        draft.daily_winners = action.payload;
        null
      });
    }
    case DAILY_WINNER_LOADING_FAILED: {
      return produce(state, (draft) => {
        draft.loading_daily_err = true;
      });
    }
    case LOADING_DAILY_WINNERS_STOP: {
      return produce(state, (draft) => {
        draft.loading_daily_winners = false;
      });
    }
    default: {
      return state;
    }
  }
}
