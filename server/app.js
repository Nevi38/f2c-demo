import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import post from './api/post.js';
import account from './api/account.js'
import user from './api/user.js';
import comment from './api/comment.js';

import bodyParser from 'body-parser'
import { server, io } from './socket/socketServer.js'

dotenv.config();

const app = express();
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT;
const SOCKET_PORT = process.env.REACT_APP_SERVER_SOCKET

app.use(bodyParser.json());
app.use(cors());

// SEND & RECEIVE
app.use(express.static('public'))
app.use(post);
app.use(account)
app.use(user)
app.use(comment)

app.listen(SERVER_PORT, function () {
  console.log("Server is listening at: " + SERVER_PORT);
});

server.listen(SOCKET_PORT, () => {
  console.log("Server socket.io is running on port " + SOCKET_PORT);
});
