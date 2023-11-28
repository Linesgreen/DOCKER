import {OutputPostType, PostType} from "../types/posts/output";
import {ObjectId, WithId} from "mongodb";
import {postCollection} from "../db/db";
import {PostMapper} from "../types/posts/PostMapper";
import {isValidObjectId} from "./utils/Objcet(Id)Chek";

export class PostQueryRepository {
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

    // ⚠️Удаление всех постов для тестов
    static async deleteAll() {
        await postCollection.deleteMany({})
    }

}