import { useEffect,useState } from "react";
import { baseUrl, getRequest } from "../utils/Services";

export const useFetchRecipientUser = (chat,user)=> {
    const [recipientUser,setRecipientUser] = useState(null);
    const [error, setError] = useState(null);
    const recipientId = chat?.members.find(id => id && id !== user?._id);
    
    useEffect(()=> {
        const getUser = async()=>{
            if(!recipientId) return;
            try {
                const response = await getRequest(`${baseUrl}/find/${recipientId}`);
                if (response.error) {
                    setError(response.error);
                } else {
                    setRecipientUser(response);
                }
            } catch (error) {
                setError(error.message);
            }
        }
        getUser();
    },[recipientId]);

    return {recipientUser};
}