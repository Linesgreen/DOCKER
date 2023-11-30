import {OutputItemsPostType, PostType} from "../types/posts/output";
import {PostCreateModel, PostSortData, PostUpdateModel} from "../types/posts/input";
import {OutputItemsBlogType} from "../types/blogs/output";
import {PostRepository} from "../repositories/post-repository";
import {BlogService} from "./blog-service";
import {PostQueryRepository} from "../repositories/post-query-repository";
import {BlogQueryRepository} from "../repositories/blog-query-repository";

export class PostService {
    //Возвращает посты переработанные в мапере
    static async getAllPosts(): Promise<OutputItemsPostType[]> {
        return await PostQueryRepository.getAllPosts()
    }

    //Возвращает пост переработанный в мапере
    static async getPostById(id: string): Promise<OutputItemsPostType | null> {
        return await PostQueryRepository.getPostById(id)
    }

    // Возвращает ID созданного поста
    static async addPost(params: PostCreateModel): Promise<string> {
        const blog: OutputItemsBlogType | null = await BlogQueryRepository.getBlogById(params.blogId);
        const newPost: PostType = {
            /*id присваивает БД */
            title: params.title,
            shortDescription: params.shortDescription,
            content: params.content,
            blogId: params.blogId,
            blogName: blog!.name,
            createdAt: new Date().toISOString()
        };
        return await PostRepository.addPost(newPost)
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

