// UTILS
import generate_Salt_SHA256Hash from '../utils/generate_Salt_SHA256Hash.js'

// MODULE OTHERS
import crypto from "crypto";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
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

const accountDb = {
  findAccount: async function (account) {
    const db = await connect();
    const accountCollection = db.collection("Account");

    const isExistUsername = await accountCollection.findOne({
      username: account.username
    })

    if (isExistUsername) {
      // Băm mật khẩu
      const salt = (await accountCollection.findOne({
        username: account.username
      })).salt

      const passhash = generate_Salt_SHA256Hash(account.password, salt)

      const result = await accountCollection.findOne({
        username: account.username,
        password: passhash
      });

      const isFound = !!result
      
      if (isFound)
        return result._id
      
      return !!result;
    }
    return false
  },

  addAccount: async function (account) {
    const db = await connect();
    const userCollection = db.collection("User");
    const accountCollection = db.collection("Account");

    // Nếu username đã có
    const usernameIsExit = await accountCollection.findOne({
      username: account.username
    })

    if (usernameIsExit)
      return false

    // Tạo salt
    const randomSalt = crypto.randomBytes(16).toString('hex')
    const passhash = generate_Salt_SHA256Hash(account.password, randomSalt)

    // Tạo account trước mới tạo tới user
    const Account = {
      username: account.username,
      password: passhash,
      salt: randomSalt
    };
    const accountResult = await accountCollection.insertOne(Account);
    const User = {
      _id: accountResult.insertedId,
      firstName: account.firstName,
      lastName: account.lastName,
      avatar: account.avatar
    };
    const userResult = await userCollection.insertOne(User);
    console.log("Add Account Successful");
    return true
  },
};

export default accountDb;
