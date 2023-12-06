export type FilterType = {
    [key: string]: {
        $regex: RegExp | string;
        $options: string;
    } | {};
};

export type SortType = {
    [key: string]: 1 | -1
}