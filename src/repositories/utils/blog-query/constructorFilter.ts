// noinspection UnnecessaryLocalVariableJS,FunctionNamingConventionJS

import {FilterType, SortType} from "../../../types/Mongo/params";

export class ConstructorFilter {
    //создаем фильтр
    static filter_Find_NameTerm(searchEl: string | null): FilterType | {} {
        return searchEl ? {
            name: {
                $regex: searchEl,
                $options: 'i'
            }
        } : {}
    }
    static filter_Find_EmailAndLoginTerm(email: string | null, login: string | null): FilterType {
        let filter: FilterType = {};
        if (email) {
            filter['email'] = {
                $regex: email,
                $options: 'i'
            };
        }
        if (login) {
            filter['login'] = {
                $regex: login,
                $options: 'i'
            };
        }
        return filter;
    }


    static filter_Sort(sortBy: string, sortDirection: string | undefined): SortType {
        if (sortDirection === 'asc') {
            return {
                [sortBy]: 1
            }
        }
        return {
            [sortBy]: -1
        }
    }

    static filter_Skip(pageNumber: string, pageSize: string): number {
        const skip: number = (+pageNumber - 1) * +pageSize;
        return skip
    }
}

