import { db } from '../processes/db';
import { updateUser } from './user';

export const CORRECT = 'CORRECT';
export const WRONG = 'WRONG';
export const NO_POINTS = 'NO_POINTS';
export const INCREASE_SCORE = 'INCREASE_SCORE';
export const DECREASE_SCORE = 'DECREASE_SCORE';
export const DISPLAYED = 'DISPLAYED';
export const NEXT = 'NEXT';
export const ACTIVE = 'ACTIVE';
export const TIME_OUT = 'TIME_OUT';
export const SKIP = 'SKIP';
export const PLAYED = 'PLAYED';
export const SET_OVERLAY = 'SET_OVERLAY';
export const PLAY_AGAIN = 'PLAY_AGAIN';
export const ANSWER = 'ANSWER';
export const LOAD_QUESTION = 'LOAD_QUESTION';
export const CORRECT_ANS = 'CORRECT_ANS';
export const SET_TIME = 'SET_TIME';
export const LOADING_QUIZ = 'LOADING_QUIZ';
export const START_GAME = 'START_GAME';
export const START_GAME_ERR = 'START_GAME_ERR';
export const PLAYED_CURRENT = 'PLAYED_CURRENT';
export const PLAYED_PREV = 'PLAYED_PREV';
export const RESET_PLAYED_CURRENT = 'RESET_PLAYED_CURRENT';

export const loadQuestion = (payload) => {
    return { type: LOAD_QUESTION, payload };
};

export const answered = (payload) => {
  return {
    type: ANSWER,
    payload: payload,
  };
};

export const setOverlay = (payload) => {
  null
  return {
    type: SET_OVERLAY,
    payload,
  };
};

export const noPoints = (payload) => ({ type: NO_POINTS, payload });

export const resetplayedCurrent = (payload) => {
  return {
    type: RESET_PLAYED_CURRENT,
    payload: payload,
  };
};
export const playedPrev = () => ({ type: PLAYED_PREV });
export const playedCurrent = () => {
  return {
    type: PLAYED_CURRENT,
  };
};
export const settime = (payload) => {
  return {
    type: SET_TIME,
    payload: payload,
  };
};
export const correctAns = (payload) => {
  return {
    type: CORRECT_ANS,
    payload: payload,
  };
};
export const playingAgain = () => {
  return {
    type: PLAY_AGAIN,
  };
};
export const played = (payload) => {
  return {
    type: PLAYED,
    payload: payload,
  };
};
export const increaseScore = () => {
  return {
    type: INCREASE_SCORE,
  };
};
export const decreaseScore = () => {
  return {
    type: DECREASE_SCORE,
  };
};
export const correctAnswers = (payload) => {
  return {
    type: CORRECT,
    payload: payload,
  };
};
export const wrongAnswers = (payload) => {
  return {
    type: WRONG,
    payload: payload,
  };
};
export const displayedQuestion = (payload) => {
  return {
    type: DISPLAYED,
    payload: payload,
  };
};
export const skip = (payload) => {
  return {
    type: SKIP,
    payload: payload,
  };
};
export const next = () => {
  return {
    type: NEXT,
  };
};
export const active = () => {
  return {
    type: ACTIVE,
  };
};
export const timeOut = () => {
  return {
    type: TIME_OUT,
  };
};
export const startGame = (payload) => ({ type: START_GAME, payload });
export const loadQuiz = (payload) => ({ type: LOADING_QUIZ, payload });
export const startGameErr = (payload) => ({ type: START_GAME_ERR, payload });
export const registerPoint = (payload) => {
  return (dispatch) => {
    (async () => {
      const sql = 'UPDATE user SET points = ? ';
      db.transaction(
        (tx) => {
          tx.executeSql(
            sql,
            [payload],
            (txObj, { rowsAffected }) => {
              if (rowsAffected) {
                dispatch(updateUser({ name: 'points', value: payload }));
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

export const createdb = async () => {
  const sql =
    'CREATE TABLE IF NOT EXISTS endquestions(uid INTEGER PRIMARY KEY AUTOINCREMENT, id INT UNIQUE, desc TEXT)';
  await db.transaction(
    (tx) => {
      tx.executeSql(
        sql,
        null,
        (txO, { rows }) => {
          null
        },
        (err) => null
      );
    },
    (err) => null
  );
};

export const registerQuestion = async (payload) => {
  const { skipped, undisplayed } = payload;
  const sql = 'INSERT OR REPLACE INTO endquestions(id,desc) VALUES(?,?)';
  db.transaction(
    (tx) => {
      skipped.forEach((id) => {
        tx.executeSql(
          sql,
          [id, 'skipped'],
          (txO, { rowsAffected }) => {
            null
          },
          (err) => null
        );
      });
      undisplayed.forEach((id) => {
        tx.executeSql(
          sql,
          [id, 'undisplayed'],
          (txO, { rowsAffected }) => {
            null
          },
          (err) => null
        );
      });
    },
    (err) => null
  );
};

export const removeQuestions = async (payload) => {
  const { skipped, undisplayed } = payload;
  const sql = 'DELETE * FROM endquestions WHERE id = ?';
  db.transaction(
    (tx) => {
      skipped.forEach((id) => {
        tx.executeSql(
          sql,
          [id],
          (txO, { rowsAffected }) => {
            null
          },
          (err) => null
        );
      });
      undisplayed.forEach((id) => {
        tx.executeSql(
          sql,
          [id],
          (txO, { rowsAffected }) => {
            null
          },
          (err) => null
        );
      });
    },
    (err) => null
  );
};

export const quizDispatcher = (payload) => {
  try {
    const { id, questions } = payload;
    null
    let easy = [];
    let moderate = [];
    let difficult = [];
    const arrKeys = Object.keys(questions);
    arrKeys.forEach((arr) => {
      if (questions[arr]['easy'].length) {
        questions[arr]['easy'].forEach((item) => {
          item['category'] = arr;
          item['options'] = [
            item['option_1'],
            item['option_2'],
            item['option_3'],
            item['option_4'],
          ];
          easy = [...easy, item];
        });
      }
      if (questions[arr]['moderate'].length) {
        questions[arr]['moderate'].forEach((item) => {
          item['category'] = arr;
          item['options'] = [
            item['option_1'],
            item['option_2'],
            item['option_3'],
            item['option_4'],
          ];
          moderate = [...moderate, item];
        });
      }
      if (questions[arr]['difficult'].length) {
        questions[arr]['difficult'].forEach((item) => {
          item['category'] = arr;
          item['options'] = [
            item['option_1'],
            item['option_2'],
            item['option_3'],
            item['option_4'],
          ];
          difficult = [...difficult, item];
        });
      }
    });
    return { id, easy, moderate, difficult };
  } catch (err) {
    null
  }
};
