import *as  dotenv from 'dotenv'
import {Collection, MongoClient} from "mongodb";
import {BlogType} from "../types/blogs/output";
import {PostType} from "../types/posts/output";

dotenv.config()


const mongoUri : string = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
console.log(process.env.MONGO_URL)


const client = new MongoClient(mongoUri)
const db = client.db()

export const blogCollection : Collection<BlogType>  = db.collection<BlogType>('blog')
export const postCollection: Collection<PostType> = db.collection('post')

export const runDb = async () => {
    try {
        await client.connect()
        console.log(`Client connected to DB`)
    } catch (e) {
        console.log(`${e}`)
        await client.close()
    }
}