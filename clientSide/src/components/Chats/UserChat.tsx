import { useContext } from "react"
import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipent"
import avatar from "../../assets/avatar.svg"
import { ChatContext } from "../../context/ChatContext";
const UserChat = ({chat ,user}:any) => {
    const { recipentUser } = useFetchRecipientUser(chat,user);
    const { onlineUsers } = useContext(ChatContext);
    const isOnline = onlineUsers?.some((user:any)=>user?.userId === recipentUser?._id);
    return (
    <Stack direction="horizontal" gap={3} className="user-card align-items-center p-2 justify-content-between" role="button">
        <div className="d-flex">
            <div className="me-2">
                <img src={avatar} alt="" height="30px" />
            </div>
            <div className="text-content">
                <div className="name">{recipentUser?.name}</div>
                <div className="text">Text Messages</div>
            </div>
        </div>
        <div className="d-flex flex-column align-items-end">
            <div className="date">
                12/12/2022
            </div>
            <div className="this-user-notifications">2</div>
            <span className={isOnline ? "user-online" : ""}></span>
        </div>
    </Stack>
  )
}

export default UserChat