import express from 'express';
import dotenv from 'dotenv';
import commentDb from '../DAO/comment.js';
const app = express();
dotenv.config()

const commentUri = process.env.REACT_APP_API_COMMENT

app.post(commentUri, function (req, res) {  
    const comment = req.body
    console.log("Comment nhận được từ client gửi tới: ", comment)
    
    commentDb.addComment(comment)
})

export default app