import express from "express";
import {runDb} from "./db/db";
import {blogRoute} from "./routes/blog-route";
import {postRoute} from "./routes/post.route";
import cors from "cors";
import {deleteTestRoute} from "./routes/delete.test.route";
import {indexRoute} from "./routes/index.route";


export const app  = express()
export const port = process.env.PORT || 5001;
app.use(cors())


export const RouterPaths = {
    blogs: '/blogs',
    posts: '/posts',
    __test__: '/testing/all-data'
}

app.use(express.json())
app.use(RouterPaths.posts, postRoute)
app.use(RouterPaths.blogs, blogRoute)
app.use(RouterPaths.__test__, deleteTestRoute)
app.use('/', indexRoute)


app.listen(port, async () => {
    await runDb()
})