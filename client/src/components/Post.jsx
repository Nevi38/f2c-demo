import { useEffect, useState } from 'react'
import CommentList from './CommentList'
import FormComment from './FormComment';
import { deletePost } from '../adapters/post';
import postStyle from '../styles/post.css'
import socket from '../socket/socket-client';

// Parameter:
// comments: array object
const server =
    process.env.REACT_APP_SEVER_IP + ":" +
    process.env.REACT_APP_SERVER_PORT

export default function Post({ _id, sender, content, creationTime, loves, comments
    , post, setPost, isLove
}) {
    const [user, setUser] = useState("")
    const [existImage, setExistImage] = useState(false)
    const [isActiveTooltip, setIsActiveTooltip] = useState(false)
    const [status, setStatus] = useState(isLove)
    const [totalEmoji, setTotalEmoji] = useState(loves)

    useEffect(() => {
        setTotalEmoji(loves)
        setStatus(isLove)
    }, [_id])

    useEffect(() => {
        const user = (JSON.parse(sessionStorage.getItem("userAuth"))).user
        
        setUser(user)

        // Check status image review
        if (content.image != "")
            setExistImage(true)
        else 
            setExistImage(false)

        function onUpdateEmoji(totalEmoji) {
            setTotalEmoji(totalEmoji)
        }

        socket.on("recieveEmoji", onUpdateEmoji)

        return () => {
            socket.off(onUpdateEmoji)
        }
    }, [])

    useEffect(() => {
        // Update database
        socket.emit("updateEmoji", {
            'postID': _id,
            'userID': user._id,
            'totalEmoji': totalEmoji
        })
    }, [totalEmoji])

    function handleEmoji()
    {
        if (status)
        {
            setTotalEmoji(totalEmoji - 1)
            setStatus(false)
        }
        else
        {
            setTotalEmoji(totalEmoji + 1)
            setStatus(true)
        }
    }

    function removeElementAt(arr, index) {
        if (index < 0 || index >= arr.length)
            return arr.slice();
        return arr.filter((_, i) => i !== index);
    }

    async function handleDeletePost() {
        for (let i = 0; i < post.length; i++) {
            if (post[i]._id === _id) {
                setPost(removeElementAt(post, i))
                break;
            }
        }

        await deletePost(_id);
    }

    function activeTooltips() {
        if (isActiveTooltip === false)
            setIsActiveTooltip(true);
        else
            setIsActiveTooltip(false);
    }

    return (
        <div className="post">
            <div className="row justify-between">
                {/* LEFT */}
                <div className="row align-items">
                    <img
                        className="avatar"
                        src={`${server}/uploads/${sender.avatar}`}
                        alt=""
                    />

                    <div className="ml-10">
                        <p className="user">{sender.firstName + " " + sender.lastName}</p>
                        <p className="time">{creationTime}</p>
                    </div>
                </div>
                {/* RIGHT */}
                <ul className="list-icon row">
                    <li>
                        <i className="fa-solid fa-bookmark" />
                    </li>
                    <li className='more' onClick={activeTooltips}>
                        <i className="fa-solid fa-ellipsis-vertical" />

                        {/* MORE OPTIONS */}
                        <ul className={(isActiveTooltip) ? 'tooltips tooltips-active' : 'tooltips'}>
                            <li className={
                                (sender._id !== user._id) ? 'disable' : ''
                            }
                                onClick={handleDeletePost}><span className="material-symbols-outlined">delete</span>Delete This Post</li>

                            <li><span className="material-symbols-outlined">delete</span>Add Bookmark</li>
                        </ul>
                    </li>
                </ul>
            </div>
            <p className="text">
                {content.text}
            </p>
            <div className={`list-image ${existImage ? 'box-active' : 'box-disable'}`}>
                {/* <img className="photo" src={content.image} alt="" /> */}
                <div style={{
                    backgroundImage: `url(${content.image})`
                }}

                    className='boxReview-image'></div>
            </div>
            {/* Emoji */}
            <div className="emoji">
                <div className='no-select' onClick={handleEmoji}>
                    <i className={`fa-regular fa-heart ${ (status) ? 'shape-effect__love' : ''} `} />
                    <span>{ totalEmoji }</span>
                </div>
                <div className='no-select'>
                    <i className="fa-regular fa-comment" />
                    <span>Comment</span>
                </div>
                <div className='no-select'>
                    <i className="fa-solid fa-share" />
                    <span>Share</span>
                </div>
            </div>
            {/* Form Comment */}
            <FormComment sender={user} postID={_id} />

            {/* Group Comment */}
            <CommentList comments={comments} />
        </div>
    )
}