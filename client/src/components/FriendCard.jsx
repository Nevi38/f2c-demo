import { useEffect, useRef, useState } from "react"
import generalStyle from '../styles/general.css'

export default function FriendCard({ name, unreadMessage, avatar }) {
    const [server, setServer] = useState("")

    useEffect(() => {
        setServer(process.env.REACT_APP_SEVER_IP + ":" + process.env.REACT_APP_SERVER_PORT)

    }, [])

    return (
        <>
          <div className="row">
                <div className="wrap-avatar">
                    <span className="activity-status activity-status-online" />
                    <img
                        className="avatar-small"
                        src={`${server}/uploads/${avatar}`}
                        alt="avatar"
                    />
                </div>

                <p className="flex align-items-center ml-8">{name}</p> 

            </div>
            <span className="count-unread-message">2</span>
        </>
    )
}