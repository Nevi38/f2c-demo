import axios from 'axios';
const PORT = process.env.REACT_APP_SERVER_PORT;
const COMMENT = process.env.REACT_APP_API_COMMENT;
const COMMENT_URL = `${process.env.REACT_APP_SEVER_IP}:${PORT}${COMMENT}`;

async function addComment(comment) {
    try {
        console.log(COMMENT_URL)
        await axios.post(COMMENT_URL, comment);
    } catch (error) {
        console.error('Lỗi: function addComment at adapters/comment.js:', error);
        throw error;
    }
}

export {addComment}
