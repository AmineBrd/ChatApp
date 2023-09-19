import { useEffect ,useState } from "react"
import { baseUrl, getRequest } from "../utils/Services";

export const useFetchRecipientUser = (chat:any ,user:any)=>{
    const [recipentUser ,setRecipentUser] = useState<any>(null);
    const [error ,setError] = useState(null);

    const recipientId = chat?.members.find((id:string)=> id != user?._id);
    useEffect(()=>{
        const getUser = async ()=>{
            if(!recipientId) return null;
            const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);
            
            if(response.error){
                return setError(error);
            }
            setRecipentUser(response);
        }
        getUser();
    },[recipientId])
    return { recipentUser };
}