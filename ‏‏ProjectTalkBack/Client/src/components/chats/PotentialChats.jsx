import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import '../../styles/PotentialChats.css';

function PotentialChats() {
    const { user } = useContext(AuthContext);
    const {potentialChats, createChat, onlineUsers} = useContext(ChatContext);
    return (
        <div className="detailsUser">
            {potentialChats && potentialChats.map((u,index)=>{
                return(
                    <div key={index} onClick={()=> createChat(user._id, u._id)} className="user">
                            <div className="user-circle">
                                <p>{u.username}</p>
                                <div className={onlineUsers?.some((user) => user?.userId === u._id) ? "user-potential-online" : ""}></div>
                            </div>
                    </div>
            )
            })}
        </div>
    );
}

export default PotentialChats;