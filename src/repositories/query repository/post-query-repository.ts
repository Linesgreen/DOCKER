import {OutputItemsPostType, OutputPostType, PostType} from "../../types/posts/output";
import {ObjectId, WithId} from "mongodb";
import {postCollection} from "../../db/db";
import {PostMapper} from "../../types/posts/PostMapper";
import {isValidObjectId} from "../utils/Objcet(Id)Chek";
import {PostSortData} from "../../types/posts/input";
import {SortType} from "../../types/Mongo/params";
import {ConstructorFilter} from "../utils/blog-query/constructorFilter";
import {ConvertedPostSortData} from "../../types/posts/query";


export class PostQueryRepository {
    //Возвращает посты переработанные в мапере
    static async getAllPosts(sortData: PostSortData): Promise<OutputPostType> {
        const formattedSortData: ConvertedPostSortData = {
            sortBy: sortData.sortBy || 'createdAt',
            sortDirection: sortData.sortDirection || 'desc',
            pageNumber: sortData.pageNumber || '1',
            pageSize: sortData.pageSize || '10'
        };
        const sortFilter: SortType = ConstructorFilter.filter_Sort(formattedSortData.sortBy, formattedSortData.sortDirection);
        const skipFilter: number = ConstructorFilter.filter_Skip(formattedSortData.pageNumber, formattedSortData.pageSize);
        const posts: WithId<PostType>[] = await postCollection
            .find({})
            .sort(sortFilter)
            .skip(skipFilter)
            .limit(+formattedSortData.pageSize)
            .toArray();

        const totalCount: number = await postCollection.countDocuments({});
        const pageCount: number = Math.ceil(totalCount / +formattedSortData.pageSize);

        return {
            pagesCount: pageCount,
            page: +formattedSortData.pageNumber,
            pageSize: +formattedSortData.pageSize,
            totalCount: +totalCount,
            items: posts.map(PostMapper)
        }
    }

    //Возвращает пост переработанный в мапере
    static async getPostById(id: string): Promise<OutputItemsPostType | null> {
            const post: WithId<PostType> | null = await postCollection.findOne({_id: new ObjectId(id)});
            return post ? PostMapper(post) : null
    }

    // ⚠️Удаление всех постов для тестов
    static async deleteAll() {
        await postCollection.deleteMany({})
    }

    //Возвращает посты переработанные в мапере, принадлежащие конкретному блогу
    static async getAllPostsInBlog(id: string, sortData: PostSortData): Promise<OutputPostType | null> {
        try {
            if (!isValidObjectId(id)) {
                throw new Error('id no objectID!');
            }
            const formattedSortData: ConvertedPostSortData = {
                sortBy: sortData.sortBy || 'createdAt',
                sortDirection: sortData.sortDirection || 'desc',
                pageNumber: sortData.pageNumber || '1',
                pageSize: sortData.pageSize || '10'
            };

            const sortFilter: SortType = ConstructorFilter.filter_Sort(formattedSortData.sortBy, formattedSortData.sortDirection);
            const skipFilter: number = ConstructorFilter.filter_Skip(formattedSortData.pageNumber, formattedSortData.pageSize);
            const posts: WithId<PostType>[] = await postCollection
                .find({blogId: id})
                .sort(sortFilter)
                .skip(skipFilter)
                .limit(+formattedSortData.pageSize)
                .toArray();

            const totalPostCount: number = await postCollection.countDocuments({blogId: id});
            const pagePostCount: number = Math.ceil(totalPostCount / +formattedSortData.pageSize);
            return {
                pagesCount: pagePostCount,
                page: +formattedSortData.pageNumber,
                pageSize: +formattedSortData.pageSize,
                totalCount: +totalPostCount,
                items: posts.map(PostMapper)
            }


        } catch (e) {
            console.log(e);
            return null
        }


    }

}