import axios from 'axios';

const PORT = process.env.REACT_APP_SERVER_PORT;
const PATH = process.env.REACT_APP_API_POST;
const URL = `${process.env.REACT_APP_SEVER_IP}:${PORT}${PATH}`;

const serverAddress = `${process.env.REACT_APP_SEVER_IP}:${PORT}`;

async function deletePost(postID) {
  try {
    const url = `${serverAddress}${process.env.REACT_APP_API_DELETE_POST}`
    const response = await axios.post(url, {postID});

    return response
  } 
  catch (error) {
    console.error('Lỗi function deletePost at adapters/post.js', error);
    throw error;
  }
}

async function getPost() {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ máy chủ: function getPosts at adapters/post.js', error);
    throw error;
  }
}

async function getLimitPost(fromPost, toPost, ownerID) {
  try {

    const response = await axios.get(`${serverAddress}/limit-post`, {
      params: {
        fromPost: fromPost,
        toPost: toPost,
        ownerID: ownerID
      },
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ máy chủ: function getPosts at adapters/post.js', error);
    throw error;
  }
}

async function getNumberPost() {
  try {
    const response = await axios.get(`${serverAddress}/numberPost`)

    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ máy chủ: function getNumberPost at adapters/post.js', error);
    throw error;
  }
}

async function sendPost(data) {
  const formData = new FormData();
  formData.append('sender', data.sender);
  formData.append('content[text]', data.content.text);
  formData.append('content[image]', data.content.image);
  formData.append('creationTime', data.creationTime);
  formData.append('displayMode', data.displayMode);

  try {
    const response = await axios.post(URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("Phản hồi: ", response.data);
  }
  catch (error) {
    console.error(error);
  }
}

async function getPostsByID(fromPost, toPost, senderID) {
  try {
    
    const response = await axios.get(`${serverAddress}/get-post-by-userID`, {
      params: {
        fromPost: fromPost,
        toPost: toPost,
        senderID: senderID
      },
    });

    return response.data;

  } 
  catch (error) {
    
    console.error('Lỗi khi lấy dữ liệu từ máy chủ: function getPostsByID at adapters/post.js', error);
    
    throw error;
  }
}

export { getPost, sendPost, deletePost, getLimitPost, getNumberPost, getPostsByID }
