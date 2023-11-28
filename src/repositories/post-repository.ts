import {OutputPostType, PostType} from "../types/posts/output";
import {PostUpdateModel} from "../types/posts/input";
import {postCollection} from "../db/db";
import {PostMapper} from "../types/posts/PostMapper";
import {ObjectId, WithId} from "mongodb";
import {isValidObjectId} from "./utils/Objcet(Id)Chek";

export class PostRepository {
    //Возвращает посты переработанные в мапере
    static async getAllPosts(): Promise<OutputPostType[]> {
        const posts: WithId<PostType>[] = await postCollection.find({}).toArray();
        return posts.map(PostMapper)
    }

    //Возвращает пост переработанный в мапере
    static async getPostById(id: string): Promise<OutputPostType | null> {
        try {
            if (!isValidObjectId(id)) {
                throw new Error('id no objectID!');
            }
            const post: WithId<PostType> | null = await postCollection.findOne({_id: new ObjectId(id)});
            return post ? PostMapper(post) : null
        } catch (error) {
            console.log(error);
            return null
        }
    }

    // Возвращает ID созданного поста
    static async addPost(newPost: PostType): Promise<string> {
        const addResult = await postCollection.insertOne(newPost);
        return addResult.insertedId.toString()
    }

    //Возвращает ✅true (пост найден), ❌false (пост не найден)
    static async updatePost(updateParams: PostUpdateModel, id: string): Promise<boolean> {
        try {

            if (!isValidObjectId(id)) {
                throw new Error("id no objectID!");
            }

            const updateResult = await postCollection.updateOne({_id: new ObjectId(id)}, {
                $set: updateParams
            });
            return !!updateResult.matchedCount

        } catch (error) {
            console.log(error);
            return false
        }

    }

    // Возарщает ✅true (пост найден и удален), ❌false (пост не найден)
    static async deletePostById(id: string): Promise<boolean> {
        try {
            if (!isValidObjectId(id)) {
                throw new Error("id no objectID!");
            }
            const deleteResult = await postCollection.deleteOne({_id: new ObjectId(id)});
            return !!deleteResult.deletedCount
        } catch (error) {
            console.log(error);
            return false
        }
    }

    // ⚠️Удаление всех постов для тестов
    static async deleteAll() {
        await postCollection.deleteMany({})
    }
}

