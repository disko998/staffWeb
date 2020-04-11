import Strings from '../../utilities/Strings'
import firebase from "firebase/app";

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
const firebaseApp = firebase.initializeApp(config, "message");

export const getUserConversationNodeForChat = (userID) => {
  var users = firebaseApp
      .firestore()
      .collection(Strings.FS_COLLECTION_USER_CONVERSATION);
    return users.doc(userID).collection(Strings.FS_COLLECTION_CONVERSATION);
}

export const isUserConversationExist = (userID, callBack) => {
  var users = firebaseApp
      .firestore()
      .collection(Strings.FS_COLLECTION_USER_CONVERSATION);
    var coversation = users.doc(userID);
    coversation.get().then(doc => {
      callBack(doc.exists);
    });
}

export const getUserData = (userID, callBack) => {
  var users = firebaseApp.firestore().collection(Strings.FS_COLLECTION_USERS);
  var userDoc = users.doc(userID);
  userDoc
    .get()
    .then(doc => {
      callBack(false, doc.data());
    })
    .catch(err => {
      callBack(true, null);
    });
}

export const getConversationMessagesNode = (chatUID) => {
  var chatRef = firebaseApp
    .firestore()
    .collection(Strings.FS_COLLECTION_CONVERSATION)
    .doc(chatUID);
  return chatRef.collection(Strings.FS_COLLECTION_MESSAGES);
}

export const getChatUID = (uid1, uid2, topicName) => {
  if (uid1 < uid2) {
    return uid1 + uid2 + '%' + topicName.toLowerCase();
  } else {
    return uid2 + uid1 + '%' + topicName.toLowerCase();
  }
}

export const setNewConversation = (userID, receiverID, chatUID, topicName) => {
  // Entry to Sender Conversation collection
  var chatDoc = getUserConversationNode(userID, chatUID);
  var data = {
    topicName: topicName,
    receiverID: receiverID,
    senderID: userID,
    lastMessageID: '',
  };
  chatDoc.set(data);

  // Entry to Receiver Conversation collection
  chatDoc = getUserConversationNode(receiverID, chatUID);
  data = {
    topicName: topicName,
    receiverID: userID,
    senderID: receiverID,
    lastMessageID: '',
  };
  chatDoc.set(data);
}

export const addNewTopicNode = (topicName, chatUID) => {
  var chatUIDDoc = getConversationNode(chatUID);
  chatUIDDoc.set({topicName: topicName});
}

export const isTopicExist = (chatUID, callBack) => {
  var conversationNode = getConversationNode(chatUID);
  conversationNode.get().then(querySnapshot => {
    callBack(querySnapshot.exists);
  });
}

export const getUserConversationNode = (userID, chatUID) => {
  var users = firebaseApp
    .firestore()
    .collection(Strings.FS_COLLECTION_USER_CONVERSATION);
  var userDoc = users.doc(userID);
  userDoc.set({set: true});
  var conversation = userDoc.collection(Strings.FS_COLLECTION_CONVERSATION);
  return conversation.doc(chatUID);
}

export const getConversationNode = (chatUID) => {
  var users = firebaseApp
    .firestore()
    .collection(Strings.FS_COLLECTION_CONVERSATION);
  return users.doc(chatUID);
}

