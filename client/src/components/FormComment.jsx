import { useEffect, useRef, useState } from "react";
import { addComment } from "../adapters/comment";
import TextareaAutosize from 'react-textarea-autosize';
import socket from '../socket/socket-client'

const server = process.env.REACT_APP_SEVER_IP + ":" + process.env.REACT_APP_SERVER_PORT
// parameter updateComment is hook const [, set]
export default function FormComment({ sender, postID }) {
    const [message, setMessage] = useState("")
   
    useEffect(() => {
       
    }, [])

    const handleMessageChange = event => {
        // 👇️ access textarea value
        setMessage(event.target.value);
    };

    function postComment() {
        const comment = {
            'postID': postID,
            'content': message,
            'sender': sender._id
        }

        // Check valid of comment
        if (isValidComment())
        {
            // Reset comment
            setMessage("")
            addComment(comment)
        }
    }

    function isValidComment()
    {
        if (message.length == 0)
            return false;
        return true;
    }

    return (
        <div className="form-comment row">
            <img
                className="avatar"
                src={
                    (!!sender.avatar) 
                    ? `${server}/uploads/${sender.avatar}`
                    : `${server}/uploads/anonymous.png`
                }
                alt="avatar"
            />
            <div>
                <TextareaAutosize 
                    value={message}
                    className="post-comment ml-13"
                    placeholder="Bạn đang nghĩ gì ?"
                    onChange={handleMessageChange} />
                <div className="icon-comment">
                    <ul className="list-icon row align-item-center">
                        <li>
                            <img
                                id="js-upload-picture"
                                className="icon-heading"
                                src="https://img.icons8.com/pulsar-color/48/pictures-folder.png"
                                alt="pictures-folder"
                            />
                        </li>
                        <li>
                            <img
                                className="icon-heading"
                                src="https://img.icons8.com/pulsar-color/48/pictures-folder.png"
                                alt="pictures-folder"
                            />
                        </li>
                    </ul>
                    <p id="js-btn-post" className="btn btn-blue" onClick={postComment}>
                        Đăng bình luận
                    </p>
                </div>
            </div>
        </div>
    )
}