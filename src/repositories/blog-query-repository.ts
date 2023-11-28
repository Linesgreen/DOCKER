import {BlogType, OutputBlogType} from "../types/blogs/output";
import {ObjectId, WithId} from "mongodb";
import {blogCollection} from "../db/db";
import {BLogMapper} from "../types/blogs/mapper";
import {isValidObjectId} from "./utils/Objcet(Id)Chek";

export class BlogQueryRepository {
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

    // ⚠️Удаление всех блогов для тестов
    static async deleteAll() {
        await blogCollection.deleteMany({})
    }
}