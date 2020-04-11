import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import Strings from '../../utilities/Strings'

// Replace this with your own config details
var config = {
  apiKey: "AIzaSyDoeoK4uWp3oz-srBEuB5kLFSWK9A33CW4",
  authDomain: "staffa-13e8a.firebaseapp.com",
  databaseURL: "https://staffa-13e8a.firebaseio.com",
  projectId: "staffa-13e8a",
  storageBucket: "staffa-13e8a.appspot.com",
  messagingSenderId: "1007743977250",
  appId: "1:1007743977250:web:e8986738d43945dcbf877b",
  measurementId: "G-71XLCEGF8M"
};
const firebase2 = firebase.initializeApp(config, "sub");

export const addUser = newUser => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    firebase2
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then(resp => {
        return firestore
          .collection(Strings.FS_COLLECTION_USERS)
          .doc(resp.user.uid)
          .set({
            firstName: newUser.firstName,
            lastName: newUser.lastName,

            isSingleSite: newUser.isSingleSite,
            isSingleDep: newUser.isSingleDep,
            accountName: newUser.accountName,
            orgType: newUser.orgType,
            email: newUser.email,
            uid: newUser.uid,

            initials: newUser.firstName[0] + newUser.lastName[0]
          });
      })
      .then(() => {
        dispatch({ type: "USER_SIGNUP_SUCCESS" });
        firebase2.auth().signOut();
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: "USER_SIGNUP_ERROR", err });
      });
  };
};
