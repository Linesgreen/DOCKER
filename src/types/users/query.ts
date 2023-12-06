export type ConvertedUserSortData = {
    searchEmailTerm: string | null
    searchLoginTerm: string | null
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: string
    pageSize: string
}