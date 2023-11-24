import express from 'express';
import dotenv from 'dotenv';
import userDb from '../DAO/user.js';
const app = express();
dotenv.config()

const USER_URL = process.env.REACT_APP_API_USER

// Nhận yêu cầu từ client và trả toàn bộ kết quả liên quan qua client 1 lần duy nhất,
// khi người dùng đăng nhập vào
app.post(USER_URL, async function (req, res) {
    const { userID } = req.body
    const getInfo = await userDb.getInfo(userID)

    res.json(getInfo)
})

export default app