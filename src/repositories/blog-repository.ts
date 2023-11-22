
import {BlogUpdateModel, PostBlogReqBody} from "../types/blogs/input";
import {BlogType, OutputBlogType} from "../types/blogs/output";
import {blogCollection} from "../db/db";
import {ObjectId, WithId} from "mongodb";
import {BLogMapper} from "../types/blogs/mapper";


export class BlogRepository {
    static async getAllBlogs(): Promise<OutputBlogType[]>{
        const blogs: WithId<BlogType>[] = await blogCollection.find({}).toArray()
        return blogs.map(BLogMapper)
    }

    static async getBlogById (id : string): Promise<OutputBlogType | null >  {
        const blog:  WithId<BlogType> | null   = await blogCollection.findOne({_id: new ObjectId(id)})
        return  blog? BLogMapper(blog) :  null

    }

    static async addBlog (params : PostBlogReqBody): Promise<string>  {
        const newBlog : BlogType = {
            createdAt: new Date().toISOString(),
            name: params.name,
            description: params.description,
            websiteUrl: params.websiteUrl,
            isMembership: true

        }
        const result = await blogCollection.insertOne(newBlog)

        return result.insertedId.toString()

    }


    // успех true, не успех false
    static async updateBlog(params : BlogUpdateModel, id : string) : Promise<boolean>  {
        const updateResult =await blogCollection.updateOne({_id: new ObjectId(id)}, {
            $set : {
                name: params.name,
                description: params.description,
                websiteUrl:params.websiteUrl,
            }
        })

        return !!updateResult.matchedCount


    }

    static async deleteBlogById(id : string): Promise<boolean> {
        const deleteResult = await blogCollection.deleteOne({_id: new ObjectId(id)})
        return !!deleteResult.deletedCount
    }


    static async deleteAll() {
        await blogCollection.deleteMany({})
    }

}