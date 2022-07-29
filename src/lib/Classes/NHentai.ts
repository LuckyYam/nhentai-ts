import axios from 'axios'
import { load } from 'cheerio'
import { parseDoujinList, parseDoujinInfo } from '../../Parser'
import { sites } from '../constants'
import { IDoujinInfo, TSite, IList } from '../../Types'

export class NHentai {
    /**
     * Constructs an instance of the NHentai class
     * @param options Options of the NHentai class
     */
    constructor(
        private options: { site: TSite | `https://${TSite}` } = {
            site: 'https://nhentai.to'
        }
    ) {
        if (
            !sites.includes(
                this.options.site
                    .replace('https:', '')
                    .replace(/\//g, '') as TSite
            )
        )
            this.options.site = 'https://nhentai.website'
        if (!this.options.site.startsWith('https://'))
            this.options.site =
                `https://${this.options.site}` as `https://${TSite}`
    }

    /**
     * Gets a random doujin
     * @returns Info of the random doujin
     */
    public getRandom = async (): Promise<IDoujinInfo> =>
        await axios
            .get<string>(`${this.options.site}/random`)
            .then(({ data }) =>
                parseDoujinInfo(
                    load(data),
                    this.options.site.split('nhentai.')[1] as 'to'
                )
            )
            .catch((err) => {
                throw new Error(err.message)
            })

    /**
     * Explores the list of doujin
     * @param page Page number of the list
     * @returns The doujin list
     */
    public explore = async (page: number = 1): Promise<IList> => {
        if (isNaN(page) || page < 1) page = 1
        return await axios
            .get<string>(`${this.options.site}?page=${page}`)
            .then(({ data }) =>
                parseDoujinList(
                    load(data),
                    this.options.site.split('nhentai.')[1] as 'to'
                )
            )
            .catch((err) => {
                throw new Error(err.message)
            })
    }

    /**
     * Searches for a doujin by a query
     * @param query Query of the doujin to search
     * @param options Options for searching
     * @returns The result of the search
     */
    public search = async (
        query: string,
        options?: { page?: number }
    ): Promise<IList> => {
        if (!query)
            throw new Error("The 'query' parameter shouldn't be undefined")
        let page = 1
        if (options?.page && options.page > 0) page = options.page
        return await axios
            .get<string>(`${this.options.site}/search?q=${query}&page=${page}`)
            .then((res) => {
                const results = parseDoujinList(
                    load(res.data),
                    this.options.site.split('nhentai.')[1] as 'to'
                )
                if (!results.data.length)
                    throw new Error('No doujin results found')
                return results
            })
    }

    /**
     * Gets the info of a doujin by its ID
     * @param id ID of the doujin
     * @returns Info of the doujin
     */
    public getDoujin = async (id: string | number): Promise<IDoujinInfo> => {
        if (!id) throw new Error("The 'id' parameter shouldn't be undefined")
        const valid = await this.validate(id)
        if (!valid) throw new Error('Invalid doujin ID')
        return await axios
            .get(`${this.options.site}/g/${id}`)
            .then((res) =>
                parseDoujinInfo(
                    load(res.data),
                    this.options.site.split('nhentai.')[1] as 'to'
                )
            )
            .catch((err) => {
                throw new Error(err.message)
            })
    }

    /**
     * Validates the ID of a doujin
     * @param id ID of the doujin to check
     */
    public validate = (id: string | number): Promise<boolean> =>
        axios
            .get(`${this.options.site}/g/${id}`)
            .then(() => true)
            .catch(() => false)
}
