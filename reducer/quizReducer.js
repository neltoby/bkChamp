import produce from 'immer';
import {
  ACTIVE, ANSWER, CORRECT, CORRECT_ANS, DECREASE_SCORE, DISPLAYED, INCREASE_SCORE, LOADING_QUIZ, LOAD_QUESTION, NEXT, NO_POINTS, PLAYED, PLAYED_CURRENT,
  PLAYED_PREV, PLAY_AGAIN, RESET_PLAYED_CURRENT,
  SET_OVERLAY, SET_TIME, SKIP, START_GAME, START_GAME_ERR, TIME_OUT, WRONG
} from '../actions/quiz';

const initialState = {
  game_id: 0,
  recievedQuestion: {},
  question: {},
  score: parseFloat('0.00'),
  level: null,
  currentQuestion: {},
  count: 0,
  played: [],
  displayed: [],
  correct: [],
  wrong: [],
  skipped: [],
  setTime: '',
  status: 'active',
  times: 0,
  setOverlay: 'cancel',
  playedCurrent: 0,
  answer: false,
  correctAns: false,
  loadingQuiz: false,
  startGameErr: null,
  noPoints: false,
};

export default function quizReducer(state = initialState, action) {
  switch (action.type) {
    case PLAY_AGAIN: {
      return produce(state, (draft) => {
        draft.score = parseFloat('0.00');
        draft.count = 0;
        draft.displayed = [];
        draft.correct = [];
        draft.wrong = [];
        draft.played = [];
        draft.skipped = [];
        draft.status = 'active';
        draft.times = state.times + 1;
        draft.setOverlay = 'cancel';
        draft.answer = false;
        draft.correctAns = false;
        //==============>convert ct from ms+6.5 mins+offset
        //===============^^^^^^^^^^^^^^^^---^^^^^^^^^^^^
        (draft.setTime = Date.now() / 1000 + 60 * 6.5 + 2),
          (draft.playedCurrent = 0);
      });
    }
    case LOAD_QUESTION: {
      return produce(state, (draft) => {
        const { payload } = action;
        draft.game_id = payload.id
        if (Object.entries(payload).length) {
          draft.recievedQuestion = JSON.parse(JSON.stringify(payload));
          let level;
          if (payload['easy'].length > 0) {
            level = 'easy';
          } else {
            if (payload['moderate'].length > 0) {
              level = 'moderate';
            } else {
              level = 'difficult';
            }
          }
          const num = Math.floor(Math.random() * payload[level].length);
          const quest = payload[level][num];
          draft.currentQuestion = quest;
          const newQuestion = payload[level].filter(
            (item) => item.id !== quest.id
          );
          payload[level] = newQuestion;
          draft.question = payload;
          draft.count = state.count + 1;
          draft.level = level;
        } else {
          draft.recievedQuestion = {};
          draft.currentQuestion = {};
          draft.question = {};
        }
      });
    }
    case RESET_PLAYED_CURRENT: {
      return produce(state, (draft) => {
        draft.playedCurrent = action.payload;
      });
    }
    case SET_OVERLAY: {
      return produce(state, (draft) => {
        if (state.setOverlay === 'end' && action.payload === 'timeOut') {
          draft.setOverlay = 'end';
        } else if (state.setOverlay === 'timeOut' && action.payload === 'end') {
          draft.setOverlay = 'timeOut';
        } else {
          draft.setOverlay = action.payload;
        }
      });
    }
    case PLAYED_PREV: {
      return produce(state, (draft) => {
        draft.playedCurrent = state.playedCurrent - 1;
      });
    }
    case PLAYED_CURRENT: {
      return produce(state, (draft) => {
        draft.playedCurrent = state.playedCurrent + 1;
      });
    }
    case SET_TIME: {
      return produce(state, (draft) => {
        draft.setTime = action.payload;
      });
    }
    case CORRECT_ANS: {
      return produce(state, (draft) => {
        draft.correctAns = action.payload;
      });
    }
    case ANSWER: {
      return produce(state, (draft) => {
        draft.answer = action.payload;
      });
    }
    case INCREASE_SCORE: {
      return produce(state, (draft) => {
        draft.score = parseFloat(
          parseFloat(state.score) + parseFloat('3.00')
        ).toFixed(2);
      });
    }
    case DECREASE_SCORE: {
      return produce(state, (draft) => {
        draft.score = parseFloat(
          parseFloat(state.score) - parseFloat('0.10')
        ).toFixed(2);
      });
    }
    case PLAYED: {
      return produce(state, (draft) => {
        draft.played.push(action.payload);
      });
    }
    case CORRECT: {
      return produce(state, (draft) => {
        draft.correct.push(action.payload);
      });
    }
    case WRONG: {
      return produce(state, (draft) => {
        draft.wrong.push(action.payload);
      });
    }
    case DISPLAYED: {
      return produce(state, (draft) => {
        draft.displayed.push(action.payload);
      });
    }
    case NEXT: {
      return produce(state, (draft) => {
        const { count } = state;
        const questions = JSON.parse(JSON.stringify(state.question));
        let level;
        if (count < 5) {
          level = 'easy';
        } else {
          if (count >= 5 && count < 15) {
            level = 'moderate';
          } else {
            if (count >= 15 && count < 20) {
              level = 'easy';
            } else {
              if (count >= 20 && count < 30) {
                level = 'moderate';
              } else {
                level = 'difficult';
              }
            }
          }
        }
        if (questions[level].length) {
          const num = Math.floor(Math.random() * questions[level].length);
          const quest = questions[level][num];
          draft.currentQuestion = quest;
          const newQuestion = questions[level].filter(
            (item) => item.id !== quest.id
          );
          questions[level] = newQuestion;
          draft.question = questions;
          draft.count = count + 1;
          draft.level = level;
        } else {
          if (level === 'easy') {
            if (questions['moderate'].length) {
              level = 'moderate';
            } else {
              if (questions['difficult'].length) {
                level = 'difficult';
              }
            }
          } else if (level === 'moderate') {
            if (questions['difficult'].length) {
              level = 'difficult';
            }
          }
          draft.level = level;
          const num = Math.floor(Math.random() * questions[level].length);
          const quest = questions[level][num];
          draft.currentQuestion = quest;
          const newQuestion = questions[level].filter(
            (item) => item.id !== quest.id
          );
          questions[level] = newQuestion;
          draft.question = questions;
          draft.count = count + 1;
          draft.level = level;
        }
      });
    }
    case SKIP: {
      return produce(state, (draft) => {
        draft.skipped.push(action.payload);
      });
    }
    case ACTIVE: {
      return produce(state, (draft) => {
        draft.status = 'active';
      });
    }
    case TIME_OUT: {
      return produce(state, (draft) => {
        draft.status = 'time_out';
        draft.setTime = '';
        // draft.currentQuestion = {}
      });
    }
    case NO_POINTS: {
      return produce(state, (draft) => {
        null
        draft.noPoints = action.payload;
      });
    }
    case LOADING_QUIZ: {
      return produce(state, (draft) => {
        draft.loadingQuiz = action.payload;
      });
    }
    case START_GAME: {
      return produce(state, (draft) => {
        draft.question = action.payload;
      });
    }
    case START_GAME_ERR: {
      return produce(state, (draft) => {
        draft.startGameErr = action.payload;
      });
    }
    default: {
      return state;
    }
  }
}
