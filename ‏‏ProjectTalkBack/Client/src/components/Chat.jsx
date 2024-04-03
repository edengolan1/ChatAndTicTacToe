import '../styles/Chat.css';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from '../context/ChatContext';
import UserChat from './chats/UserChat';
import PotentialChats from './chats/PotentialChats';
import ChatBox from './chats/ChatBox';

function Chat() {
    const {userChats,ChatsSuccess,updataCurrentChat} = useContext(ChatContext);
    const {user} = useContext(AuthContext);
    return (
    <div className='Chats'>
        <div className='sideLeft'>
            <div className='titleChats'>
                <div>
                    <h2>Chats</h2>
                </div>
            </div>
            <div className='potentialChats'>
                <PotentialChats/>
            </div>
            <div className='allChatsUser'>
                {userChats?.length < 1 ? null : (
                <div>
                    {ChatsSuccess && <p> Loading chats...</p>}
                    {userChats?.map((chat,index)=> {
                        return (
                            <div key={index} onClick={()=> updataCurrentChat(chat)} className='divAllUsers'>
                                <UserChat chat={chat} user={user}/>
                            </div>
                        )
                    })}
                </div>
            )}
            </div>
        </div>
        <div className='sideRight'>
            <ChatBox/>
        </div>
    </div>
    );
}

export default Chat;