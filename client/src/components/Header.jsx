import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'

export default function Header({title, isSearchBar, customStyle}) {
    const [user, setUser] = useState("")
    const [folderImage, setFolderImage] = useState("")

    useEffect(() => {
        const info = JSON.parse(sessionStorage.getItem("userAuth"))

        setUser(info.user)
        
        setFolderImage(`${process.env.REACT_APP_SEVER_IP}:${process.env.REACT_APP_SERVER_PORT}/uploads/`)
    }, [])

    return (
        <div id="header" className={customStyle}>
            <div className='w-content flex align-items-center justify-space-between'>
                <h3>{title}</h3>
                
                { (isSearchBar) ? <SearchBar placeholder="Search" /> : "" }
            </div>
                    
            <div id="menu" className='w-left-sidebar'>
                <a className="icon-effect" href="#">
                    <i className="fa-regular fa-envelope" />
                </a>
                <a className="icon-effect" href="#">
                    <i className="fa-solid fa-gears" />
                </a>
                <a className="icon-effect" href="#">
                    <i className="fa-regular fa-heart" />
                </a>
                <div className="row center">
                    <span className="ml-10 mr-10">{ user.lastName }</span>
                    <img
                        className="avatar"
                        src= {
                            folderImage + user.avatar
                        }
                        alt="avatar"
                    />
                </div>
            </div>
        </div>
    )
}