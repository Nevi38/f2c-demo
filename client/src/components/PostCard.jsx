import { useEffect, useRef, useState } from 'react'
import '../styles/postcard.css'

export default function PostCard({
    image,
    title,
    date,
    totalEmoji,
    totalComment,
    isLove
}) {

    const serverRef = useRef(process.env.REACT_APP_SEVER_IP + ":" + process.env.REACT_APP_SERVER_PORT)
    const limitTitleRef = useRef(24)
    const [content, setContent] = useState(title)

    useEffect(() => {
        filterTitle()
    }, [])

    function filterTitle() {
        if (title.length >= limitTitleRef.current) {
            let newContent = title.slice(0, limitTitleRef.current) + "..."

            setContent(newContent)
        }
    }

    return (
        <div className="postcard">
            <div className="image" style={{
                backgroundImage: `url(${serverRef.current}/uploads/${image})`
            }}>
                
            </div>

            <div className="content">
                <h3 className='title'>{content}</h3>
                <p className='date'>12 Step, 2023</p>
            </div>
            
            <div className='flex justify-space-between mt-15'>
                <div className="flex">
                    <div className='flex align-items-center'>
                        <span className={`material-symbols-outlined ${isLove ? "shape-effect__love" : ""}`}>favorite</span>
                        <span className='flex align-items-center ml-5'>{totalEmoji}</span>
                    </div>
                    <div className='flex align-items-center ml-15'>
                        <i className="fa-regular fa-comment"></i>
                        <span className='ml-5'>{totalComment}</span>
                    </div>
                </div>

                <div className="flex">
                    <span className="material-symbols-outlined">download</span>
                </div>
            </div>
        </div>
    )
}