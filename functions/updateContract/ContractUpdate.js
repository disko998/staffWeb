const functions = require('firebase-functions');
const admin = require('firebase-admin');

const FS_COLLECTION_USERS = "Users";
const FS_COLLECTION_USER_NOTIFICATIONS = "Notifications";
const FS_COLLECTION_APP_DATA = "AppResources";
const FS_DOC_CONTRACT = "Contracts";


exports.updateContract = functions.firestore
  .document(FS_COLLECTION_APP_DATA + "/" + FS_DOC_CONTRACT)
  .onUpdate(event => {
    console.log("function updateContract event : " + JSON.stringify(event));

    const beforeData = event.after.data();
    const afterData = event.before.data();

    var title = "Staffa App";
    var message = "";
    var screen = "";
    if (beforeData.EmploymentContract !== afterData.EmploymentContract) {
      // Update in emplyment contract
      message = "Your employment contract has been updated";
      screen = "EmploymentContractScreen";
    } else if (beforeData.PrivacyPolicyContract !== afterData.PrivacyPolicyContract) {
      // Update in provacy policy contract
      message = "Privacy policy has been updated";
      screen = "PrivacyScreen";
    } else if (beforeData.InfoSharing !== afterData.InfoSharing) {
      // Update in info sharing contract
      message = "Info sharing has been updated";
      screen = "InfoSharingScreen";
    } else if (beforeData.TermsConditions !== afterData.TermsConditions) {
      // Update in terms n conditions contract
      message = "Terms and Conditions has been updated";
      screen = "TermsConditionScreen";
    }

    // Get all user's to send push notification
    return admin.firestore().collection(FS_COLLECTION_USERS).get()
      .then(snapshot => {
        return snapshot.forEach(doc => {
          var updatedData = null;
          var docData = doc.data();
          switch (screen) {
            case "EmploymentContractScreen":
              updatedData = { isEmploymentAccepted: false };
              break;
            case "PrivacyScreen":
              updatedData = { isPrivacyAccepted: false };
              break;
            case "TermsConditionScreen":
              updatedData = { isTermsAccepted: false };
              break;
            case "InfoSharingScreen":
              updatedData = { infoSharing: admin.firestore.FieldValue.delete() };
              break;
          }

          // Add Notification to user's data
          var notificationDoc = admin.firestore().collection(FS_COLLECTION_USERS).doc(doc.id).collection(FS_COLLECTION_USER_NOTIFICATIONS).doc();
          var notificationData = {
            type: "ContractUpdate",
            screen: screen,
            message: message,
            read: 0,
            time: new Date().toString(),
          }
          notificationDoc.set(notificationData);

          // Update in updated contract's value of each user
          if (updatedData) {
            admin.firestore().collection(FS_COLLECTION_USERS).doc(doc.id).update(updatedData);
          }
          if (docData.FCMToken) {
            console.log("function updatePolicies pushToken : " + docData.FCMToken);
            let payload = {
              notification: {
                title: title,
                body: message,
                badge: "1",
                sound: 'default'
              }
            }
            return admin.messaging().sendToDevice(docData.FCMToken, payload);
          } else {
            return "";
          }
        });
      });
  });

