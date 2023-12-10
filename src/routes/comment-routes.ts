// noinspection MagicNumberJS

import {Router, Response} from "express";
import {CommentQueryRepository} from "../repositories/query repository/comment-query-repository";
import {RequestWithBodyAndParams, RequestWithParams} from "../types/common";
import {CommentParams, CommentUpdateModel} from "../types/comment/input";
import {WithId} from "mongodb";
import {CommentType, OutputItemsCommentType} from "../types/comment/output";
import {CommentService} from "../domain/comment-service";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {mongoIdAndErrorResult} from "../middlewares/mongoIDValidation";
import {addCommentToPost} from "../middlewares/post/postsValidator";

export const commentRoute = Router({});

// Возвращает все коменты в чистом виде без маппера - чисто для отладки
commentRoute.get('/', async (req, res) => {
    const comments: WithId<CommentType>[] = await CommentQueryRepository.getAllComments();
    res.status(200).send(comments)
});

// Получаем комментарий по айди
commentRoute.get('/:id', mongoIdAndErrorResult(), async (req: RequestWithParams<CommentParams>, res: Response) => {
    const id: string = req.params.id;
    const comments: OutputItemsCommentType | null = await CommentQueryRepository.getCommentById(id);
    comments ? res.send(comments) : res.sendStatus(404)
});

//Обновляем комментарий по коммент айди
commentRoute.put('/:id', authMiddleware, addCommentToPost(), async (req: RequestWithBodyAndParams<CommentParams, CommentUpdateModel>, res: Response) => {
    const id: string = req.params.id;
    const {content}: CommentUpdateModel = req.body;
    const updateResult: boolean = await CommentService.updateComment({content}, id);
    updateResult ? res.sendStatus(204) : res.sendStatus(404)
});

//Удаляем комментарий по коммент айд
commentRoute.delete('/:id', authMiddleware, mongoIdAndErrorResult(), async (req: RequestWithParams<CommentParams>, res: Response) => {
    const id: string = req.params.id;
    const deleteResult: boolean = await CommentService.deleteComment(id);
    deleteResult ? res.sendStatus(204) : res.sendStatus(404)
});