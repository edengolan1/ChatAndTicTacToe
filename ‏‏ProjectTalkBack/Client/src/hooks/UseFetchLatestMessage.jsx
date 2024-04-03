import { useContext,useEffect,useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { baseUrl, getRequest } from "../utils/Services";

export const UseFetchLatestMessage = (chat) => {
    const { newMessage, notificaions} = useContext(ChatContext);
    const [latestMessage,setLatestMessage] = useState(null);

    useEffect(()=> {
        const getMessages = async () => {
            const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);

            if(response.error){
                return console.log("Error getting messages...");
            }

            const lastMessage = response[response?.length -1];
            setLatestMessage(lastMessage);
        };
        getMessages();
    },[newMessage,notificaions]);
    return { latestMessage };
};