import express, {Request, Response} from "express";

import {port, runDb} from "./db/db";
import {blogRoute} from "./routes/blog-route";
import {BlogRepository} from "./repositories/blog-repository";
import {PostRepository} from "./repositories/post-repository";
import {postRoute} from "./routes/post.route";


export const app  = express()

export const RouterPaths = {
    videos: '/videos',
    blogs: '/blogs',
    posts: '/posts',
    __test__: '/testing/all-data'
}

app.use(express.json())
/*
app.use(RouterPaths.videos, videoRouter)
 */
app.use(RouterPaths.posts, postRoute)
app.use(RouterPaths.blogs, blogRoute)


app.get('/', (req : Request, res : Response) => {
    res.send('Заглушка')
})
app.delete (RouterPaths.__test__, async (req : Request, res : Response) => {
    await BlogRepository.deleteAll();
    await PostRepository.deleteAll()
    res.sendStatus(204)
    /*
    db.videos.length = 0;
    db.blogs.length = 0;
    db.posts.length=0;
    res.sendStatus(204);
     */
})
app.listen(port, async () => {
    await runDb()
})