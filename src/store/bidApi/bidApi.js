import Strings from '../../utilities/Strings'
import firebase from '../../config/fbConfig'

export const getBidsForJobId = (jobId, callBack) => {
  var bids = firebase
      .firestore()
      .collection(Strings.FS_COLLECTION_BIDS).where('jobId', '==', jobId);
  bids
    .get()
    .then(doc => {
      callBack(false, doc.docs.map(d => {
        return {
          ...d.data(),
          id: d.id
        }
      }));
    })
    .catch(err => {
      callBack(true, null);
    });
}

export const updateProfile = (user) => {
  return firebase.
    firestore()
    .collection(Strings.FS_COLLECTION_USERS)
    .doc(user.uid)
    .update({
      firstName: user.firstName,
      lastName: user.lastName,
      accountName: user.accountName,
      latitude: user.latitude,
      longitude: user.longitude
    });
}

// this concerns with money hence we need a different function and not club with updateProfile
export const updateBudget = (user) => {
  return firebase.
    firestore()
    .collection(Strings.FS_COLLECTION_USERS)
    .doc(user.uid)
    .update({
      budget: user.budget
    });
}

