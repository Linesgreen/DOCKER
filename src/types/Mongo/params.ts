export type FilterType = {
    $or?: ({
        $regex: string;
        $options: string;
    } | {})[];
};
export type SortType = {
    [key: string]: 1 | -1
}