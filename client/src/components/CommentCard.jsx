import { useEffect } from "react"

const PORT = process.env.REACT_APP_SERVER_PORT;
const PATH = process.env.REACT_APP_API_POST;

const serverAddress = `${process.env.REACT_APP_SEVER_IP}:${PORT}`;

export default function CommentCard({comment}) {
    return (
        <div className="comment">
            <img
                className="avatar"
                src={`${serverAddress}/uploads/${comment.sender.avatar}`}
                alt="avatar"
            />
            <div className="box">
                <b className="sender">{comment.sender.firstName + " " + comment.sender.lastName}</b>
                <p className="text">{comment.content}</p>
            </div>
        </div>
    )
}