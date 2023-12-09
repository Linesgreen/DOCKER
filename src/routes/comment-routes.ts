// noinspection MagicNumberJS

import {Router} from "express";
import {CommentQueryRepository} from "../repositories/query repository/comment-query-repository";
import {RequestWithParams} from "../types/common";
import {CommentParams} from "../types/comment/input";

export const commentRoute = Router({});

commentRoute.get('/', async (req, res) => {
    const comments = await CommentQueryRepository.getAllComments();
    res.status(200).send(comments)
});

commentRoute.get('/:id', async (req: RequestWithParams<CommentParams>, res) => {
    const id = req.params.id;
    const comments = await CommentQueryRepository.getCommentById(id);
    comments ? res.send(comments) : res.sendStatus(404)
});