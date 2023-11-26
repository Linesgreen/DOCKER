import {Request, Response, Router} from "express";
import {BlogRepository} from "../repositories/blog-repository";
import {PostRepository} from "../repositories/post-repository";


export const deleteTestRoute = Router({})

deleteTestRoute.delete ('', async (req : Request, res : Response) => {
    await BlogRepository.deleteAll();
    await PostRepository.deleteAll()
    res.sendStatus(204)
})

