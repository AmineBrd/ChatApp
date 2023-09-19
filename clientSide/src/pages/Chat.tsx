import { useContext } from "react"
import { ChatContext  } from "../context/ChatContext"
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/Chats/UserChat";
import { AuthContext, AuthUser } from "../context/AuthContext";
import PotentialChats from "../components/Chats/PotentialChats";
import ChatBox from "../components/Chats/ChatBox";
const Chat = () => {
  const { user } = useContext(AuthContext) as AuthUser;
  const { userChats ,isUserChatLoading ,updateCurrentChat } = useContext(ChatContext);
  return (
    <Container>
      <PotentialChats />
      {
        userChats?.length < 1? null :
        <Stack direction="horizontal" gap={4} className="align-items-start">
            <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
              {isUserChatLoading && <p>Loading chats...</p>}
              {userChats?.map((chats:any,index:number)=>{
                return(
                  <div key={index} onClick={()=> updateCurrentChat(chats)}>
                    <UserChat chat={chats} user={user} />
                  </div>
                )
              })}
            </Stack>
            <ChatBox />
          </Stack>
        }
    </Container>
  )
}

export default Chat