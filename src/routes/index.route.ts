// noinspection AnonymousFunctionJS

import {Request, Response, Router} from "express";

export const indexRoute = Router({});
indexRoute.get('/', (_req: Request, res: Response) => {
    res.send('Заглушка')
});