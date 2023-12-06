
// noinspection MagicNumberJS

import {Router, Response} from "express";
import {RequestWithBody} from "../types/common";
import {ChekPass} from "../types/auth/input";
import {UserService} from "../domain/user-service";

export const authRoute = Router({});


authRoute.post('/login', async (req: RequestWithBody<ChekPass>, res: Response) => {
    const {loginOrEmail, password}: ChekPass = req.body;
    const result: boolean = await UserService.checkCredentials(loginOrEmail, password);
    result ? res.sendStatus(204) : res.sendStatus(401)
});




