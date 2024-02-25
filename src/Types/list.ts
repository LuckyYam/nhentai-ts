import { IPagination, TURL } from '.'
import { List } from '../lib/Classes/List'

export interface IList {
    /** Pagination of the doujin list */
    pagination: IPagination | null
    /** Data of the list */
    data: List[]
}

export interface IListData {
    /** Title of the doujin */
    title: string
    /** ID of the doujin */
    id: string
    /** Cover image URL of the doujin */
    cover: string | null
    /** URL of the doujin */
    url: TURL
}
