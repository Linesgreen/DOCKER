import {Request, Response, Router} from "express";
import {BlogRepository} from "../repositories/blog-repository";
import {PostRepository} from "../repositories/post-repository";
import {RouterPaths} from "../index";

export const deleteTestRoute = Router({})

deleteTestRoute.delete (RouterPaths.__test__, async (req : Request, res : Response) => {
    await BlogRepository.deleteAll();
    await PostRepository.deleteAll()
    res.sendStatus(204)
})

