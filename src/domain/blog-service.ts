import {BlogUpdateModel, PostBlogReqBody} from "../types/blogs/input";
import {BlogType, OutputItemsBlogType} from "../types/blogs/output";
import {BlogRepository} from "../repositories/blog-repository";
import {BlogQueryRepository} from "../repositories/blog-query-repository";


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

    // успех ✅true, не успех ❌false
    static async updateBlog(params: BlogUpdateModel, id: string): Promise<boolean> {
        return BlogRepository.updateBlog(params, id)
    }

    // успех ✅true, не успех ❌false
    static async deleteBlogById(id: string): Promise<boolean> {
        return BlogRepository.deleteBlogById(id)
    }
}
