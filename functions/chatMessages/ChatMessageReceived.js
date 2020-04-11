const functions = require('firebase-functions');
const admin = require('firebase-admin');

const FS_COLLECTION_CONVERSATION = "Conversations";
const FS_COLLECTION_USERS = "Users";
const FS_COLLECTION_MESSAGES = "Messages";

exports.addChatMessage = functions.firestore
  .document(FS_COLLECTION_CONVERSATION + "/{chatID}/"+ FS_COLLECTION_MESSAGES +"/{id}")
  .onCreate(event => {
    console.log("function addChatMessage event : " + JSON.stringify(event));

    const newValue = event.data();
    console.log("function addChatMessage newValue : " + JSON.stringify(newValue));

    // const parentOne = event.data.ref;
    
    console.log("function addChatMessage parentOne : " + JSON.stringify(event.data.previous));
    
    // Get sender information
    return admin.firestore().collection(FS_COLLECTION_USERS).doc(newValue.sender).get()
      .then(doc => {
        var docData = doc.data();
        var senderName = docData.registerData.firstName + " " + docData.registerData.lastName;

        // Get receiver's FCM Token
        return admin.firestore().collection(FS_COLLECTION_USERS).doc(newValue.receiver).get()
          .then(receiverDoc => {
            var receiverData = receiverDoc.data();
            if (receiverData.FCMToken) {
              console.log("function addChatMessage pushToken : " + receiverData.FCMToken);
              let payload = {
                notification: {
                  title: senderName,
                  body: newValue.message,
                  badge: "1",
                  sound: 'default'
                },
                data:{
                  type: "ChatMessage",
                  screen: "ChatScreen",
                },
              }
              return admin.messaging().sendToDevice(receiverData.FCMToken, payload);
            } else {
              return "";
            }
          });
      });
  });
