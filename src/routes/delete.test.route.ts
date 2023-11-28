// noinspection MagicNumberJS

import {Request, Response, Router} from "express";
import {PostRepository} from "../repositories/post-repository";
import {BlogService} from "../domain/blog-service";


export const deleteTestRoute = Router({});

deleteTestRoute.delete('', async (req: Request, res: Response) => {
    await BlogService.deleteAll();
    await PostRepository.deleteAll();
    res.sendStatus(204)
});

