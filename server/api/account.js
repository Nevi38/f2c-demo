import express from 'express';
import dotenv from 'dotenv';
import accountDb from '../DAO/account.js';
const app = express();
dotenv.config()

const registerUri = process.env.REACT_APP_API_ACCOUNT_REGISTER
const loginUri = process.env.REACT_APP_API_ACCOUNT_LOGIN

app.post(registerUri, async function (req, res) {
    
    const account = req.body
    
    const status = await accountDb.addAccount(account)

    res.send(status)
})

app.post(loginUri, async function(req, res) {
    
    const account = req.body;

    const userID = await accountDb.findAccount(account)

    res.json(userID)
})

export default app