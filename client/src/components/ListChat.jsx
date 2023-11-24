import FriendCard from './FriendCard';
import SearchBar from './SearchBar';
import { useEffect, useState, useRef } from 'react';
import socket from '../socket/socket-client';
import chatStyle from '../styles/chat.css';

export default function ListChat({ setSelectedFriend }) {
  const [listChat, setListChat] = useState([]);
  const user = useRef(JSON.parse(sessionStorage.getItem("userAuth")).user._id);

  useEffect(() => {

    socket.emit("getContacts", user.current);

    socket.on("getContacts", getContacts);
    
    return () => {
      socket.off("getContacts", getContacts);
    };

  }, []); 
  
  function getContacts(contacts) {
    setListChat(contacts);
    setSelectedFriend(contacts[0]);
  }

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
  };

  return (
    <div id="right-side-bar">
      <SearchBar placeholder="Search anything" />
      
      <div id='list-listChat' className='wrap-list-item'>
        <div className="mt-25">
          <b className="heading ml-13">Hộp thư đến</b>
          <ul className="list-item">
            {
              listChat.map((contact, index) => (
                <li key={index} onClick={() => handleFriendClick(contact)} className="row justify-content-space-between">
                  <FriendCard
                    name={`${contact.friend.firstName} ${contact.friend.lastName}`}
                    unreadMessage={2}
                    avatar={contact.friend.avatar}
                    content={contact.latest_message.message.text}
                  />
                </li>
              ))
            }
          </ul>
        </div>
      </div>

    </div>
  );
}
