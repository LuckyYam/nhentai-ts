export const sites = ['nhentai.to', 'nhentai.net', 'nhentai.xxx'] as const

export const baseURLS = {
    to: 'https://nhentai.to',
    net: 'https://nhentai.net',
    xxx: 'https://nhentai.xxx'
} as const

export const imageSites = {
    to: 'cdn.dogehls.xyz',
    net: /t[357].nhentai.net/,
    xxx: 'cdn.nhentai.xxx'
} as const
