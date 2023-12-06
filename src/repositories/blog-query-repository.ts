import {BlogType, OutputItemsBlogType, OutputBlogType} from "../types/blogs/output";
import {ObjectId, WithId} from "mongodb";
import {blogCollection} from "../db/db";
import {BLogMapper} from "../types/blogs/mapper";
import {isValidObjectId} from "./utils/Objcet(Id)Chek";
import {BlogSortData} from "../types/blogs/input";

import {ConvertedBlogSortData} from "../types/blogs/query";
import {ConstructorFilter} from "./utils/blog-query/constructorFilter";
import {FilterType, SortType} from "../types/Mongo/params";

export class BlogQueryRepository {
    // Возвращает блоги переработанные в мапере, отфильтрованные и разбитые на страницы
    static async getAllBlogs(sortData: BlogSortData): Promise<OutputBlogType> {

        const formattedSortData: ConvertedBlogSortData = {
            searchNameTerm: sortData.searchNameTerm || null,
            sortBy: sortData.sortBy || 'createdAt',
            sortDirection: sortData.sortDirection || 'desc',
            pageNumber: sortData.pageNumber || '1',
            pageSize: sortData.pageSize || '10'
        };

        const findFilter: FilterType | {} = ConstructorFilter.filter_Find(formattedSortData.searchNameTerm);
        const sortFilter: SortType = ConstructorFilter.filter_Sort(formattedSortData.sortBy, formattedSortData.sortDirection);
        const skipFilter: number = ConstructorFilter.filter_Skip(formattedSortData.pageNumber, formattedSortData.pageSize);

        const blogs: WithId<BlogType>[] = await blogCollection
            .find(findFilter)
            .sort(sortFilter)
            .skip(skipFilter)
            .limit(+formattedSortData.pageSize)
            .toArray();

        const totalCount: number = await blogCollection.countDocuments(findFilter);
        const pageCount: number = Math.ceil(totalCount / +formattedSortData.pageSize);

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