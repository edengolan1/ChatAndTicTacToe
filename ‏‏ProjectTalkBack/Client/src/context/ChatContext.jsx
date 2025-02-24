import { createContext, useState ,useEffect, useCallback} from "react";
import { baseUrl ,getRequest, postRequest } from "../utils/Services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({children, user}) => {
    const [userChats, setUserChats] = useState([]);
    const [ChatsSuccess, setChatsSuccess] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const [messageError, setMessageError] = useState(null);
    const [sendTextMessageError,setSendTextMessageError] = useState(null);
    const [newMessage,setNewMessage] = useState(null);
    const [socket,setSocket] = useState(null);
    const [onlineUsers,setOnlineUsers] = useState([]);
    const [notifications,setNotifications] = useState([]);
    const [allUsers,setAllUsers] = useState([]);

    useEffect(()=>{
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);
        return ()=> {
            newSocket.disconnect()
        };
    },[user]);

    useEffect(()=> {
        if(socket === null) return;
        socket.emit("addNewUser",user?._id);
        socket.on("getOnlineUsers",(res)=>{
            setOnlineUsers(res);
        });

        return ()=>{
            socket.off("getOnlineUsers")
        }
    },[socket]);

    useEffect(()=> {
        if(socket === null) return;
        const recipientId = currentChat?.members.find((id) => id !== user?._id && id !== null);
        socket.emit("sendMessage",{...newMessage,recipientId});
    },[newMessage]);

    useEffect(()=> {
        if(socket === null) return;
        socket.on("getMessage",res =>{
            if(currentChat?._id !== res.chatId) return 
            setMessages((prev)=> [...prev,res]);
        });

        socket.on("getNotification", (res)=>{
            const isChatOpen = currentChat?.members.some(id => id === res.senderId);
            if(isChatOpen){
                setNotifications((prev) => [{...res, isRead: true }, ...prev]); 
            }
            else{
                setNotifications((prev) => [res,...prev]);
            }
        })
        return ()=> {
            socket.off("getMessage");
            socket.off("getNotification");
        }
    },[socket,currentChat]);

    useEffect(()=> {
        const getUsers = async() => {
            const response = await getRequest(`${baseUrl}/users`);
            if(response.error){
                return console.log(("Error fetching users", response));
            }
            const pChats = response.filter((u)=> {
                let isChatCreated = false;
                if(user?._id === u._id){
                    return false;
                }
                if(userChats){
                    isChatCreated = userChats.some((chat)=>{
                        return chat.members[0] === u._id || chat.members[1] === u._id
                    });
                }

                return !isChatCreated;
            })
            setPotentialChats(pChats);
            setAllUsers(response);
        }
        getUsers();
    },[userChats]);

    useEffect(()=>{
        const getUserChats = async()=>{
            if(user?._id){
                setChatsSuccess(true);
                setUserChatsError(null);
                const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
                setChatsSuccess(false);
                if(response.error){
                    return setUserChatsError(response);
                }
                setUserChats(response);
            }
        }
        getUserChats();
    },[user, notifications]);

    useEffect(()=>{
        const getMessages = async()=>{
                setIsMessageLoading(true);
                setMessageError(null);
                const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);
                setIsMessageLoading(false);
                if(response.error){
                    return setMessageError(response);
                }
                setMessages(response);
            }
        getMessages();
    },[currentChat]);

    const sendTextMessage = useCallback(async(textMessage,sender,currentChatId,setTextMessage)=>{
        if(!textMessage) return console.log("you must type somerhing...");

        const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage
        }));
        if(response.error){
            return setSendTextMessageError(response);
        }
        setNewMessage(response);
        setMessages((prev)=> [...prev,response]);
        setTextMessage("");
    },[])

    const updataCurrentChat = useCallback((chat)=> {
        setCurrentChat(chat)
    },[]);

    const createChat = useCallback(async(firstId,secondId)=> {
        try {
            const existingChat = userChats.find(chat =>
              chat.members.includes(firstId) && chat.members.includes(secondId)
            );
            if (existingChat) {
              return existingChat;
            }
            const response = await postRequest(`${baseUrl}/chats`, JSON.stringify({
              firstId,
              secondId
            }));
            if (response.error) {
              console.error("Error creating chat", response);
            } else {
              setUserChats(prev => [...prev, response]);
            }
          } catch (error) {
            console.error("Error creating or fetching chat:", error);
          }
    },[userChats]);

    const markAllNotificationsAsRead = useCallback((notifications)=>{
        const mNofications = notifications.map((n) => {
            return {...n, isRead:true};
        });
        setNotifications(mNofications);
    },[]);

    const markNotificationAsRead = useCallback((n,userChats,user,notifications)=> {
        const desiredChat = userChats.find((chat) => {
            const chatMembers = [user._id,n.senderId]
            const isDesiredChat = chat?.members.every((member)=> {
                return chatMembers.includes(member);
            });
            return isDesiredChat;
        });
        const mNotifications = notifications.map(el => {
            if(n.senderId === el.senderId){
                return {...n, isRead: true}
            }
            else{
                return el;
            }
        });
        updataCurrentChat(desiredChat);
        setNotifications(mNotifications);
    },[])

    const markThisUserNotificationAsRead = useCallback((ThisUserNotifications,notifications) => {
        const mNotifications =notifications.map(el => {
            let notification;
            ThisUserNotifications.forEach(n=> {
                if(n.senderId === el.senderId){
                    notification = {...n,isRead: true}
                }
                else{
                    notification = el;
                }
            });
            return notification
        });
        setNotifications(mNotifications);
    },[]);

    return <ChatContext.Provider value={{
        userChats,
        ChatsSuccess,
        userChatsError,
        ChatContextProvider,
        potentialChats,
        createChat,
        updataCurrentChat,
        messages,
        isMessageLoading,
        messageError,
        currentChat,
        sendTextMessage,
        onlineUsers,
        socket,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationAsRead,
    }}>
        {children}
    </ChatContext.Provider>
}