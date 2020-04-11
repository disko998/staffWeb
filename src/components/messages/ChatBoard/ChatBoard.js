import moment from 'moment'
import React, {Component} from 'react'
// import ReactLoading from 'react-loading'
import images from '../../Themes/Images'
import './ChatBoard.css'
import { 
    getUserConversationNode, 
    getChatUID,
    getConversationMessagesNode
  } from '../../../store/messageApi/messagesApi'

export default class ChatBoard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            isShowSticker: false,
            message: '',
            currentTopic: props.topicName,
            messages: [],
            receiverID: props.currentPeerUser.id,
            userID: props.currentUserId
        }
        this.currentUserId = props.currentUserId
        // this.currentUserAvatar = localStorage.getItem(AppString.PHOTO_URL)
        this.currentUserNickname = props.initials
        this.currentPeerUser = props.currentPeerUser
        this.removeListener = null
        this.currentPhotoFile = null
        console.log(this.currentPeerUser)
    }

    componentWillReceiveProps(newProps) {
        if ((newProps.currentPeerUser && newProps.currentPeerUser.id !== this.props.currentPeerUser.id) 
            || newProps.currentPeerUser && newProps.topicName !== this.props.topicName) {
            this.currentPeerUser = newProps.currentPeerUser
            this.setState({
                messages: [],
                receiverID: newProps.currentPeerUser.id,
                currentTopic: newProps.topicName
            }, this.listenForNewMessage)
            
        }
    }

    listenForNewMessage = () => {
        var chatUID = getChatUID(this.state.receiverID, this.state.userID, this.state.currentTopic);
        this.setState({ chatUID: chatUID });
        console.log("listenForNewMessage chatUID : " + chatUID);
        var screen = this;
        // Listen for messages
        this.userConversationNode = getUserConversationNode(this.state.userID, chatUID);
        this.receiverConversationNode = getUserConversationNode(this.state.receiverID, chatUID);
        this.messagesCollection = getConversationMessagesNode(chatUID);
        this.messageListener = this.messagesCollection.orderBy("time", "asc").onSnapshot(function (querySnapshot) {
        var messages = [];
        querySnapshot.docs.map((doc) => {
            console.log("listenForNewMessage message : " + JSON.stringify(doc.data()));
            messages.push(doc.data());
        });
        screen.setState({ messages: messages });
        console.log('messages are', messages)
        });
    }


    sendMessage() {
        if (this.state.message.length > 0) {
        var message = this.messagesCollection.doc();
        var data = {
            message: this.state.message,
            sender: this.state.userID,
            receiver: this.state.receiverID,
            time: new Date().toString(),
        }
        message.set(data);
        // Update last message id - sender
        this.userConversationNode.update({ lastMessageID: message.id });
        // Update last message id - receiver
        this.receiverConversationNode.update({ lastMessageID: message.id });
        this.setState({ message: "" });
        }
    }

    componentDidUpdate() {
        this.scrollToBottom()
    }

    componentDidMount() {
        this.listenForNewMessage();
    }

    componentWillUnmount() {
        if (this.removeListener) {
            this.removeListener()
        }
    }

    // onChoosePhoto = event => {
    //     if (event.target.files && event.target.files[0]) {
    //         this.setState({isLoading: true})
    //         this.currentPhotoFile = event.target.files[0]
    //         // Check this file is an image?
    //         const prefixFiletype = event.target.files[0].type.toString()
    //         if (prefixFiletype.indexOf(AppString.PREFIX_IMAGE) === 0) {
    //             this.uploadPhoto()
    //         } else {
    //             this.setState({isLoading: false})
    //             this.props.showToast(0, 'This file is not an image')
    //         }
    //     } else {
    //         this.setState({isLoading: false})
    //     }
    // }

    // uploadPhoto = () => {
    //     if (this.currentPhotoFile) {
    //         const timestamp = moment()
    //             .valueOf()
    //             .toString()

    //         const uploadTask = myStorage
    //             .ref()
    //             .child(timestamp)
    //             .put(this.currentPhotoFile)

    //         uploadTask.on(
    //             AppString.UPLOAD_CHANGED,
    //             null,
    //             err => {
    //                 this.setState({isLoading: false})
    //                 this.props.showToast(0, err.message)
    //             },
    //             () => {
    //                 uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
    //                     this.setState({isLoading: false})
    //                     this.onSendMessage(downloadURL, 1)
    //                 })
    //             }
    //         )
    //     } else {
    //         this.setState({isLoading: false})
    //         this.props.showToast(0, 'File is null')
    //     }
    // }

    onKeyboardPress = event => {
        if (event.key === 'Enter') {
            this.sendMessage()
        }
    }

    scrollToBottom = () => {
        if (this.messagesEnd) {
            this.messagesEnd.scrollIntoView({})
        }
    }

    render() {
        return (
            <div className="viewChatBoard">
                {/* Header */}
                <div className="headerChatBoard">
                    <img
                        className="viewAvatarItem"
                        src={!!this.currentPeerUser.bio ? this.currentPeerUser.bio.profilePicURL : images.ic_default_avatar}
                        alt="icon avatar"
                    />
                    <span className="textHeaderChatBoard">
            {this.currentPeerUser.nickname}
          </span>
                </div>

                {/* List message */}
                <div className="viewListContentChat">
                    {this.renderListMessage()}
                    <div
                        style={{float: 'left', clear: 'both'}}
                        ref={el => {
                            this.messagesEnd = el
                        }}
                    />
                </div>

                {/* View bottom */}
                <div className="viewBottom">
                    <img
                        className="icOpenGallery"
                        src={images.ic_photo}
                        alt="icon open gallery"
                        onClick={() => this.refInput.click()}
                    />
                    <input
                        ref={el => {
                            this.refInput = el
                        }}
                        accept="image/*"
                        className="viewInputGallery"
                        type="file"
                        onChange={this.onChoosePhoto}
                    />


                    <input
                        className="viewInput"
                        placeholder="Type your message..."
                        value={this.state.message}
                        onChange={event => {
                            this.setState({message: event.target.value})
                        }}
                        onKeyPress={this.onKeyboardPress}
                    />
                    <img
                        className="icSend"
                        src={images.ic_send}
                        alt="icon send"
                        onClick={() => this.sendMessage()}
                    />
                </div>

                {/* Loading */}
                {/* {this.state.isLoading ? (
                    <div className="viewLoading">
                        <ReactLoading
                            type={'spin'}
                            color={'#203152'}
                            height={'3%'}
                            width={'3%'}
                        />
                    </div>
                ) : null} */}
            </div>
        )
    }

    renderListMessage = () => {
        if (this.state.messages.length > 0) {
            let viewListMessage = []
            this.state.messages.forEach((item, index) => {
                if (item.sender === this.currentUserId) {
                    // Item right (my message)
                    viewListMessage.push(
                        <div className="viewItemRight" key={item.time}>
                            <span className="textContentItem">{item.message}</span>
                        </div>
                    )
                } else {
                    // Item left (peer message)
                    viewListMessage.push(
                        <div className="viewWrapItemLeft" key={item.time}>
                            <div className="viewWrapItemLeft3">
                                {this.isLastMessageLeft(index) ? (
                                    <img
                                        src={!!this.currentPeerUser.bio ? this.currentPeerUser.bio.profilePicURL : images.ic_default_avatar}
                                        alt="avatar"
                                        className="peerAvatarLeft"
                                    />
                                ) : (
                                    <div className="viewPaddingLeft"/>
                                )}
                                <div className="viewItemLeft">
                                    <span className="textContentItem">{item.message}</span>
                                </div>
                            </div>
                            {this.isLastMessageLeft(index) ? (
                                <span className="textTimeLeft">
                {moment(item.time).format('DD-MMM-YYYY hh:mm a')}
              </span>
                            ) : null}
                        </div>
                    )
                }
            })
            return viewListMessage
        } else {
            return (
                <div className="viewWrapSayHi">
                    <span className="textSayHi">Say hi to new friend</span>
                    <img
                        className="imgWaveHand"
                        src={images.ic_wave_hand}
                        alt="wave hand"
                    />
                </div>
            )
        }
    }


    hashString = str => {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
            hash = hash & hash // Convert to 32bit integer
        }
        return hash
    }

    isLastMessageLeft(index) {
        if (
            (index + 1 < this.state.messages.length &&
                this.state.messages[index + 1].sender === this.currentUserId) ||
            index === this.state.messages.length - 1
        ) {
            return true
        } else {
            return false
        }
    }

    isLastMessageRight(index) {
        if (
            (index + 1 < this.state.messages.length &&
                this.state.messages[index + 1].sender !== this.currentUserId) ||
            index === this.state.messages.length - 1
        ) {
            return true
        } else {
            return false
        }
    }
}