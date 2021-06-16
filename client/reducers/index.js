import { combineReducers } from "redux";
import authReducer from "./authReducer";
import uiReducer from "./uiReducer";

const reducers = combineReducers({ auth: authReducer, ui: uiReducer });

export default reducers;
