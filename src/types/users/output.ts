export type UserDBType = {
    "login": string
    "email": string
    "password": string
    "createdAt": string
}

export type UserOutputType = {
    "id": string
    "login": string
    "email": string
    "createdAt": string
}

// noinspection JSClassNamingConvention
export type UserWithPaginationOutputType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: UserOutputType[]
}


