import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import avatar from '../../assets/Avatars/avatar.svg';
import '../../styles/UserChat.css';
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/UnreadNotofications";
import { UseFetchLatestMessage } from "../../hooks/UseFetchLatestMessage";
import moment from "moment";

function UserChat({chat,user}) {
    const {recipientUser} = useFetchRecipientUser(chat, user);
    const {onlineUsers, notifications,markThisUserNotificationAsRead} = useContext(ChatContext);
    const {latestMessage} = UseFetchLatestMessage(chat);
    const unreadNotifications = unreadNotificationsFunc(notifications)
    const thisUesrNotifications = unreadNotifications?.filter(n=> n.senderId == recipientUser?._id);
    const isOnline = onlineUsers?.some((user)=> user?.userId === recipientUser?._id) ? "user-potential-online" : "";

    const truncateText = (text) => {
        let shortText = text.substring(0,14);
        if(text.length> 14){
            shortText = shortText + "..."
        }
        return shortText;
    }
    
    return (
        <div className="option-users" onClick={()=> {
        if(thisUesrNotifications?.length !== 0){
            markThisUserNotificationAsRead(
                thisUesrNotifications,
                notifications,
            )
        }
        }}>
        <div className={isOnline ? "user-online" : ""}></div>
        <div className="buttonUser">
            <div>
                <img width="90px" height="50px" src={avatar}/>
            </div>
            <div className="name-and-messageText">
                <div className="user-username">{recipientUser?.username}</div>
                <div className="user-message-text">{latestMessage?.text && (
                    <span>{truncateText(latestMessage?.text)}</span>
                )}</div>
                <div className="date-message">{moment(latestMessage?.createdAt).calendar()}</div>
            </div>
            <div className="sideRightInUser">
                <div className={thisUesrNotifications?.length > 0 ? "user-notefications" : ""}>{thisUesrNotifications.length > 0 ? thisUesrNotifications?.length : ''}</div>
            </div>
        </div>
    </div>
    );
}

export default UserChat;