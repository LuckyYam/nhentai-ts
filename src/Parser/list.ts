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
    let currentPage = 1
    let totalPages = 1
    const pageElements =
        site === 'to'
            ? $('body > section')
            : site === 'xxx'
            ? $('#content > section')
            : $('#fnh > section')
    if (pageElements.find('.page.current').html()) {
        currentPage = Number(pageElements.find('.page.current').text())
        const split = $(pageElements)
            .last()
            .text()
            .split('\n')
            .filter((el) => Number(el) >= 1)
        totalPages = Number(split[split.length - 1])
    }
    const pagination = {
        currentPage,
        hasNextPage: totalPages > currentPage,
        totalPages
    }
    $('.gallery').each((i, el) => {
        const contentElements = $(el).find('a')
        const slug = contentElements.attr('href')
        const id = slug ? slug.split('g/')[1].replace('/', '') : ''
        const url = `${baseURL}/g/${id}` as TURL
        const coverSlug = contentElements.find('img').attr('data-src')
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
