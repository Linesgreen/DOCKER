import {BlogUpdateModel, PostBlogReqBody} from "../types/blogs/input";
import {BlogType, OutputItemsBlogType} from "../types/blogs/output";
import {BlogRepository} from "../repositories/blog-repository";
import {BlogQueryRepository} from "../repositories/blog-query-repository";
import {PostToBlogCreateModel} from "../types/posts/input";
import {PostType} from "../types/posts/output";
import {PostRepository} from "../repositories/post-repository";


export class BlogService {

    // Возвращает id созданного блога
    static async addBlog(params: PostBlogReqBody): Promise<string> {
        const newBlog: BlogType = {
            createdAt: new Date().toISOString(),
            name: params.name,
            description: params.description,
            websiteUrl: params.websiteUrl,
            isMembership: false

        };
        return await BlogRepository.addBlog(newBlog);
    }

    // Возвращает id созданного блога
    static async addPostToBlog(id: string, postData: PostToBlogCreateModel): Promise<string | null> {
        const blog: OutputItemsBlogType | null = await BlogQueryRepository.getBlogById(id);
        if (!blog) {
            return null
        }
        const newPost: PostType = {
            /*id присваивает БД */
            title: postData.title,
            shortDescription: postData.shortDescription,
            content: postData.content,
            blogId: blog.id,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        };

        return await PostRepository.addPost(newPost)
    }

    // успех ✅true, не успех ❌false
    static async updateBlog(params: BlogUpdateModel, id: string): Promise<boolean> {
        return await BlogRepository.updateBlog(params, id)
    }

    // успех ✅true, не успех ❌false
    static async deleteBlogById(id: string): Promise<boolean> {
        return await BlogRepository.deleteBlogById(id)
    }
}
