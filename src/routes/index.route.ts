import {Request, Response, Router} from "express";
export const indexRoute = Router({})
indexRoute.get('/', (req : Request, res : Response) => {
    res.send('Заглушка')
})