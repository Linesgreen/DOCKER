// noinspection AnonymousFunctionJS,MagicNumberJS

import {Router, Response} from "express";
import {
    RequestWithBody,
    RequestWithBodyAndParams,
    RequestWithParams,
    RequestWithQuery,
    RequestWithQueryParams
} from "../types/common";
import {
    BlogCreateModel,
    BlogParams,
    BlogUpdateModel,
    BlogSortData,
    PostBlogReqBody, BlogsWithIdSortData
} from "../types/blogs/input";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogPostValidation, blogPutValidation} from "../middlewares/blog/blogsValidator";
import {OutputItemsBlogType, OutputBlogType} from "../types/blogs/output";
import {BlogService} from "../domain/blog-service";
import {BlogQueryRepository} from "../repositories/blog-query-repository";

export const blogRoute = Router({});

blogRoute.get('/', async (req: RequestWithQuery<BlogSortData>, res: Response<OutputBlogType>) => {
    const sortData: BlogSortData = {
        searchNameTerm: req.query.searchNameTerm,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize
    };

    const blogs: OutputBlogType = await BlogQueryRepository.getAllBlogs(sortData);
    res.send(blogs)
});

blogRoute.get('/:id', async (req: RequestWithQueryParams<BlogParams, BlogsWithIdSortData>, res: Response<OutputItemsBlogType>) => {
    const id: string = req.params.id;
    const sortData: BlogsWithIdSortData = {
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection
    };

    const blog: OutputItemsBlogType | null = await BlogQueryRepository.getBlogById(id, sortData);
    blog ? res.send(blog) : res.sendStatus(404)
});

blogRoute.post('/', authMiddleware, blogPostValidation(), async (req: RequestWithBody<BlogCreateModel>, res: Response<OutputItemsBlogType | null>) => {
    let {name, description, websiteUrl}: PostBlogReqBody = req.body;
    const newBlogId: string = await BlogService.addBlog({name, description, websiteUrl});
    res.status(201).send(await BlogQueryRepository.getBlogById(newBlogId))
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