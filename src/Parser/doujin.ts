import { CheerioAPI } from 'cheerio'
import { baseURLS, imageSites, Pages } from '../lib'
import { TURL, IDoujinInfo } from '../Types'

export const parseDoujinInfo = (
    $: CheerioAPI,
    site: keyof typeof baseURLS
): IDoujinInfo => {
    const pages: string[] = []
    $('.thumb-container').each((i, el) => {
        const url = $(el).find('a > img').attr('data-src')
        if (url)
            pages.push(
                url
                    .replace(`${i + 1}t`, `${i + 1}`)
                    .replace(imageSites[site], 'i.nhentai.net')
            )
    })
    const cover =
        $('#cover').find('a > img').attr('data-src') ||
        $('#cover').find('a > img').attr('src')
    const id = ($('#cover').find('a').attr('href') || 'g/')
        .split('g/')[1]
        .split('/')[0]
    const titles = {
        english: $('#info').find('h1').text().trim(),
        original: $('#info').find('h2').text().trim()
    }
    const baseURL = baseURLS[site]
    const parodies: string[] = []
    const characters: string[] = []
    const tags: string[] = []
    const artists: string[] = []
    const groups: string[] = []
    const languages: string[] = []
    const categories: string[] = []
    $('.tag-container.field-name').each((i, el) => {
        const type = $(el).text().trim().toLowerCase()
        const contents: string[] = []
        const push = (field: string[]): void =>
            contents
                .filter((content) => content !== '')
                .forEach((content) => field.push(content))
        $(el)
            .find('.tags')
            .find('a')
            .each((i, el) => {
                contents.push($(el).text().trim().split('\n')[0])
            })
        type.startsWith('parodies')
            ? push(parodies)
            : type.startsWith('characters')
            ? push(characters)
            : type.startsWith('tags')
            ? push(tags)
            : type.startsWith('artists')
            ? push(artists)
            : type.startsWith('groups')
            ? push(groups)
            : type.startsWith('languages')
            ? push(languages)
            : push(categories)
    })
    const url = `${baseURL}/g/${id}` as TURL
    const images = new Pages(pages, titles.english)
    return {
        id,
        title: titles.english,
        originalTitle: titles.original,
        parodies,
        characters,
        tags,
        artists,
        groups,
        languages,
        categories,
        cover: cover ? cover.replace('cdn.dogehls.xyz', 't3.nhentai.net') : null,
        images,
        url
    }
}
