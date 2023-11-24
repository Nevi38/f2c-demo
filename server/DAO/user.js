import { MongoClient, ObjectId } from "mongodb";
import dotenv from 'dotenv'
dotenv.config('../.env')

const uri = process.env.REACT_APP_DB_CONNECTION_STRING;
const db_name = process.env.REACT_APP_DB_NAME
const userCollection = "User"

const userDb = {
    getInfo: async function (userID) {  
        const client = new MongoClient(uri);
        try 
        {
            const database = client.db(db_name);
            
            const user = database.collection(userCollection);
            
            const filter = {
                '_id': new ObjectId(userID)
            }

            const result = await (user.findOne(filter));
            
            return result;
        } 
        finally 
        {
            await client.close();
        }
    },

    getInfo_ByObjectID: async function (userID) {
        
        const client = new MongoClient(uri);
        
        try 
        {
            const database = client.db(db_name);
            
            const user = database.collection(userCollection);

            const result = await (user.findOne(userID));
            
            return result;
        } 
        finally 
        {
            await client.close();
        }
    }
}

export default userDb