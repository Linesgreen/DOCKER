import {OutputPostType, PostType} from "../types/posts/output";
import {PostCreateModel, PostUpdateModel} from "../types/posts/input";
import {OutputBlogType} from "../types/blogs/output";
import {PostRepository} from "../repositories/post-repository";
import {BlogService} from "./blog-service";
import {PostQueryRepository} from "../repositories/post-query-repository";

export class PostService {
    //Возвращает посты переработанные в мапере
    static async getAllPosts(): Promise<OutputPostType[]> {
        return PostQueryRepository.getAllPosts()
    }

    //Возвращает пост переработанный в мапере
    static async getPostById(id: string): Promise<OutputPostType | null> {
        return PostQueryRepository.getPostById(id)
    }

    // Возвращает ID созданного поста
    static async addPost(params: PostCreateModel): Promise<string> {
        const blog: OutputBlogType | null = await BlogService.getBlogById(params.blogId);
        const newPost: PostType = {
            title: params.title,
            shortDescription: params.shortDescription,
            content: params.content,
            blogId: params.blogId,
            blogName: blog!.name,
            createdAt: new Date().toISOString()
        };
        return PostRepository.addPost(newPost)
    }

    //Возвращает ✅true (пост найден), ❌false (пост не найден)
    static async updatePost(params: PostUpdateModel, id: string): Promise<boolean> {
        const updateParams: PostUpdateModel = {
            title: params.title,
            shortDescription: params.shortDescription,
            content: params.content,
            blogId: params.blogId
        };
        return await PostRepository.updatePost(updateParams, id)
    }

    // Возарщает ✅true (пост найден и удален), ❌false (пост не найден)
    static async deletePostById(id: string): Promise<boolean> {
        return await PostRepository.deletePostById(id)
    }
}

