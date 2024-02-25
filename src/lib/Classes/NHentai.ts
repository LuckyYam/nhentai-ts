import axios, { AxiosInstance } from 'axios'
import { load } from 'cheerio'
import { CookieJar } from 'tough-cookie'
import { HttpsCookieAgent } from 'http-cookie-agent/http'
import { parseDoujinList, parseDoujinInfo } from '../../Parser'
import { sites } from '../constants'
import { IDoujinInfo, TSite, IList } from '../../Types'
import { getAPIGalleryPages } from '../util'

export class NHentai {
    #axios: AxiosInstance
    /**
     * Constructs an instance of the NHentai class
     * @param _options Options of the NHentai class
     */
    constructor(
        private readonly _options: {
            site: TSite | `https://${TSite}`
            user_agent?: string
            cookie_value?: string
        } = {
            site: 'https://nhentai.to'
        }
    ) {
        this.#axios = axios
        if (
            !sites.includes(
                this._options.site
                    .replace('https:', '')
                    .replace(/\//g, '') as TSite
            )
        )
            this._options.site = 'https://nhentai.to'
        if (!this._options.site.startsWith('https://'))
            this._options.site =
                `https://${this._options.site}` as `https://${TSite}`
        if (
            this._options.site.includes('nhentai.net') &&
            (!this._options.cookie_value || !this._options.user_agent)
        )
            throw new Error(
                `Assign the ${
                    !this._options.cookie_value
                        ? "'cookie_value'"
                        : "'user_agent'"
                } in the instance of the class to use this site.`
            )
        if (this._options.cookie_value) {
            const jar = new CookieJar()
            jar.setCookie(this._options.cookie_value, this._options.site)
            const httpsAgent = new HttpsCookieAgent({ cookies: { jar } })
            this.#axios = axios.create({ httpsAgent })
        }
        if (this._options.user_agent)
            this.#axios.defaults.headers.common['User-Agent'] =
                this._options.user_agent
    }

    /**
     * Gets a random doujin
     * @returns Info of the random doujin
     */
    public getRandom = async (): Promise<IDoujinInfo> =>
        await this.#axios
            .get<string>(`${this._options.site}/random`)
            .then(async ({ data }) =>
                parseDoujinInfo(
                    load(data),
                    this._options.site.split('nhentai.')[1] as 'to',
                    this._options.site.includes('net')
                        ? await getAPIGalleryPages(this.#axios, data)
                        : undefined
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
        return await this.#axios
            .get<string>(`${this._options.site}?page=${page}`)
            .then(({ data }) =>
                parseDoujinList(
                    load(data),
                    this._options.site.split('nhentai.')[1] as 'to'
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
        return await this.#axios
            .get<string>(`${this._options.site}/search?q=${query}&page=${page}`)
            .then((res) => {
                const results = parseDoujinList(
                    load(res.data),
                    this._options.site.split('nhentai.')[1] as 'to'
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
        return await this.#axios
            .get(`${this._options.site}/g/${id}`)
            .then(async (res) =>
                parseDoujinInfo(
                    load(res.data),
                    this._options.site.split('nhentai.')[1] as 'to',
                    this._options.site.includes('net')
                        ? await getAPIGalleryPages(this.#axios, res.data)
                        : undefined
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
        this.#axios
            .get(`${this._options.site}/g/${id}`)
            .then(() => true)
            .catch(() => false)
}
