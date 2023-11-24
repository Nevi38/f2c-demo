import FriendCard from './FriendCard'
import SearchBar from './SearchBar'
import { useEffect, useState, useRef } from 'react'
import socket from '../socket/socket-client'
import listFriendsStyle from '../styles/listFriends.css'

export default function ListFriends({ friends }) {
  return (
    <div id="right-side-bar">
      <SearchBar placeholder="Search anything" />

      <div id='list-friends' className='wrap-list-item'>
        <div className="mt-25">
          <b className="heading ml-13">Friends</b>
          <ul className="list-item">
            {friends.map((friend, index) => (
              <li key={index} className="row justify-content-space-between">
                <FriendCard
                  name={friend.firstName + " " + friend.lastName}
                  unreadMessage={friend.unreadMessage}
                  avatar={friend.avatar}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
