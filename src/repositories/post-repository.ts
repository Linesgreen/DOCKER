
import {OutputPostType, PostType} from "../types/posts/output";
import {PostCreateModel, PostParams, PostUpdateModel} from "../types/posts/input";
import {BlogRepository} from "./blog-repository";
import {OutputBlogType} from "../types/blogs/output";
import {postCollection} from "../db/db";
import {PostMapper} from "../types/posts/PostMapper";
import {ObjectId, WithId} from "mongodb";

export class PostRepository {
    static async getAllPosts() : Promise<OutputPostType[]> {
        const posts: WithId<PostType>[] = await  postCollection.find({}).toArray()
        return posts.map(PostMapper)
    }

    static async getPostById(id: string) : Promise<OutputPostType | null> {
        const post : WithId<PostType> | null = await postCollection.findOne({_id: new ObjectId(id)})
        return post? PostMapper(post) : null
    }

    static async addPost(params: PostCreateModel) : Promise<string> {
        const blog: OutputBlogType | null = await BlogRepository.getBlogById(params.blogId);
        const newPost : PostType = {
            title: params.title,
            shortDescription: params.shortDescription,
            content: params.content,
            blogId: params.blogId,
            blogName: blog!.name,
            createdAt: new Date().toISOString()
        }

        const addResult = await postCollection.insertOne(newPost)
        return addResult.insertedId.toString()
    }

    static async updatePost(params: PostUpdateModel, id: string): Promise<boolean> {
        const updateResult = await postCollection.updateOne({_id: new ObjectId(id)}, {
            $set : {
                title: params.title,
                shortDescription: params.shortDescription,
                content: params.content,
                blogId: params.blogId
            }
        })
        return !!updateResult.matchedCount
    }

    static async deletePostById(id: string): Promise<boolean> {
        const deleteResult = await postCollection.deleteOne({_id : new ObjectId(id)})
        return !!deleteResult.deletedCount
    }

    static async deleteAll() {
        await postCollection.deleteMany({})
    }

}

