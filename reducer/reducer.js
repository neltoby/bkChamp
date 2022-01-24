import { combineReducers } from 'redux'
import loginReducer from './loginReducer'
import quizReducer from './quizReducer'
import requestReducer from './requestReducer'
import settingReducer from './settingReducer'
import userReducer from './userReducer'
import winnersReducer from './winnersReducer'

export default combineReducers({
  login: loginReducer,
  quiz: quizReducer,
  request: requestReducer,
  setting: settingReducer,
  user: userReducer,
  winners: winnersReducer
})