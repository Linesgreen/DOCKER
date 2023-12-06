// noinspection MagicNumberJS

import {Router, Response} from "express";
import {UserService} from "../domain/user-service";
import {RequestWithBody} from "../types/common";
import {UserCreateModel} from "../types/users/input";
import {UserQueryRepository} from "../repositories/user-query-repository";
import {UserOutputType} from "../types/users/output";


export const usersRoute = Router({});

usersRoute.get('/', async (_req, res) => {
    const users: UserOutputType[] = await UserQueryRepository.getAllUsers();
    res.status(200).send(users)
});


usersRoute.post('/', async (req: RequestWithBody<UserCreateModel> ,res: Response<UserOutputType | null>) => {
    const userData: UserCreateModel = {
        login: req.body.login,
        password: req.body.password,
        email: req.body.email
    };
    const newUserId = await UserService.addUser(userData);
    const newUser: UserOutputType | null = await UserQueryRepository.getUserById(newUserId);
    res.status(201).send(newUser);
});