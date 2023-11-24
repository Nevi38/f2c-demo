import axios from 'axios';

const PORT = process.env.REACT_APP_SERVER_PORT;
const REGISTER = process.env.REACT_APP_API_ACCOUNT_REGISTER;
const REGISTER_URL = `${process.env.REACT_APP_SEVER_IP}:${PORT}${REGISTER}`;
const LOGIN = process.env.REACT_APP_API_ACCOUNT_LOGIN;
const LOGIN_URL = `${process.env.REACT_APP_SEVER_IP}:${PORT}${LOGIN}`;

async function sendAccount(account) {
    try {
        const response = await axios.post(REGISTER_URL, account);
      
        return response.data

    } catch (error) {
        console.error('Lỗi: function sendAccount at adapters/account.js:', error);
        throw error;
    }
}

async function isExistAccount(account) {
    try {
        const response = await axios.post(LOGIN_URL, account);

        const userInfo = response.data;
        /* 
            userID = null: if not found
            otherwise, return: userID (ObjectID)     
        */
        return userInfo
    } catch (error) {
        console.error('Lỗi: function isExistAccount at adapters/account.js:', error);
        throw error;
    }
}

export {sendAccount, isExistAccount}
