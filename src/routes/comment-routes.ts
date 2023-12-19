// noinspection MagicNumberJS

import {Router, Request, Response} from "express";
import {CommentQueryRepository} from "../repositories/query repository/comment-query-repository";
import {RequestWithBodyAndParams, RequestWithParams} from "../types/common";
import {CommentParams, CommentUpdateModel} from "../types/comment/input";
import {WithId} from "mongodb";
import {CommentType, OutputItemsCommentType} from "../types/comment/output";
import {CommenService} from "../domain/commen.service";
import {mongoIdAndErrorResult} from "../middlewares/mongoIDValidation";
import {addCommentToPost} from "../middlewares/post/postsValidator";
import {authBearerMiddleware} from "../middlewares/auth/auth-bearer-niddleware";
import {commentOwnerMiddleware} from "../middlewares/comment/commentsValidator";

export const commentRoute = Router({});

// Возвращает все коменты в чистом виде без маппера - чисто для отладки
commentRoute.get('/', async (req: Request, res: Response) => {
    const comments: WithId<CommentType>[] = await CommentQueryRepository.getAllComments();
    res.status(200).send(comments)
});

// Получаем комментарий по айди
commentRoute.get('/:id', mongoIdAndErrorResult(), async (req: RequestWithParams<CommentParams>, res: Response<OutputItemsCommentType>) => {
    const id: string = req.params.id;
    const comments: OutputItemsCommentType | null = await CommentQueryRepository.getCommentById(id);
    comments === null ? res.sendStatus(404) : res.send(comments)
});

//Обновляем комментарий по коммент айди //Поменять местами commentOwnerMiddleware, addCommentToPost()
commentRoute.put('/:id', authBearerMiddleware, addCommentToPost(), commentOwnerMiddleware, async (req: RequestWithBodyAndParams<CommentParams, CommentUpdateModel>, res: Response) => {
    const commentId: string = req.params.id;
    const content: CommentUpdateModel = req.body;
    const updateResult: boolean | null = await CommenService.updateComment(commentId, content);
    updateResult ? res.sendStatus(204) : res.sendStatus(404)
});

//Удаляем комментарий по коммент айд
commentRoute.delete('/:id', authBearerMiddleware, mongoIdAndErrorResult(), commentOwnerMiddleware, async (req: RequestWithParams<CommentParams>, res: Response) => {
    const commentId: string = req.params.id;
    const deleteResult: boolean = await CommenService.deleteComment(commentId);
    deleteResult ? res.sendStatus(204) : res.sendStatus(404)
});
