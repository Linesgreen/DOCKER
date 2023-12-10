import {BlogUpdateModel} from "../../types/blogs/input";
import {BlogType} from "../../types/blogs/output";
import {blogCollection} from "../../db/db";
import {ObjectId} from "mongodb";


export class BlogRepository {
    // Возвращает id созданного блога
    static async addBlog(newBlog: BlogType): Promise<string> {
        const result = await blogCollection.insertOne(newBlog);
        return result.insertedId.toString()
    }

    // успех ✅true, не успех ❌false
    static async updateBlog(params: BlogUpdateModel, id: string): Promise<boolean> {
        const updateResult = await blogCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: params.name,
                description: params.description,
                websiteUrl: params.websiteUrl,
            }
        });
        return !!updateResult.matchedCount
    }

    // успех ✅true, не успех ❌false
    static async deleteBlogById(id: string): Promise<boolean> {

        const deleteResult = await blogCollection.deleteOne({_id: new ObjectId(id)});
        return !!deleteResult.deletedCount

    }
}

