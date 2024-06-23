import axios, { AxiosInstance } from 'axios'
import { load } from 'cheerio'

export const clean = (x: string[]): string[] => {
    const result: string[] = []
    x.forEach((a) => {
        const text = a.split(/\d/g)[0].trim()
        if (text !== '') result.push(text)
    })
    return result
}

export const getExtension = (type: string): 'jpg' | 'png' | 'gif' => {
    switch (type) {
        case 'g':
            return 'gif'
        case 'j':
            return 'jpg'
        default:
            return 'png'
    }
}

export const getAPIGalleryPages = async (
    axios: AxiosInstance,
    data: string
): Promise<{ t: string }[]> => {
    const $ = load(data)
    const id = ($('#cover').find('a').attr('href') || 'g/')
        .split('g/')[1]
        .split('/')[0]
    return (
        await axios.get<{ images: { pages: { t: string }[] } }>(
            `https://nhentai.net/api/gallery/${id}`
        )
    ).data.images.pages
}

export const getPageStatus = (url: string): Promise<number> =>
    axios.head(url)
        .then((res: any) => res.status as number)
        .catch((err: any) => (err.response?.status || 500) as number)
