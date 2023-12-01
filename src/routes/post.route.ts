// noinspection MagicNumberJS,AnonymousFunctionJS

import {Router, Response} from "express";
import {OutputPostType, PostType} from "../types/posts/output";
import {RequestWithBody, RequestWithBodyAndParams, RequestWithParams, RequestWithQuery} from "../types/common";
import {PostCreateModel, PostParams, PostSortData, PostUpdateModel,} from "../types/posts/input";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {postPostValidation, postPutValidation} from "../middlewares/post/postsValidator";
import {PostService} from "../domain/post-service";
import {PostQueryRepository} from "../repositories/post-query-repository";

export const postRoute = Router({});



postRoute.get('/', async (req: RequestWithQuery<PostSortData>, res: Response<OutputPostType>) => {
    const sortData: PostSortData = {
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize
    };
    const posts: OutputPostType = await PostQueryRepository.getAllPosts(sortData);
    res.send(posts)
});

postRoute.get('/:id', async (req: RequestWithParams<PostParams>, res: Response<PostType>) => {
    const id: string = req.params.id;
    const post: PostType | null = await PostQueryRepository.getPostById(id);
    post ? res.send(post) : res.sendStatus(404)
});

postRoute.post('/', authMiddleware, postPostValidation(), async (req: RequestWithBody<PostCreateModel>, res: Response<PostType | null>) => {
    let {title, shortDescription, content, blogId}: PostCreateModel = req.body;
    const newPostId: string = await PostService.addPost({title, shortDescription, content, blogId});
    res.status(201).send(await PostQueryRepository.getPostById(newPostId))
});

postRoute.put('/:id', authMiddleware, postPutValidation(), async (req: RequestWithBodyAndParams<PostParams, PostUpdateModel>, res: Response) => {
    const id: string = req.params.id;
    const {title, shortDescription, content, blogId}: PostUpdateModel = req.body;
    const updateResult: boolean = await PostService.updatePost({title, shortDescription, content, blogId}, id);
    updateResult ? res.sendStatus(204) : res.sendStatus(404)
});

postRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<PostParams>, res: Response) => {
    const id: string = req.params.id;
    const deleteResult: boolean = await PostService.deletePostById(id);
    deleteResult ? res.sendStatus(204) : res.sendStatus(404)
});

