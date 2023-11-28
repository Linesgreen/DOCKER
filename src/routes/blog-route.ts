// noinspection AnonymousFunctionJS,MagicNumberJS

import {Router, Response, Request} from "express";
import {RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "../types/common";
import {BlogCreateModel, BlogParams, BlogUpdateModel, PostBlogReqBody} from "../types/blogs/input";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogPostValidation, blogPutValidation} from "../middlewares/blog/blogsValidator";
import {OutputBlogType} from "../types/blogs/output";
import {BlogService} from "../domain/blog-service";
import {BlogQueryRepository} from "../repositories/blog-query-repository";


export const blogRoute = Router({});

blogRoute.get('/', async (_req: Request, res: Response<OutputBlogType[]>) => {
    const blogs: OutputBlogType[] = await BlogQueryRepository.getAllBlogs();
    res.send(blogs)
});

blogRoute.get('/:id', async (req: RequestWithParams<BlogParams>, res: Response<OutputBlogType>) => {
    const id: string = req.params.id;
    const blog: OutputBlogType | null = await BlogQueryRepository.getBlogById(id);
    blog ? res.send(blog) : res.sendStatus(404)
});

blogRoute.post('/', authMiddleware, blogPostValidation(), async (req: RequestWithBody<BlogCreateModel>, res: Response<OutputBlogType | null>) => {
    let {name, description, websiteUrl}: PostBlogReqBody = req.body;
    const newBlogId: string = await BlogService.addBlog({name, description, websiteUrl});
    res.status(201).send(await BlogService.getBlogById(newBlogId))
});

blogRoute.put('/:id', authMiddleware, blogPutValidation(), async (req: RequestWithBodyAndParams<BlogParams, BlogUpdateModel>, res: Response) => {
    const id: string = req.params.id;
    const {name, description, websiteUrl}: BlogUpdateModel = req.body;
    const updateResult: boolean = await BlogService.updateBlog({name, description, websiteUrl}, id);
    updateResult ? res.sendStatus(204) : res.sendStatus(404)

});

blogRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<BlogParams>, res: Response) => {
    const id: string = req.params.id;
    const deleteResult: boolean = await BlogService.deleteBlogById(id);
    deleteResult ? res.sendStatus(204) : res.sendStatus(404)
});