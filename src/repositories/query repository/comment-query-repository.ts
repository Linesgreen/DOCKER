
import {ObjectId, WithId} from "mongodb";
import {commentCollection, postCollection} from "../../db/db";
import {CommentType, OutputCommentType, OutputItemsCommentType} from "../../types/comment/output";
import {CommentMapper} from "../../types/comment/commentMapper";
import {CommentsSortData} from "../../types/comment/input";
import {ConvertedPostSortData} from "../../types/posts/query";
import {ConvertedCommentSortData} from "../../types/comment/query";
import {FilterType, SortType} from "../../types/Mongo/params";
import {ConstructorFilter} from "../utils/blog-query/constructorFilter";
import {PostMapper} from "../../types/posts/PostMapper";


// noinspection UnnecessaryLocalVariableJS
export class CommentQueryRepository {

    //Возвращает коментарии переработанные в мапере
    static async getAllComments() {

        const comments: WithId<CommentType>[] = await commentCollection
            .find({})
            .toArray();

        return comments
    }

    // Получаем коментарий по коммент айд
    static async getCommentById(id: string) : Promise<OutputItemsCommentType | null> {
        const comments: WithId<CommentType> | null = await commentCollection.findOne({_id: new ObjectId(id)});
        return comments ? CommentMapper(comments) : null
    }

    // Получаем коментарии по пост айди
    static async getCommentsByPostId(postId: string, sortData: CommentsSortData): Promise<OutputCommentType | null> {
        const formattedSortData: ConvertedCommentSortData = {
            sortBy: sortData.sortBy || 'createdAt',
            sortDirection: sortData.sortDirection || 'desc',
            pageNumber: sortData.pageNumber || '1',
            pageSize: sortData.pageSize || '10'
        };

        const findFilter = {postId: postId};
        const sortFilter: SortType = ConstructorFilter.filter_Sort(formattedSortData.sortBy, formattedSortData.sortDirection);
        const skipFilter: number = ConstructorFilter.filter_Skip(formattedSortData.pageNumber, formattedSortData.pageSize);

        const comments: WithId<CommentType>[] | null = await commentCollection
            .find(findFilter)
            .sort(sortFilter)
            .skip(skipFilter)
            .limit(+formattedSortData.pageSize)
            .toArray();
        const totalCount: number = await commentCollection.countDocuments(findFilter);
        const pageCount: number = Math.ceil(totalCount / +formattedSortData.pageSize);
        if (comments) {
            return {
                pagesCount: pageCount,
                page: +formattedSortData.pageNumber,
                pageSize: +formattedSortData.pageSize,
                totalCount: +totalCount,
                items: comments.map(CommentMapper)
            }
        }
        return null
    }

    //Полное удаление для тестов
    static async deleteAll() {
        await commentCollection.deleteMany({})
    }

}