import express from "express";
import {postRoute} from "./src/routes/post.route";
import {blogRoute} from "./src/routes/blog-route";
import {deleteTestRoute} from "./src/routes/delete.test.route";
import {indexRoute} from "./src/routes/index.route";
import cors from "cors";


export const app = express();

export const RouterPaths = {
    blogs: '/blogs',
    posts: '/posts',
    __test__: '/testing/all-data',
    index: '/'
};

app.use(cors());
app.use(express.json());
app.use(RouterPaths.posts, postRoute);
app.use(RouterPaths.blogs, blogRoute);
app.use(RouterPaths.__test__, deleteTestRoute);
app.use(RouterPaths.index, indexRoute);

