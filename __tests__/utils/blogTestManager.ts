// noinspection UnnecessaryLocalVariableJS

import request from "supertest";
import {BlogCreateModel} from "../../src/types/blogs/input";
import {app, RouterPaths} from "../../src/setting";
import {PostToBlogCreateModel} from "../../src/types/posts/input";
import {UserCreateModel} from "../../src/types/users/input";


export const blogTestManager = {
    async createBlog(blogData: BlogCreateModel, status: number) {
        const response = await request(app)
            .post(RouterPaths.blogs)
            .auth('admin', 'qwerty')
            .send(blogData)
            .expect(status);
        return response;
    },

    async createPostInBlog(blogId: string, postData: PostToBlogCreateModel, status: number) {
        const response = await request(app)
            .post(`${RouterPaths.blogs}/${encodeURIComponent(blogId)}${RouterPaths.posts}`)
            .auth('admin', 'qwerty')
            .send(postData)
            .expect(status);
        return response
    },

    async createUser(userData: UserCreateModel, status: Number) {
        const response = await request(app)
            .post(RouterPaths.users)
            .auth('admin', 'qwerty')
            .send(userData)
            .expect(status);
        return response
    }
};
