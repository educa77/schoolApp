import { createStore, applyMiddleware } from "redux";
import reducers from "../reducers/index";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import persistState from "redux-localstorage";

// Tuvimos que hacer este chequeo, porque la función persistState usa localStorage
// y no debe correr durante el SSR

const store =
  typeof localStorage !== "undefined"
    ? createStore(
        reducers,
        composeWithDevTools(applyMiddleware(thunk), persistState(["auth"]))
      )
    : createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));

export default store;
