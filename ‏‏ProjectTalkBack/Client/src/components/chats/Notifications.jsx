import { useContext, useState,useEffect,useRef } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { unreadNotificationsFunc } from "../../utils/UnreadNotofications.js";
import moment from 'moment';
import '../../styles/Notifications.css';
import Swal from "sweetalert2";
import messageSound from '../../assets/messageSound.mp3';

function Notifications() {
    const [isOpen,setIsOpen] = useState(false);
    const {user} = useContext(AuthContext);
    const [lastMessageTime, setLastMessageTime] = useState(null);
    const {notifications,userChats,allUsers,markAllNotificationsAsRead,markNotificationAsRead} = useContext(ChatContext);
    const audioRef = useRef(null);


    const unreadNotifications = unreadNotificationsFunc(notifications);
    const modifiedNotifications = notifications.map((n)=> {
    const sender = allUsers.find(user => user._id === n.senderId) 
       return {
         ...n,
         senderName: sender?.username
       }
    })

    useEffect(() => {
        audioRef.current = new Audio(messageSound);
      }, []);
    useEffect(() => {
        if (modifiedNotifications.length > 0) {
            const latestMessageTime = modifiedNotifications[0].date;
            if (lastMessageTime !== latestMessageTime) {
                setLastMessageTime(latestMessageTime); 
                getNotifications(); 
                playMessageSound(); 
            }
        }
    }, [modifiedNotifications]);

    const playMessageSound = () => {
        if (audioRef.current) {
          audioRef.current.play();
        }
    };
    const getNotifications = async () => {
        let usernameNotifications = null;
        usernameNotifications = modifiedNotifications.map((n, index) => {
            return n.senderName;
        })
        const result = await Swal.fire({
            title: "You have new message!",
            html: `from: ${usernameNotifications.join('<br>')}`,
            showCancelButton: true,
        });
        return result;
    };

    return (
        <div>
            <div onClick={()=> setIsOpen(!isOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="bi bi-chat-left-fill" viewBox="0 0 16 16">
                    <path d="M2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                </svg>
                {unreadNotifications?.length === 0 ? null : (
                    <span className="notification-count">
                        <span>{unreadNotifications?.length}</span>
                    </span>
                )}
            </div>
            {isOpen ? <div className="notifications">
                <span>Notifications:</span>
                <div onClick={()=> markAllNotificationsAsRead(notifications)}>
                    Mark all as read
                </div>
                {modifiedNotifications?.length === 0 ? <span className="notification">No notification yet..</span> : null }
                {modifiedNotifications && modifiedNotifications.map((n,index)=> {
                    return <div key={index} className={n.isRead ? 'notification' : 'notification-not-read'} onClick={()=> {markNotificationAsRead(n,userChats,user,notifications); setIsOpen(false);}}>
                            <span>{`${n.senderName} sent you a message `}</span>
                            <span>{moment(n.date).calendar()}</span>
                        </div>
                })}
            </div> : null
            }
        </div>
    );
}

export default Notifications;