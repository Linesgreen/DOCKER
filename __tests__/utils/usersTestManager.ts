// noinspection UnnecessaryLocalVariableJS

import {UserCreateModel} from "../../src/types/users/input";
import request from "supertest";
import {app, RouterPaths} from "../../src/setting";

export const usersTestManager = {
    async createUser(userData: UserCreateModel, basicAuth: { login: string, password: string }, status: number) {
        const response = await request(app)
            .post(RouterPaths.users)
            .auth(basicAuth.login, basicAuth.password)
            .send(userData)
            .expect(status);
        return response;
    }
};