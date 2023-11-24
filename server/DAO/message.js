import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.REACT_APP_DB_CONNECTION_STRING;
const dbName = process.env.REACT_APP_DB_NAME;

const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();

    return client.db(dbName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

const messageDb = {
  getFriends: async function(userID) {
    const db = await connect()

    const {friends} = await db.collection("User").findOne({'_id': new ObjectId(userID)})

    let friend = []

    if (!!friends)
    {
      for (let i = 0; i < friends.length; i++)
      {
        friend.push(
          await db.collection("User").findOne({'_id': new ObjectId(friends[i].$id)})
        )
      }
    }
    return friend
  },

  getMessages: async function(users) {
    const db = await connect()

    let messages = await db.collection("Message").find(
      {
        $or: [
          { 'users': [users[0], users[1]] },
          { 'users': [users[1], users[0]] },
        ]
      })
      .sort({'_id': 1})
      .toArray()

    for (let i = 0; i < messages.length; i++)
    {
      let userID = new ObjectId(messages[i].sender)
      messages[i].sender = await db.collection("User").findOne({'_id': userID})
    }

    return messages
  },

  addMessage: async function(message){
    const db = await connect()

    await db.collection("Message").insertOne(message)
  },

  getContacts: async function (userID) {
    const db = await connect();

    // Get friends of user
    const { friends } = await db.collection("User").findOne({ '_id': new ObjectId(userID) })
  
    const latestMessages = [];

    if (friends)
      for (const friend of friends) {
        let messages = await db.collection("Message").find(
          {
            $or: [
              { 'users': [friend.$id, userID] },
              { 'users': [userID, friend.$id] },
            ]
          }
        )
          .sort({ '_id': -1 })
          .limit(1) // Chỉ lấy tin nhắn mới nhất
          .toArray();

        if (messages.length > 0) {
          latestMessages.push({
            friend: await db.collection("User").findOne({ '_id': new ObjectId(friend.$id) }),
            latest_message: messages[0], 
          });
        }
      }

    return latestMessages
  }

};

export default messageDb;
