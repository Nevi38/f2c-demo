import React, { useState, useEffect, useRef } from "react";
import Post from "./Post";
import socket from "../socket/socket-client";
import InfiniteScroll from "react-infinite-scroll-component";
import { getLimitPost, getNumberPost } from "../adapters/post";

const server = process.env.REACT_APP_SEVER_IP + ":" + process.env.REACT_APP_SERVER_PORT

export default function PostList() {
    const [maxPost, setMaxPost] = useState(0)
    const [fromPage, setFromPage] = useState(1)
    const [limitPost, setLimitPost] = useState(2)
    const [post, setPost] = useState([]);
    const [hasMore, setHasMore] = useState(false)
    const userRef = useRef();

    useEffect(() => {
        userRef.current = JSON.parse(sessionStorage.getItem("userAuth")).user
        
        fetchData(fromPage - 1, limitPost);

        getMaxPost();

    }, [])

    useEffect(() => {

        function handlePostAdded(newPost) {
            const newList = [newPost, ...post]

            setPost(newList)
        }

        function handleCommentAdded(newComment) {
            setPost((prevPost) => {
                const updatedPost = prevPost.map((postItem) => {
                    if (postItem._id === newComment.postID) {    
                        // Nếu postID trùng khớp với postItem._id, chèn newComment vào đầu mảng comments
                        const updatedComments = [newComment, ...postItem.comments];
                        return {
                            ...postItem,
                            comments: updatedComments,
                        };
                    }
                    return postItem;
                });
                return updatedPost; // React sẽ tự động cập nhật lại trạng thái post với updatedPost
            });
        }

        socket.on("postAdded", handlePostAdded)
        socket.on("commentAdded", handleCommentAdded)

        return () => {
            socket.off("postAdded", handlePostAdded)
            socket.off("commentAdded", handleCommentAdded)
        }

    }, []);

    async function getMaxPost() {
        const MAXPOST = await getNumberPost()

        setMaxPost(MAXPOST.numberPost)

        if (MAXPOST.numberPost > 0)
            setHasMore(true)
    }

    async function fetchData(fromPage, toPage) {
        // Gửi thông báo đến server để lấy bài viết
        const data = await getLimitPost(fromPage, toPage, userRef.current._id)

        setPost(data)
    }

    async function fetchMoreData() {
        if (post.length === maxPost) {
            setHasMore(false)
            return
        }

        const toPost = post.length + limitPost
        console.log(`[From Post: ${post.length} - ToPost${toPost}]`)

        // Lấy thêm dữ liệu
        const data = await getLimitPost(post.length, toPost, userRef.current._id);
        console.log("Data", data)
        const newData = post.concat(data)

        setPost(newData)
    }

    return (
        <InfiniteScroll
            dataLength={post.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            scrollableTarget="content"
        >
            {
                post.map((item, index) => (
                    <Post
                        key={index}

                        _id={item._id}

                        sender={item.sender}

                        content={{
                            text: item.content.text,
                            image: item.content.image !== "" ? `${server}/uploads/${item.content.image}` : "",
                        }}

                        creationTime={item.creationTime}

                        comments={item.comments}

                        post={post}

                        setPost={setPost}

                        loves={ (item.loves) ? item.loves : 0}      // Tổng số lượt tương tác bài viết

                        isLove={item.isLove}                        // Trạng thái tương tác
                    />
                ))
            }
        </InfiniteScroll>
    );
}