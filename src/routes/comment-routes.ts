// noinspection MagicNumberJS

import {Router} from "express";
import {CommentQueryRepository} from "../repositories/query repository/comment-query-repository";
import {RequestWithBodyAndParams, RequestWithParams} from "../types/common";
import {CommentParams, CommentUpdateModel} from "../types/comment/input";
import {WithId} from "mongodb";
import {CommentType, OutputItemsCommentType} from "../types/comment/output";
import {CommentService} from "../domain/comment-service";

export const commentRoute = Router({});

// Возвращает все коменты - чисто для отладки
commentRoute.get('/', async (req, res) => {
    const comments: WithId<CommentType>[] = await CommentQueryRepository.getAllComments();
    res.status(200).send(comments)
});

// Получаем комментарий по айди
commentRoute.get('/:id', async (req: RequestWithParams<CommentParams>, res) => {
    const id: string = req.params.id;
    const comments: OutputItemsCommentType | null = await CommentQueryRepository.getCommentById(id);
    comments ? res.send(comments) : res.sendStatus(404)
});

//Обновляем комментарий по коммент айди
commentRoute.put('/:id', async (req: RequestWithBodyAndParams<CommentParams, CommentUpdateModel>,res) => {
    const id: string = req.params.id;
    const {content}: CommentUpdateModel = req.body;
    const updateResult : boolean = await CommentService.updateComment({content}, id);
    updateResult ? res.sendStatus(204) : res.sendStatus(404)
});

//Удаляем комментарий по коммент айд
commentRoute.delete('/:id', async (req: RequestWithParams<CommentParams>, res) => {
    const id: string = req.params.id;
    const deleteResult: boolean = await CommentService.deleteComment(id);
    deleteResult ? res.sendStatus(204) : res.sendStatus(404)
});