import {BlogType, OutputItemsBlogType, OutputBlogType} from "../types/blogs/output";
import {ObjectId, WithId} from "mongodb";
import {blogCollection} from "../db/db";
import {BLogMapper} from "../types/blogs/mapper";
import {isValidObjectId} from "./utils/Objcet(Id)Chek";
import {GetBlogsSortDataType, SortData} from "../types/blogs/input";
import {constructorFilter} from "./utils/blog-query/constructorFilter";

export class BlogQueryRepository {
    // Возвращает блоги переработанные в мапере
    static async getAllBlogs(sortData: GetBlogsSortDataType): Promise<OutputBlogType> {
        const formattedSortData: SortData = {
            searchNameTerm: sortData.searchNameTerm || null,
            sortBy: sortData.sortBy || 'createdAt',
            sortDirection: sortData.sortDirection || 'desc',
            pageNumber: sortData.pageNumber || 1,
            pageSize: sortData.pageSize || 10
        };

        const mongoMethods = constructorFilter(formattedSortData);

        const blogs: WithId<BlogType>[] = await blogCollection
            .find(mongoMethods.filter)
            .sort(mongoMethods.sort)
            .skip(mongoMethods.skip)
            .limit(mongoMethods.limit)
            .toArray();

        const totalCount = await blogCollection.countDocuments(mongoMethods.filter);
        const pageCount = Math.ceil(totalCount / +formattedSortData.pageSize);
        return {
            pagesCount: pageCount,
            page: +formattedSortData.pageNumber,
            pageSize: +formattedSortData.pageSize,
            totalCount: +totalCount,
            items: blogs.map(BLogMapper)
        }

    }

    // Возвращает блог переработанный в мапере
    static async getBlogById(id: string): Promise<OutputItemsBlogType | null> {
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