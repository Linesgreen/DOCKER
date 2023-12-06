import express from "express";
import {postRoute} from "./routes/post.route";
import {blogRoute} from "./routes/blog-route";
import {deleteTestRoute} from "./routes/delete.test.route";
import {indexRoute} from "./routes/index.route";
import {authRoute} from "./routes/auth-route";
import {usersRoute} from "./routes/users-route";

export const app = express();

export const RouterPaths = {
    blogs: '/blogs',
    posts: '/posts',
    __test__: '/testing/all-data',
    index: '/',
    auth: '/auth',
    users: '/users',
};


app.use(express.json());
app.use(RouterPaths.posts, postRoute);
app.use(RouterPaths.blogs, blogRoute);
app.use(RouterPaths.__test__, deleteTestRoute);
app.use(RouterPaths.index, indexRoute);
app.use(RouterPaths.auth, authRoute);
app.use(RouterPaths.users, usersRoute);

