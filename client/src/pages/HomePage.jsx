import React, { useEffect, useRef, useState } from 'react';
import PostList from '../components/PostList';
import HandlePost from '../components/HandlePost';
import NavigationBar from '../components/NavigationBar';
import Header from '../components/Header';
import Stories from '../components/Stories';
import ListFriends from '../components/ListFriends';
import socket from '../socket/socket-client';

export default function HomePage() {
    const [friends, setFriends] = useState([])
    const userRef = useRef();

    useEffect(() => {
        userRef.current = JSON.parse(sessionStorage.getItem("userAuth")).user
       // socket.emit("add-user", userRef.current._id);
    
        socket.emit("getFriends", userRef.current._id)
    
        function onGetFriends(friends) {
          setFriends(friends)
        }
        socket.on("getFriends", onGetFriends)
    
        return () => {
          socket.off('getFriends', onGetFriends);
        };
    }, [])

    return (
        <div id="app">
            <NavigationBar />
            {/* WRAPPER */}
            <div className='flex-1'>
                {/* HEADER */}
                <Header title="Homepage" isSearchBar={true} />
                {/* WRAP CONTENT */}
                <div id='wrap-content-homepage' className="row">
                    <div id="content">
                        {/* STORIES */}
                        <Stories />

                        {/* HANDLE POST */}
                        <HandlePost />
                    
                        {/* NƠI ĐẶT POST DO NGƯỜI DÙNG ĐĂNG */}
                        <PostList />

                        {/* <div className="post">
                            <div className="row justify-between">

                                <div className="row align-items">
                                    <img
                                        className="avatar"
                                        src='https://images.pexels.com/photos/14349717/pexels-photo-14349717.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                        alt=""
                                    />

                                    <div className="ml-10">
                                        <p className="user">F2C</p>
                                        <p className="time">Infinite Time</p>
                                    </div>
                                </div>
                           
                                <ul className="list-icon row">
                                    <li>
                                        <i className="fa-solid fa-bookmark" />
                                    </li>
                                    <li className='more'>
                                        <i className="fa-solid fa-ellipsis-vertical" />

                                        <ul className='tooltips'>
                                            <li><span className="material-symbols-outlined">delete</span>Delete This Post</li>

                                            <li><span className="material-symbols-outlined">delete</span>Add Bookmark</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            <p className="text">
                                Layout 4 image
                            </p>
                            <div className='box-active'>
                                <div className='layout-image-4'></div>
                            </div>
                       
                            <div className="emoji">
                                <div>
                                    <i className="fa-regular fa-heart" />
                                    <span>Heart</span>
                                </div>
                                <div>
                                    <i className="fa-regular fa-comment" />
                                    <span>Comment</span>
                                </div>
                                <div>
                                    <i className="fa-solid fa-share" />
                                    <span>Share</span>
                                </div>
                            </div>
                        </div> */}
       
                    </div>
                    {/* RIGHT SIDEBAR */}
                    <ListFriends friends={friends} />
                </div>
            </div>
        </div>
    );
}