import 'dotenv/config'
import {Collection, MongoClient} from "mongodb";
import {BlogType} from "../types/blogs/output";
import {PostType} from "../types/posts/output";

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
        console.log(`DB URI ${mongoUri}`)
    } catch (e) {
        console.log(`----------------------------------------`)
        console.log(`Can't connect to DB`)
        console.log(`----------------------------------------`)
        console.log(`${e}`)
        console.log(`----------------------------------------`)
        await client.close()
    }
}