import {BlogUpdateModel} from "../types/blogs/input";
import {BlogType, OutputBlogType} from "../types/blogs/output";
import {blogCollection} from "../db/db";
import {ObjectId, WithId} from "mongodb";
import {BLogMapper} from "../types/blogs/mapper";
import {isValidObjectId} from "./utils/Objcet(Id)Chek";


export class BlogRepository {
    // Возвращает блоги переработанные в мапере
    static async getAllBlogs(): Promise<OutputBlogType[]> {
        const blogs: WithId<BlogType>[] = await blogCollection.find({}).toArray();
        return blogs.map(BLogMapper)
    }

    // Возвращает блог переработанный в мапере
    static async getBlogById(id: string): Promise<OutputBlogType | null> {
        try {
            if (!isValidObjectId(id)) {
                throw new Error('id no objectID!');
            }

            const blog: WithId<BlogType> | null = await blogCollection.findOne({_id: new ObjectId(id)});
            return blog ? BLogMapper(blog) : null
        } catch (error) {
            console.log(error);
            return null
        }

    }

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

    // ⚠️Удаление всех блогов для тестов
    static async deleteAll() {
        await blogCollection.deleteMany({})
    }

}
