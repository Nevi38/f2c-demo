import { useEffect, useState } from "react"

const server = process.env.REACT_APP_SEVER_IP + ":" + process.env.REACT_APP_SERVER_PORT

export default function Message({ owner, chat, selectedFriend, currentUser }) {
    const [fullName, setFullName] = useState("")
    const [avatar, setAvatar] = useState("")

    useEffect(() => {
        // Use a conditional to avoid unnecessary state updates when the component mounts.
        if (chat.sender._id === currentUser._id) {
            const fullName = currentUser.firstName + " " + currentUser.lastName
            const avatar = currentUser.avatar
            setFullName(fullName)
            setAvatar(server + "/uploads/" + avatar)
        } else {
            const fullName = chat.sender.firstName + " " + chat.sender.lastName
            const avatar = chat.sender.avatar
            setFullName(fullName)
            setAvatar(server + "/uploads/" + avatar)
        }
    }, [chat, currentUser]) // Add chat and currentUser as dependencies

    const renderComponent = () => {
        if (owner === "my") {
            return (
                <div className="comment comment-right">
                    <div className="box">
                        <b className="sender">{fullName}</b>
                        <p className="text">{chat.message.text}</p>
                    </div>
                    <img
                        className="avatar"
                        src={avatar}
                        alt="avatar"
                    />
                </div>
            )
        } else if (owner === "other") {
            return (
                <div className="comment comment-left">
                    <img
                        className="avatar"
                        src={avatar}
                        alt="avatar"
                    />
                    <div className="box">
                        <b className="sender">{fullName}</b>
                        <p className="text">{chat.message.text}</p>
                    </div>
                </div>
            )
        }
    }

    return renderComponent(); // No need for extra parentheses
}
