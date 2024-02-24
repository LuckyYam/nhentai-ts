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
    if (site === 'xxx') {
        const { length } = $('.main_wrap > ul > li')
        totalPages = Number(
            $(`.main_wrap > ul > li:nth-child(${length - 1})`).text()
        )
        currentPage = Number($('.main_wrap > ul > li.page-item.active').text())
    } else {
        currentPage = Number($('.pagination').find('.page.current').text())
        if (site === 'to') {
            const split = $('.pagination')
                .text()
                .split('\n')
                .filter((el) => Number(el) >= 1)
            totalPages = Number(split[split.length - 1])
        } else
            totalPages = Number(
                ($('.pagination').find('a').last().attr('href') || '').split(
                    '='
                )[1]
            )
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
