import { CheerioAPI } from 'cheerio'
import { List } from '../lib/Classes/List'
import { baseURLS, imageSites } from '../lib'
import { IList, TURL } from '../Types'

export const parseDoujinList = (
    $: CheerioAPI,
    site: keyof typeof baseURLS
): IList => {
    const data: IList['data'] = []
    const baseURL = baseURLS[site]
    const currentPage = Number($('.pagination').find('.page.current').text())
    const totalPages = Number(
        ($('.pagination').find('a.last').attr('href') || '').split('page=')[1]
    )
    const pagination =
        currentPage === 0
            ? null
            : {
                  currentPage,
                  hasNextPage: totalPages > currentPage,
                  totalPages
              }
    $('.gallery').each((i, el) => {
        const contentElements = $(el).find('a')
        const slug = contentElements.attr('href')
        const id = slug ? slug.split('g/')[1].replace('/', '') : ''
        const url = `${baseURL}/g/${id}` as TURL
        const coverSlug =
            contentElements.find('a > img').attr('data-src') ||
            contentElements.find('a > img').attr('src')
        const cover = coverSlug
            ? `${
                  coverSlug.startsWith('/galleries/')
                      ? 'https://t3.nhentai.net'
                      : ''
              }${coverSlug}`
                  .replace('/g/', '/galleries/')
                  .replace(imageSites[site], 't3.nhentai.net')
            : null
        const title = $(el).find('.caption').text().trim()
        data.push(new List(title, id, cover, url))
    })
    return {
        pagination,
        data
    }
}
