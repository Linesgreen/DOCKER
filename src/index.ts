import express, {Request, Response} from "express";
import {runDb} from "./db/db";
import {blogRoute} from "./routes/blog-route";
import {BlogRepository} from "./repositories/blog-repository";
import {PostRepository} from "./repositories/post-repository";
import {postRoute} from "./routes/post.route";
import cors from "cors";


export const app  = express()
export const port = process.env.PORT || 5000;
app.use(cors())



export const RouterPaths = {
    blogs: '/blogs',
    posts: '/posts',
    __test__: '/testing/all-data'
}

app.use(express.json())
app.use(RouterPaths.posts, postRoute)
app.use(RouterPaths.blogs, blogRoute)


app.get('/', (req : Request, res : Response) => {
    res.send('Заглушка')
})
app.delete (RouterPaths.__test__, async (req : Request, res : Response) => {
    await BlogRepository.deleteAll();
    await PostRepository.deleteAll()
    res.sendStatus(204)
})
app.listen(port, async () => {
    await runDb()
})