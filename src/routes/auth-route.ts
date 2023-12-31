
// noinspection MagicNumberJS

import {Router, Response, Request} from "express";
import {RequestWithBody} from "../types/common";
import {ChekPass, ConfCode} from "../types/auth/input";
import {UserService} from "../domain/user.service";
import {authLoginValidation} from "../middlewares/auth/auth-middleware";
import {UserDBType, UserOutputType} from "../types/users/output";
import {WithId} from "mongodb";
import {jwtService} from "../application/jwt-service";
import {authBearerMiddleware} from "../middlewares/auth/auth-bearer-niddleware";
import {UserQueryRepository} from "../repositories/query repository/user-query-repository";
import {AboutMe} from "../types/auth/output";

import {UserCreateModel} from "../types/users/input";
import {authService} from "../domain/auth.service";
import {
    authConfirmationValidation,
    authRegistrationValidation,
    authResendConfCode
} from "../middlewares/auth/authValidator";



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
});

authRoute.post('/registration', authRegistrationValidation(), async (req: RequestWithBody<UserCreateModel>, res: Response<UserOutputType>) => {
    const userData: UserCreateModel = {
        login: req.body.login,
        password: req.body.password,
        email: req.body.email
    };
    const result = await authService.createUser(userData);
    result ? res.sendStatus(204) : res.sendStatus(422)
});

authRoute.post('/registration-confirmation', authConfirmationValidation(), async (req: RequestWithBody<ConfCode>, res: Response<UserOutputType>) => {
    const code: string = req.body.code;
    const result: boolean = await authService.activaionAccount(code);
    result ? res.sendStatus(204) : res.sendStatus(400)
});

authRoute.post('/registration-email-resending', authResendConfCode(), async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const resendResult = await authService.resendActivatedCode(email);
    if (!resendResult) {
        res.sendStatus(400)
    }
    res.sendStatus(204)
});







