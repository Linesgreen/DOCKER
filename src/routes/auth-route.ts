
// noinspection MagicNumberJS

import {Router, Response, Request} from "express";
import {RequestWithBody} from "../types/common";
import {ChekPass} from "../types/auth/input";
import {UserService} from "../domain/user.service";
import {authLoginValidation} from "../middlewares/auth/auth-middleware";
import {UserDBType, UserOutputType} from "../types/users/output";
import {WithId} from "mongodb";
import {jwtService} from "../application/jwt-service";
import {authBearerMiddleware} from "../middlewares/auth/auth-bearer-niddleware";
import {UserQueryRepository} from "../repositories/query repository/user-query-repository";
import {AboutMe} from "../types/auth/output";

import {UserCreateModel} from "../types/users/input";


export const authRoute = Router({});


authRoute.post('/login', authLoginValidation(), async (req: RequestWithBody<ChekPass>, res: Response<{accessToken: string}>) => {
    const {loginOrEmail, password}: ChekPass = req.body;
    const user: WithId<UserDBType> | null = await UserService.checkCredentials(loginOrEmail, password);
    if (user) {
        const token = await jwtService.createJWT(user);
        res.status(200).send({
            accessToken: token
        });
        return
    }
    res.sendStatus(401)
});

authRoute.get('/me', authBearerMiddleware, async (req: Request, res: Response<AboutMe>) => {
    const userId: string = req.user!.id;
    const user: UserOutputType | null = await UserQueryRepository.getUserById(userId);
    const {email, login, id}: UserOutputType = user!;
    res.status(200).send({
        email: email,
        login: login,
        userId: id
    });


    authRoute.post('/', async (req: RequestWithBody<UserCreateModel>, res: Response<UserOutputType>) => {
        const userData: UserCreateModel = {
            login: req.body.login,
            password: req.body.password,
            email: req.body.email
        };
        const newUserId: string = await UserService.addUser(userData);
        const newUser: UserOutputType | null = await UserQueryRepository.getUserById(newUserId);
        res.status(201).send(newUser!);
    });
});




