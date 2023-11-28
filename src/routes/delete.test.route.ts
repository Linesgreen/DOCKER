// noinspection MagicNumberJS,AnonymousFunctionJS

import {Request, Response, Router} from "express";
import {BlogQueryRepository} from "../repositories/blog-query-repository";
import {PostQueryRepository} from "../repositories/post-query-repository";


export const deleteTestRoute = Router({});

deleteTestRoute.delete('', async (_req: Request, res: Response) => {
    await BlogQueryRepository.deleteAll();
    await PostQueryRepository.deleteAll();
    res.sendStatus(204)
});

