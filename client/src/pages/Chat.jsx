import React, { useEffect, useRef, useState } from "react";
import Headers from '../components/Header';
import ListChat from "../components/ListChat";
import TextareaAutosize from 'react-textarea-autosize';
import socket from "../socket/socket-client";
import Message from "../components/Message";
import { useNavigate } from 'react-router-dom';

// PAGES
import ComingSoonPage from './ComingSoonPage'

// Import CSS styles
import chatStyle from '../styles/chat.css';
import homepageStyle from '../styles/homepage.css';
import generalStyle from '../styles/general.css';

export default function Chat() {
    const [server, setServer] = useState("");
    const [message, setMessage] = useState("");
    const [listChat, setListChat] = useState([])
    const [selectedFriend, setSelectedFriend] = useState(null);
    const userRef = useRef(JSON.parse(sessionStorage.getItem("userAuth")).user);
    const lastMessageRef = useRef(null);
    const [isAccess, setIsAccess] = useState(true)

    useEffect(() => {
        setServer(`${process.env.REACT_APP_SEVER_IP}:${process.env.REACT_APP_SERVER_PORT}`);

        if (!userRef.current.hasOwnProperty("friends")) {
            setIsAccess(false)
        }

    }, []);

    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [listChat]);

    useEffect(() => {
        if (selectedFriend) {
            socket.emit("updateMessage", [userRef.current._id, selectedFriend.friend._id]);
           
            socket.on("updateMessage", function (messages) {
                setListChat(messages);
                sessionStorage.setItem('message', JSON.stringify(messages))
            });
        }
    }, [selectedFriend]);
    

    function addMessage() {
        if (selectedFriend) {
            const data = {
                "message": {
                    "text": message
                },
                "users": [
                    userRef.current._id,
                    selectedFriend.friend._id
                ],
                "sender": userRef.current._id,
                "createdAt": new Date()
            }

            socket.emit("addMessage", data)

            setMessage("")
        }
    }

    if (!isAccess) {
        return <ComingSoonPage title="You don't have any friends" />
    }

    return (
        <div id="app">
            <Headers customStyle='header-chat' title="Message" />

            <div id="wrap-message" className="row">
                <ListChat setSelectedFriend={setSelectedFriend} />

                {/* Chat Box */}
                <div className="parent flex-1 mt-8">
                    <div id="boxChat" className="row justify-space-between">

                        {/* Avatar and Name */}
                        <div className="row align-items-center">
                            <img
                                className="avatar"
                                src={(selectedFriend) ? `${server}/uploads/${selectedFriend.friend.avatar}` : ""}
                                alt="avatar"
                            />

                            <div className="ml-15">
                                <h3>{(selectedFriend) ? selectedFriend.friend.firstName + " " + selectedFriend.friend.lastName : ""}</h3>
                                <p>Online</p>
                            </div>
                        </div>

                        {/* List Icons */}
                        <div className="row">
                            <a className="icon-effect" href="#">
                                <span className="material-symbols-outlined">
                                    call
                                </span>
                            </a>
                            <a className="icon-effect" href="#">
                                <span className="material-symbols-outlined">
                                    smart_display
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Chat Messages View */}
                    <div id="viewchat">
                        {
                            listChat.map((chat, index) => (
                                <Message
                                    key={index}
                                    owner={(userRef.current._id === chat.sender._id) ? "my" : "other"}
                                    chat={chat}
                                    selectedFriend={setSelectedFriend}
                                    currentUser={userRef.current}
                                />
                            ))
                        }
                        <div ref={lastMessageRef}></div>
                    </div>

                    {/* Message Input Box */}
                    <div id="boxMessage" className="row">
                        <TextareaAutosize
                            className="post-comment"
                            placeholder="Enter a message"
                            onChange={e => setMessage(e.target.value)}
                            value={message}
                        />
                        <img onClick={addMessage} id="btn" width="36" height="36" src="https://img.icons8.com/sf-regular/48/paper-plane.png" alt="paper-plane" />
                    </div>
                </div>
            </div>
        </div>
    )
}
