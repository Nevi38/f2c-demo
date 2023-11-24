import http from "http";
import express from "express";
import { Server } from "socket.io";
import 'dotenv/config'
import messageDb from "../DAO/message.js";
import postDb from "../DAO/post.js"

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

global.onlineUsers = new Map();

io.on("connection", async (socket) => {

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(userId)
  });

  socket.on("getFriends", async function(userID) {
    const user = onlineUsers.get(userID);
    const listFriends = await messageDb.getFriends(userID)
    io.to(user).emit("getFriends",listFriends)
  })


  // users is array [from, to]
  socket.on("updateMessage", async function(users) {
    const from = onlineUsers.get(users[0]);
    const to = onlineUsers.get(users[1]);

    const messages = await messageDb.getMessages(users)

    io.to(from).to(to).emit("updateMessage", messages)
  })

 
  socket.on("getContacts", async function(userID) {
      let sendUserSocket = onlineUsers.get(userID);

      const contacts = await messageDb.getContacts(userID);

      if (sendUserSocket)
      {
        io.to(sendUserSocket).emit("getContacts", contacts);
      }
  });
  

  socket.on("addMessage", async function(message) {

    await messageDb.addMessage(message)

    const messages = await messageDb.getMessages(message.users)

    const from = onlineUsers.get(message.users[0]);
    const to = onlineUsers.get(message.users[1]);
    
    io.to(from).to(to).emit("updateMessage", messages)
  })

  socket.on("updateEmoji", async function({postID, userID, totalEmoji}) {
    if (userID)
      postDb.updateEmoji(postID, userID, totalEmoji)
  })
});

export { io, server }
