import {Router, Response, Request} from "express";
import {BlogRepository} from "../repositories/blog-repository";
import {RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "../types/common";
import {BlogCreateModel, BlogParams, BlogUpdateModel, PostBlogReqBody} from "../types/blogs/input";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogPostValidation, blogPutValidation} from "../middlewares/blog/blogsValidator";
import {OutputBlogType} from "../types/blogs/output";


export const blogRoute = Router ({})

blogRoute.get('/', async (req:Request, res:Response<OutputBlogType[]>) => {
    const blogs : OutputBlogType[] = await BlogRepository.getAllBlogs()
    res.send(blogs)
})
blogRoute.get('/:id',async (req:RequestWithParams<BlogParams>, res:Response<OutputBlogType> ) => {
    const id : string  = req.params.id
    const blog : OutputBlogType | null =  await BlogRepository.getBlogById(id)
    blog? res.send(blog) : res.sendStatus(404)
})



blogRoute.post('/', authMiddleware,blogPostValidation(), async (req:RequestWithBody<BlogCreateModel>, res:Response<OutputBlogType | null> ) => {
    let {name, description, websiteUrl} : PostBlogReqBody = req.body;
    const newBlogId : string = await BlogRepository.addBlog({name, description, websiteUrl})
    res.status(201).send(await BlogRepository.getBlogById(newBlogId))

})

blogRoute.put('/:id',authMiddleware,blogPutValidation(), async (req: RequestWithBodyAndParams<BlogParams, BlogUpdateModel>, res:Response )=> {
    const id : string = req.params.id;
    const {name, description, websiteUrl} : BlogUpdateModel = req.body;
    const updateResult : boolean = await BlogRepository.updateBlog({name, description, websiteUrl}, id)
    updateResult ? res.sendStatus(204) : res.sendStatus(404)

})

blogRoute.delete('/:id', authMiddleware,async (req: RequestWithParams<BlogParams>, res: Response) => {
    const id: string = req.params.id
    const deleteResult: boolean = await BlogRepository.deleteBlogById(id)
    deleteResult ? res.sendStatus(204) : res.sendStatus(404)
})