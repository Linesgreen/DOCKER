// noinspection MagicNumberJS,AnonymousFunctionJS

import {Request, Response, Router} from "express";
import {BlogQueryRepository} from "../repositories/query repository/blog-query-repository";
import {PostQueryRepository} from "../repositories/query repository/post-query-repository";
import {UserQueryRepository} from "../repositories/query repository/user-query-repository";


export const deleteTestRoute = Router({});

deleteTestRoute.delete('', async (_req: Request, res: Response) => {
    await BlogQueryRepository.deleteAll();
    await PostQueryRepository.deleteAll();
    await UserQueryRepository.deleteAll();
    res.sendStatus(204)
});

