import { useContext } from "react"
import { ChatContext } from "../../context/ChatContext"
import { AuthContext } from "../../context/AuthContext";
const PotentialChats = () => {
  const { createChat, potentialChats, onlineUsers } = useContext(ChatContext);
  const { user } = useContext(AuthContext) as any;
  return (
    <div className="all-users">
      {potentialChats && potentialChats.map((u: any, index: number) =>
        <div className="single-user" key={index} onClick={() => createChat(user?._id, u._id)}>
          {u?.name}
          <span className={onlineUsers.some((user: any) => user?.userId === u?._id) ? `user-online` : ""}></span>
        </div>
      )}
    </div>
  )
}

export default PotentialChats