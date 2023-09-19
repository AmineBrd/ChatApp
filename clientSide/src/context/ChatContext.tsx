import {createContext ,useState ,useEffect, useCallback} from "react";
import { getRequest  ,baseUrl, postRequest } from "../utils/Services";
import { io } from "socket.io-client";


export const ChatContext = createContext<any>(null);

export const ChatContextProvider = ({children ,user}:any)=>{
    const [userChats,setUserChats] = useState<any>(null);
    const [isUserChatLoading,setisUserChatLoading] = useState<boolean>(false);
    const [userChatsError,setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState<any>(null);
    const [messages,setMessages] = useState<any>(null);
    const [isMessagesLoading,setIsMessagesLoading] = useState<boolean>(false);
    const [messageError,setMessageError] = useState(null);
    const [sendTextMessageError,setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState<any>(null);
    const [socket ,setSocket] = useState<any>(null);
    const [onlineUsers,setOnlineUsers] = useState([]);
    // initialiaze socket

    useEffect(()=>{
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);
        return()=>{
            newSocket.disconnect();
        }
    },[user])

    useEffect(()=>{
        if(socket === null) return;
        socket.emit("addNewUser",user?._id);
        socket.on("getOnlineUsers",(onlineUsers:any)=>{
            setOnlineUsers(onlineUsers)
        })
        return () => {
            socket.off("getOnlineUsers");
        }
    },[socket])

    useEffect(()=>{
        if(socket === null) return;
        const recipientId = currentChat?.members.find((id:string)=> id != user?._id);
        socket.emit("sendMessage",{...newMessage, recipientId})
    },[newMessage])
    useEffect(()=>{
        if(socket === null) return;
        socket.on("getMessage",(res:any)=>{
            if(currentChat._id !== res.chatId) return;
            setMessages((prev:any)=>[...prev,res])
        })
        return ()=>{
            socket.off("getMessage")
        }
    },[socket,currentChat])

    useEffect(()=>{
        if(socket === null) return;
        
        socket.on("getMessage",(res:any)=>{
            if(currentChat?._id !== res.chatId) return;
            setMessages((prev:any)=>[...prev ,res])
        })
        return ()=>{
            socket.off("getMessage")
        }
    },[newMessage])

    useEffect(()=>{
        const getUsers = async ()=>{
            const response = await getRequest(`${baseUrl}/users`);
            if(response.error){
                return console.error("Error fetchingn users",response);
            }
            const pChats = response.filter((u: any) => {
                let isChatCreated = false;
            
                // Exclude the user whose _id matches user?._id
                if (user && user._id === u._id) {
                    return false;
                }
            
                if (userChats) {
                    isChatCreated = userChats.some((chat: any) => {
                        return chat?.members[0] === u._id || chat?.members[1] === u._id;
                    });
                }
            
                return !isChatCreated;
            });
            setPotentialChats(pChats);
        }
        getUsers();
    },[userChats])

    const updateCurrentChat = useCallback((chat:any)=>{
        setCurrentChat(chat);
    },[currentChat])

    useEffect(()=>{
        const getUserChats = async ()=>{
            
            if(user?._id){
                setisUserChatLoading(true);
                setUserChatsError(null);
                const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
                setisUserChatLoading(false);

                if(response?.error){
                    return setUserChatsError(response);
                }
                setUserChats(response);
            }
        }
        getUserChats();
    },[user])

    useEffect(()=>{
        const getMessages = async ()=>{
            setIsMessagesLoading(true);
            setMessageError(null);
            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);
            setIsMessagesLoading(false);

            if(response?.error){
                return setMessageError(response);
            }
            setMessages(response);
        
        }
        getMessages();
    },[currentChat]);

    const sendTextMessage = useCallback(async (textMessage:string ,sender:any ,currentChatId:string ,setTextMessage:any)=>{
            if(!textMessage) return console.log("You must type smth");
            
            const response = await postRequest(`${baseUrl}/messages`,JSON.stringify({
                chatId:currentChatId,
                senderId: sender._id,
                text:textMessage
            }));
            if(response?.error){
                return setSendTextMessageError(response);
            }
            setTextMessage("");
            setMessages((prev:any)=>[...prev, response])
            setNewMessage(response)

    },[])

    const createChat = useCallback(async (firstId:string,secondId:string)=>{
        const response = await postRequest(`${baseUrl}/chats`,JSON.stringify({
            firstId, secondId
        }));
        if(response.error){
            return console.error("Error creating chat",response);
        }
        setUserChats((prev:any)=>[...prev, response]);

    },[])
    return(
    <ChatContext.Provider value={{
        userChats,
        userChatsError,
        isUserChatLoading,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messageError,
        currentChat,
        sendTextMessage,
        onlineUsers
    }}>
        {children}
    </ChatContext.Provider>
)}

