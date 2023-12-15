import {CommentCreateModel} from "../../src/types/comment/input";
import request from "supertest";
import {app, RouterPaths} from "../../src/setting";

export const commentTestManager = {
    async createComment(commentData: CommentCreateModel, postId: string, token: string){
        const response = await request(app)
            .post(`${RouterPaths.posts}/${postId}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .send(commentData)
            .expect(201);
        return response.body;
    }
};