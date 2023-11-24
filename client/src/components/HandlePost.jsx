import { sendPost, getPost } from '../adapters/post'
import TextareaAutosize from 'react-textarea-autosize';
import React, { useEffect, useState } from 'react';
import Resizer from 'react-image-file-resizer';

const server = process.env.REACT_APP_SEVER_IP + ":" + process.env.REACT_APP_SERVER_PORT

export default function HandlePost() {
    const [isValidContent, setIsValidContent] = useState(false)
    const [postContent, setPostContent] = useState("")
    const [imageDataURL, setImage] = useState("")
    const [fileStorage, setFile] = useState(null)
    const [storage, setStorage] = useState("")

    let fileInputRef = React.createRef()

    useEffect(() => {
        hiddenBoxReview()

    }, [])

    useEffect(() => {
        // Get info user from sessionStorage
        var user = JSON.parse(sessionStorage.getItem("userAuth"));
        setStorage(user)

        if (imageDataURL !== "" || postContent !== "") {
            setIsValidContent(true)
        } else {
            setIsValidContent(false)
        }

    }, [postContent, imageDataURL])

    const resizeFile = (file) => {
        return new Promise(resolve => {
            Resizer.imageFileResizer(file, 1920, 1080, 'JPEG', 100, 0,
                uri => {
                    resolve(uri);
                }, 'file');
        })
    };

    function hiddenBoxReview() {
        // Ẩn review picture
        const boxReview = document.querySelector("#js-review")
        boxReview.style.display = "none"
    }

    function handleRemoveImage() {
        setImage("")
        setFile(null)
        hiddenBoxReview()
    }

    function OpenPicture() {
        fileInputRef.current.click()
    }

    async function handleImageChange(event) {
        const file = event.target.files[0]
        const image = await resizeFile(file);

        if (file) {
            // Hiển thị review picture
            const boxReview = document.querySelector("#js-review")
            boxReview.style.display = "block"

            const reader = new FileReader()

            reader.onload = () => {
                // Set image for class preview-image
                boxReview.classList.add('boxReview-image')
                boxReview.style.backgroundImage = `url(${reader.result})`;

                setImage(reader.result)
                // Save file to send server
                setFile(image)
            };
            // Read blob or file convert to base64 image
            reader.readAsDataURL(image)
        }
    };

    function handleMessageChange(e) {
        setPostContent(e.target.value)
    }

    /* UPLOAD POST */
    async function handleUpload() {
        if (isValidContent) {
            const userID = storage.user._id

            const data = {
                "sender": userID,
                "content": {
                    "text": postContent,
                    "image": fileStorage
                },
                "creationTime": new Date(),
                "displayMode": "public"
            }

            // Reset form
            setPostContent("")
            handleRemoveImage()

            sendPost(data)
        }
    }
    /*------------------------------------------------------------------------- */
    return (
        <div className="handle-post bg-white pad-10">
            <div>
                <img
                    className="avatar"
                    src={storage !== "" ? `${server}/uploads/${storage.user.avatar}` : ""}
                    alt="avatar"
                />

                <TextareaAutosize
                    id="post-content"
                    className="ml-13"
                    placeholder="What's on your mind?"
                    name=""
                    value={postContent}
                    onChange={handleMessageChange}
                />

            </div>
            {/* PREVIEW PICTURE OR VIDEO */}
            <div id="js-review" className="mt-25">
                {/* <img className="photo" src={imageDataURL} /> */}
                <div className="photo" src={imageDataURL} />
                <i onClick={handleRemoveImage} className="fa-solid fa-x"></i>
                {/* <div class="group-3">
                <img class="photo"
                src="https://images.pexels.com/photos/4321836/pexels-photo-4321836.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="">
                <img class="photo"
                src="https://images.pexels.com/photos/4651199/pexels-photo-4651199.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="">
                <img class="photo"
                src="https://images.pexels.com/photos/4651067/pexels-photo-4651067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="">
                </div> */}
            </div>
            <div className="row mt-15 space-between">
                <ul className="list-icon row">
                    <li>
                        <img
                            id="js-upload-picture"
                            className="icon-heading"
                            src="https://img.icons8.com/pulsar-color/48/pictures-folder.png"
                            alt="pictures-folder"
                            onClick={OpenPicture}
                        />

                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            multiple
                        />
                    </li>
                    <li>
                        <img
                            className="icon-heading"
                            src="https://img.icons8.com/cotton/64/docket--v1.png"
                            alt="docket--v1"
                        />
                    </li>
                    <li>
                        <img
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
                <div onClick={handleUpload} id="js-btn-post" className={`btn ${(isValidContent) ? 'btn-blue' : 'btn-disable'
                    }`}>
                    Đăng bài
                </div>
            </div>
        </div>
    )
}