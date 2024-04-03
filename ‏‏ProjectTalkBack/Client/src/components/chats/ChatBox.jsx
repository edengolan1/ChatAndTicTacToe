import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import '../../styles/ChatBox.css';
import moment from "moment";
import { Link } from 'react-router-dom';

function ChatBox() {
    const {user} = useContext(AuthContext);
    const {currentChat, messages, isMessagesLoading,sendTextMessage} = useContext(ChatContext);
    const {recipientUser} = useFetchRecipientUser(currentChat,user);
    const [textMessage,setTextMessage] = useState("");
    const scroll = useRef();

    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior: "smooth"});
    },[messages]);
    
    const handleTextChange = (e) => {
        setTextMessage(e.target.value);
    };

    if(!recipientUser){
      return (<>
        <div className="no-conversation">
            <div>no conversation selected yet...</div>
        </div>
      </>)
    }

    if(isMessagesLoading){
        return <p>Loading Chat...</p>
    }
    return (
        <div className="chat-box">
            <div className="title-chatbox">
                <div>
                    <p><span className="chat-with">Chat with :</span> {recipientUser?.username}</p>
                </div>
                <div className="div-link-game">
                    <Link to="/game" className="link-to-game">Game</Link>
                </div>
            </div>
            <div className="scrollMessage">
                {messages && messages.map((message,index)=>
                    <div key={index} className={`${message?.senderId === user?._id ? "my-message" : "his-message"}`} ref = {scroll}>
                        <div className="message-box">
                            <span className="text-message-box">{message.text}</span><br/>
                            <span className="date-messagebox">{moment(message?.createdAt).calendar()}</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="input-user">
                <div>
                    <input
                        type="text"
                        value={textMessage}
                        onChange={handleTextChange}
                        placeholder="Type your message..." className="inputText"
                    />                
                </div>
                <div>
                    <div className="send-message" onClick={()=> sendTextMessage(textMessage,user,currentChat._id,setTextMessage)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatBox;