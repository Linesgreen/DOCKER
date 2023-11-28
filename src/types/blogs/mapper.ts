import {WithId} from "mongodb";
import {BlogType, OutputBlogType} from "./output";

export const BLogMapper = (blog: WithId<BlogType>): OutputBlogType => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
};