import {BlogUpdateModel} from "../../types/blogs/input";
import {BlogType} from "../../types/blogs/output";
import {blogCollection} from "../../db/db";
import {ObjectId} from "mongodb";
import {isValidObjectId} from "../utils/Objcet(Id)Chek";


export class BlogRepository {
    // Возвращает id созданного блога
    static async addBlog(newBlog: BlogType): Promise<string> {
        const result = await blogCollection.insertOne(newBlog);
        return result.insertedId.toString()
    }

    // успех ✅true, не успех ❌false
    static async updateBlog(params: BlogUpdateModel, id: string): Promise<boolean> {
        try {
            if (!isValidObjectId(id)) {
                throw new Error('id no objectID!');
            }
            const updateResult = await blogCollection.updateOne({_id: new ObjectId(id)}, {
                $set: {
                    name: params.name,
                    description: params.description,
                    websiteUrl: params.websiteUrl,
                }
            });
            return !!updateResult.matchedCount
        } catch (error) {
            console.log(error);
            return false
        }
    }

    // успех ✅true, не успех ❌false
    static async deleteBlogById(id: string): Promise<boolean> {
        try {
            if (!isValidObjectId(id)) {
                throw new Error('id no objectID!');
            }

            const deleteResult = await blogCollection.deleteOne({_id: new ObjectId(id)});
            return !!deleteResult.deletedCount
        } catch (error) {
            console.log(error);
            return false
        }
    }


}

