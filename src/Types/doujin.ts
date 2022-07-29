import { IListData } from '.'
import { Pages } from '../lib'

export interface IDoujinInfo extends IListData {
    /** Original title of the doujin */
    originalTitle: string
    /** Parodies of the doujin */
    parodies: string[]
    /** Tagged characters of the doujin */
    characters: string[]
    /** Tags of the doujin */
    tags: string[]
    /** Artists of the doujin */
    artists: string[]
    /** Groups of the doujin */
    groups: string[]
    /** Languages of the doujin */
    languages: string[]
    /** Categories of the doujin */
    categories: string[]
    /** Pages of the doujin */
    pages: Pages
}
