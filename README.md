# MangaKakalotScrapper

[![NPM](https://img.shields.io/badge/Available%20On-NPM-lightgrey.svg?logo=npm&logoColor=339933&labelColor=white&style=flat-square)](https://www.npmjs.com/package/nhentai-ts)

Scrap and build a PDF of a doujin from NHentai (only mirror sites, [check the available sites here](https://github.com/LuckyYam/nhentai-ts/blob/master/src/lib/constants.ts#L1)).

[Documentation](https://luckyyam.github.io/nhentai-ts/)

---

## Installation
```
yarn add nhentai-ts
```

## Usage Examples
```ts
import { NHentai } from 'nhentai-ts'

const nhentai = new NHentai()
;(async () => {
    //searches for manga
    const { data } = await nhentai.search('loli' /* title of the doujin to search */, { page: 1 } /* Page of the search */)
    const doujin = data[0]
    //gets the contents of a doujin
    const { images } = await doujin.getContents()
    console.log(images.pages) //pages of the doujin
    //builds a PDF from the doujin pages
    await images.PDF('loli.pdf' /* Filename of where the PDF should be saved */) //will return a Buffer if no filename is provided
})()
```

```ts
import { NHentai } from 'nhentai-ts'

const nhentai = new NHentai({ site: 'nhentai.website' }) //configuring a mirror site of the class (you can check the available sites here: https://github.com/LuckyYam/nhentai-ts/blob/master/src/lib/constants.ts#L1)
//validates the ID of a doujin
nhentai.validate('172').then(console.log)
```

```ts
import { NHentai } from 'nhentai-ts'

const nhentai = new NHentai({ site: 'https://nhentai.xxx' })
//explores all of the available doujin
nhentai.explore(2 /* Page number of exploring the doujin */).then(console.log)
```

```ts
import { NHentai } from 'nhentai-ts'

const nhentai = new NHentai()
//gets a random doujin with its contents
nhentai.getRandom().then(console.log)
```

```ts
import { NHentai } from 'nhentai-ts'

const nhentai = new NHentai()
//gets a doujin contents by its ID
nhentai.getDoujin(172).then(console.log)
```