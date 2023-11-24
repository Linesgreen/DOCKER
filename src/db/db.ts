import {Collection, MongoClient} from "mongodb";
import {BlogType} from "../types/blogs/output";
import {PostType} from "../types/posts/output";

export const port = process.env.PORT || 5000;

const mongoUri : string = 'mongodb+srv://linesgreen:3345413kve@cluster0.dwg0i1o.mongodb.net/?retryWrites=true&w=majority'

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