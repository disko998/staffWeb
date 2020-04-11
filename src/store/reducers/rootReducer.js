import authReducer from "./authReducer";
import projectReducer from "./projectReducer";
import jobReducer from "./jobReducer";
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  job: jobReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer,
  user: userReducer
});

export default rootReducer;

// the key name will be the data property on the state object
