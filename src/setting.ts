import express from "express";
import {postRoute} from "./routes/post.route";
import {blogRoute} from "./routes/blog-route";
import {deleteTestRoute} from "./routes/delete.test.route";
import {indexRoute} from "./routes/index.route";

export const app = express();

export const RouterPaths = {
    blogs: '/blogs',
    posts: '/posts',
    __test__: '/testing/all-data',
    index: '/'
};


app.use(express.json());
app.use(RouterPaths.posts, postRoute);
app.use(RouterPaths.blogs, blogRoute);
app.use(RouterPaths.__test__, deleteTestRoute);
app.use(RouterPaths.index, indexRoute);

