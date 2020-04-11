import Strings from '../../utilities/Strings'
import { getUserData } from '../messageApi/messagesApi' 

export const signIn = credentials => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase
      .auth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then((d) => {
        getUserData(d.user.uid, (error, response) => {
          if(!response.registerData) {
            dispatch({ type: "LOGIN_SUCCESS" });
          } else {
            alert('This is a freelancer account. Please login through mobile')
            firebase.auth().signOut();
            dispatch({ type: "LOGIN_ERROR", err: 'error' });
          }
        })
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: "LOGIN_ERROR", err });
      });
  };
};

export const signOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: "SIGNOUT_SUCCESS" });
      });
  };
};

export const signUp = newUser => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then(resp => {
        return firestore
          .collection(Strings.FS_COLLECTION_USERS)
          .doc(resp.user.uid)
          .set({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,

            isSingleSite: newUser.isSingleSite,
            isSingleDep: newUser.isSingleDep,
            accountName: newUser.accountName,
            orgType: newUser.orgType,
            isAdmin: "true",

            initials: newUser.firstName[0] + newUser.lastName[0]
          });
      })
      .then(() => {
        dispatch({ type: "SIGNUP_SUCCESS" });
      })
      .catch(err => {
        dispatch({ type: "SIGNUP_ERROR", err });
      });
  };
};
