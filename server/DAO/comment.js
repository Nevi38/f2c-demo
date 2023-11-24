import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import userDb from "./user.js";
import postDb from "./post.js"
import { io } from "../socket/socketServer.js"

dotenv.config();

const uri = process.env.REACT_APP_DB_CONNECTION_STRING;
const dbName = process.env.REACT_APP_DB_NAME;

const client = new MongoClient(uri);

// Kết nối đến MongoDB
async function connect() {
  try {
    await client.connect();

    return client.db(dbName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

const commentDb = {
  addComment: async function(comment)
  {
    const db = await connect();
    const commentCollection = db.collection("Comment");

    // Convert string to ObjectId before add mongodb
    comment.sender = new ObjectId(comment.sender)
    comment.postID = new ObjectId(comment.postID)

    // Insert document
    const result = await commentCollection.insertOne(comment)

    // Format comment
    const commentAdded = await this.findComment(result.insertedId)
    // Thông báo cho máy khách biết 1 comment đã được thêm, cập nhật lại
    io.emit("commentAdded", commentAdded);
  },
  
  getComments: async function (postID) {
    const db = await connect();
    const commentCollection = db.collection("Comment");

    const result = await commentCollection
    .find({'postID': postID})
    .sort({ _id: -1 })
    .toArray()

    const isFound = !!result

    if (isFound) {
      // Trích xuất tên người đăng comment dựa vào ID
      for (let i = 0; i < result.length; i++)
      {
        const user = await userDb.getInfo_ByObjectID(result[i].sender)
        result[i].sender = user
      }

      return result
    }

    return null
  },

  findComment: async function (commentID) {
    const db = await connect();
    const commentCollection = db.collection("Comment");

    const result = await commentCollection
    .findOne( { _id: commentID} )

    result.sender = await userDb.getInfo(result.sender)

    return result
  }
};

export default commentDb;
