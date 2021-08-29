import produce from 'immer';

import { RELOAD_RANK, LOAD_LIVE_RANK } from '../actions/rank';

const initialState = {
  reloadPage: false,
  liveRank: [],
  dailyWinners: [],
};

export default function rankReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case RELOAD_RANK:
      return produce(state, (draft) => {
        draft.reloadPage = payload;
      });
    case LOAD_LIVE_RANK:
      return produce(state, (draft) => {
        draft.liveRank = payload;
      });
    default:
      return state;
  }
}
