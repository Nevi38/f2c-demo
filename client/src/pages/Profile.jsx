import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import "../styles/general.css"
import "../styles/profile.css"
import List from "../components/List";
import PostCard from "../components/PostCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { getPostsByID } from "../adapters/post";

export default function Profile() {
    const user = useRef("")
    const [folderImage, setFolderImage] = useState("")
    const [activeTab, setActiveTab] = useState('Posts');
    const [items, setItems] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const currentItem = useRef(1)
    const moreItem = useRef(4)

    useEffect(() => {

        const info = JSON.parse(sessionStorage.getItem("userAuth"))

        user.current = info.user

        setFolderImage(`${process.env.REACT_APP_SEVER_IP}:${process.env.REACT_APP_SERVER_PORT}/uploads/`)
    }, [])

    // Mỗi khi activeTab thay đổi
    useEffect(() => {
        switch (activeTab) {
            case 'Posts':
                currentItem.current = 1
                moreItem.current = 2
                fetchMoreData()
                break
            case 'Musics':

                break
            default:
                setItems([])
        }

    }, [activeTab])

    const handleNavigation = (selectedTab) => {
        setActiveTab(selectedTab);
    };

    async function fetchMoreData() {
        let posts

        switch (activeTab) {
            case 'Posts':
                posts = await getPostsByID(currentItem.current, currentItem.current + moreItem.current, user.current._id)
                break;
        
            default:
                break;
        }
        console.log(1, posts)
        if (posts) {
            setHasMore(true)
        
            setItems(items.concat(posts))

            currentItem.current += moreItem.current
        }
        else {
            setHasMore(false)
        }
    }
 
    
    return (
        <div className="flex h-100">
            <NavigationBar />

            <div className="flex-1">
                <Header isSearchBar={true} title="Profile" />

                <div id="wrap-profile" className="flex h-100">
                    <div id="profile">
                        <InfiniteScroll
                            dataLength={items.length}

                            next={fetchMoreData}

                            hasMore={hasMore}

                            scrollableTarget="profile"
                        >
                            <div id="user-profile">
                                <div id="cover-photo">
                                    <div id="change-cover-photo-icon" className="icon">
                                        <span className="material-symbols-outlined">photo_camera</span>
                                    </div>
                                    <div id="edit-profile-icon" className="icon">
                                        <span className="material-symbols-outlined">edit</span>
                                    </div>
                                </div>
                                <div id="profile-picture" style={{
                                    backgroundImage: `url("${folderImage + user.current.avatar}")`
                                }
                                }>
                                    <div id="change-avatar-icon" className="icon">
                                        <span className="material-symbols-outlined">filter_center_focus</span>
                                    </div>
                                </div>
                                <div id="user-info">
                                    <h1>{user.current.firstName + " " + user.current.lastName}</h1>
                                    <div id="user-info-job">Developer</div>
                                    <div id="user-info-intro">Hello world , I'm a programer</div>
                                    <div id="user-info-statistical">
                                        <div id="user-info-statistical-posting">
                                            <h1>11</h1>
                                            <span>Posting</span>
                                        </div>
                                        <div id="user-info-statistical-follower">
                                            <h1>11K</h1>
                                            <span>Follower</span>
                                        </div>
                                        <div id="user-info-statistical-following">
                                            <h1>100</h1>
                                            <span>Following</span>
                                        </div>
                                    </div>
                                    <div id="user-info-btn">
                                        <span id="user-info-btn-editProfile">Edit Profile</span>
                                        <span id="user-info-btn-shareProfile">Share Profile</span>
                                    </div>

                                    {/* NAVIGATION */}
                                    <div id="navigation" className="flex">
                                        <p className={activeTab === 'Posts' ? 'text-actived' : ''} onClick={() => handleNavigation('Posts')}>Posts</p>
                                        <p className={activeTab === 'Music' ? 'text-actived' : ''} onClick={() => handleNavigation('Music')}>Music</p>
                                        <p className={activeTab === 'Stories' ? 'text-actived' : ''} onClick={() => handleNavigation('Stories')}>Stories</p>
                                        <p className={activeTab === 'Tagged' ? 'text-actived' : ''} onClick={() => handleNavigation('Tagged')}>Tagged</p>
                                    </div>

                                    <div id="content">
                                        {
                                            items.map((value, index) => (

                                                <PostCard
                                                    key={index}

                                                    image={value.content.image}
                                                    
                                                    title={value.content.text}

                                                    totalEmoji={value.loves}

                                                    totalComment={value.totalComment}

                                                    isLove={value.isLove}
                                                />
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </InfiniteScroll>
                    </div>

                    <div className="mt-header"><List title="Music favourite" keyword="Find album of mine" /></div>

                </div>
            </div>

        </div>
    );
}