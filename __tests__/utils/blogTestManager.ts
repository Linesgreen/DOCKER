// noinspection UnnecessaryLocalVariableJS

import request from "supertest";
import {BlogCreateModel} from "../../src/types/blogs/input";
import {app, RouterPaths} from "../../src/setting";


export const blogTestManager = {
    async createBlog(blogData : BlogCreateModel, status: number) {
        const response = await request(app)
            .post(RouterPaths.blogs)
            .auth('admin', 'qwerty')
            .send(blogData)
            .expect(status);


        return response;
    }
};