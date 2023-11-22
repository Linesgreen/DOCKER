import {Collection, MongoClient} from "mongodb";
import {BlogType, OutputBlogType} from "../types/blogs/output";
import {PostType} from "../types/posts/output";

export const port = 3002;

const mongoUri : string = 'mongodb://localhost:27017'

const client = new MongoClient(mongoUri)

const db = client.db('node-blog')

export const blogCollection : Collection<BlogType>  = db.collection<BlogType>('blog')
export const postCollection: Collection<PostType> = db.collection('post')

export const runDb = async () => {
    try {
        await client.connect()
        console.log(`Client connected to DB`)
        console.log(`Listen port number ${port}`)
    } catch (e) {
        console.log(`${e}`)
        await client.close()
    }
}