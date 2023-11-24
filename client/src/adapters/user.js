import axios from 'axios';
const PORT = process.env.REACT_APP_SERVER_PORT;
const USER = process.env.REACT_APP_API_USER;
const USER_URL = `${process.env.REACT_APP_SEVER_IP}:${PORT}${USER}`;

async function getUser(userID) {
    try {
        const response = await axios.post(USER_URL, {userID});

        return response.data
    } catch (error) {
        console.error('Lỗi: function getUser at adapters/user.js:', error);
        throw error;
    }
}

export { getUser }
