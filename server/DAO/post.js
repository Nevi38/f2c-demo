import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import userDb from './user.js'
import commentDb from "./comment.js";
import { io } from '../socket/socketServer.js'

dotenv.config();

const uri = process.env.REACT_APP_DB_CONNECTION_STRING;
const db_name = process.env.REACT_APP_DB_NAME;
const collection_name = "Post";

const postDb = {

  updateEmoji: async function (postID, userID, totalEmoji) {
    const client = new MongoClient(uri);

    try {
      const database = client.db(db_name);
      const collection = database.collection('Post')

      const filter = { _id: new ObjectId(postID) };
      const update = {
        $set: {
          'loves': totalEmoji
        }
      };

      await collection.updateOne(filter, update)

      const emojiCollection = database.collection('Emoji')

      // Get all emoji of post
      let emoji = await emojiCollection.findOne({
        '_id': new ObjectId(postID)
      })

      // Nếu bài viết đó chưa có emoji thì khởi tạo
      if (!emoji) {
        await emojiCollection.insertOne(
          {
            '_id': new ObjectId(postID)
          }
        )

        emoji = await emojiCollection.findOne({
          '_id': new ObjectId(postID)
        })
      }

      let len
      if (!emoji.reactions) {
        len = 0
        emoji.reactions = []
      }
      else
        len = emoji.reactions.length

      let reactions = emoji.reactions

      if (totalEmoji > len) {
        reactions.push(
          {
            'userID': userID
          }
        )
        const filter = { _id: new ObjectId(postID) };
        const update = {
          $set: {
            'reactions': reactions
          }
        };
        await emojiCollection.updateOne(filter, update)

      } else {
        for (let i = 0; i < reactions.length; i++) {
          if (reactions[i].userID == userID) {
            reactions = reactions.splice(i + 1, 1)
            break;
          }
        }
        const filter = { _id: new ObjectId(postID) };
        const update = {
          $set: {
            'reactions': reactions
          }
        };
        await emojiCollection.updateOne(filter, update)
      }

    } finally {
      await client.close();
    }
  },

  deletePost: async function (postID) {
    const client = new MongoClient(uri);

    try {
      const database = client.db(db_name);
      const posts = database.collection(collection_name);

      const ID = new ObjectId(postID)
      await posts.deleteOne({ _id: ID });

      // Delete comment of post id
      const commentCollection = database.collection('Comment');
      await commentCollection.deleteMany({ postID: ID })

    } finally {
      await client.close();
    }
  },

  getNumberPost: async function () {
    const client = new MongoClient(uri);

    try {
      const database = client.db(db_name);
      const posts = database.collection(collection_name);

      return await posts.countDocuments()
    } finally {
      await client.close();
    }
  },

  addPost: async function (post) {
    const client = new MongoClient(uri);

    try {
      const database = client.db(db_name);
      const posts = database.collection(collection_name);

      const postAdded = await posts.insertOne(post);

      // Gửi thông báo tới máy chủ
      const data = await this.getPost(postAdded.insertedId)

      io.emit("postAdded", data);

    } finally {
      await client.close();
    }
  },

  getPost: async function (postID) {
    const client = new MongoClient(uri);

    try {
      const database = client.db(db_name);
      const posts = database.collection(collection_name);

      const result = await posts
        .findOne({ _id: postID })

      // Cập nhật lại thời gian tạo bài viết & tên user & Trích xuất comment
      const user = await userDb.getInfo(result.sender)

      result.comments = await commentDb.getComments(result._id)
      result.creationTime = formatCreationTime(new Date(result.creationTime))
      result.sender = user

      return result;
    }
    finally {
      await client.close();
    }
  },

  getAllPost: async function () {
    const client = new MongoClient(uri);

    try {
      const database = client.db(db_name);
      const posts = database.collection(collection_name);

      const result = await posts.find({}).sort({ _id: -1 }).toArray();

      // Cập nhật lại thời gian tạo bài viết & tên user & Trích xuất comment
      for (let i = 0; i < result.length; i++) {
        const user = await userDb.getInfo(result[i].sender)

        result[i].comments = await commentDb.getComments(result[i]._id)
        result[i].creationTime = formatCreationTime(new Date(result[i].creationTime))
        result[i].sender = user
      }

      return result;
    }
    finally {
      await client.close();
    }
  },

  getPosts: async function (fromPost, toPost, ownerID) {
    const client = new MongoClient(uri);

    try {
      fromPost = parseInt(fromPost)
      toPost = parseInt(toPost)
      const database = client.db(db_name);
      const posts = database.collection(collection_name);

      const result = await posts
        .find({})
        .skip(fromPost)
        .limit(toPost - fromPost)
        .sort({ _id: -1 })
        .toArray();

      // Cập nhật lại thời gian tạo bài viết & tên user & Trích xuất comment
      for (let i = 0; i < result.length; i++) {
        const user = await userDb.getInfo(result[i].sender)
        const emoji = await database.collection('Emoji').findOne({
          '_id': new ObjectId(result[i]._id)
        })

        const isLove = function () {
          if (emoji) {

            for (const { userID } of emoji.reactions) {
              if (userID == ownerID) {
                return true
              }
            }
            return false
          }
          return false
        }

        result[i].comments = await commentDb.getComments(result[i]._id)
        result[i].creationTime = formatCreationTime(new Date(result[i].creationTime))
        result[i].sender = user
        result[i].isLove = isLove()
      }

      return result;
    }
    finally {
      await client.close();
    }
  },

  getPostsByID: async function (fromPost, toPost, senderID) {
    const client = new MongoClient(uri);

    try {
      fromPost = parseInt(fromPost)
      toPost = parseInt(toPost)
      const database = client.db(db_name);
      const posts = database.collection(collection_name);

      const result = await posts
        .find({
          'sender': senderID
        })
        .skip(fromPost)
        .limit(toPost - fromPost)
        .sort({ _id: -1 })
        .toArray();

      for (let i = 0; i < result.length; i++) {
        let emoji = await database.collection('Emoji').findOne({
          '_id': result[i]._id
        })

        const isLove = function () {
          if (emoji) {

            for (const { userID } of emoji.reactions) {
              if (userID == senderID)
                return true
            }
          }

          return false
        }

        let postID = result[i]._id

        result[i].totalComment = (await commentDb.getComments(postID)).length
        result[i].isLove = isLove()
      }

      return result;
    }
    finally {
      await client.close();
    }
  }
};

function formatCreationTime(creationTime) {
  // Tạo đối tượng Date cho thời điểm hiện tại
  let currentTime = new Date();

  // Kiểm tra xem creationTime có lớn hơn currentTime không, nếu có thì hoán đổi chỗ
  if (creationTime > currentTime) {
    let temp = creationTime;
    creationTime = currentTime;
    currentTime = temp;
  }

  // Tính khoảng thời gian giữa currentTime và creationTime (đơn vị là mili giây)
  const timeDifference = currentTime - creationTime;

  const secondsDifference = Math.floor(timeDifference / 1000);
  const minutesDifference = Math.floor(timeDifference / (1000 * 60));
  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (daysDifference >= 1)
    return daysDifference + " days ago"
  else if (minutesDifference >= 60)
    return hoursDifference + " hours ago"
  else if (secondsDifference >= 60)
    return minutesDifference + " minutes ago"
  else
    return secondsDifference + " seconds ago"
}


export default postDb