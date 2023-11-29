// noinspection UnnecessaryLocalVariableJS

import {SortData} from "../../../types/blogs/input";

export function constructorFilter(sortData: SortData) {

    // Создаем filter
    let filter: { name: { $regex: string; $options: string } } | {};
    if (sortData.searchNameTerm) {
        filter = {
            name: {
                $regex: sortData.searchNameTerm,
                $options: 'i'
            }
        };
    } else {
        filter = {};
    }

    //Создаем sort
    let descOrAsc: 1 | -1;
    if (sortData.sortDirection === 'asc') {
        descOrAsc = 1
    } else {
        descOrAsc = -1
    }

    const sort = {
        [sortData.sortBy]: descOrAsc
    };

    //Создаем skip
    const skip: number = (+sortData.pageNumber - 1) * sortData.pageSize;
    //Создаем limit
    const limit: number = +sortData.pageSize;

    const methods = {
        filter: filter,
        sort: sort,
        skip: skip,
        limit: limit
    };

    return methods
}