# nhentai-ts

[![NPM](https://img.shields.io/badge/Available%20On-NPM-lightgrey.svg?logo=npm&logoColor=339933&labelColor=white&style=flat-square)](https://www.npmjs.com/package/@shineiichijo/nhentai-ts)

Scrap and build a PDF of a doujin from NHentai. [Check the available sites here](https://github.com/LuckyYam/nhentai-ts/blob/master/src/lib/constants.ts#L1).

[Documentation](https://luckyyam.github.io/nhentai-ts/)

---

## Installation
```
yarn add @shineiichijo/nhentai-ts
```

## Note

If you're choosing `nhentai.net` for the site, make sure to follow the following steps (as the site has enabled cloudflare protection):

- Open https://nhentai.net/ in your browser.
- Open Dev Tools and set the User Agent to what you want (you'll need the user agent).
- Reload the site and wait for the clearance of cloudflare (without closing the Dev Tools).
- Save the cookie value from the Network Tab (`cf_clearance` value).

After following all these steps, you are all set. You can also check the [example](#usage-examples) of it (at the first one). Remember, the cookie value expires after 30 minutes of inactivity. So, you might have to do the above steps again (in case you're gonna use it again).

## Usage Examples
```ts
import { NHentai } from '@shineiichijo/nhentai-ts'

const user_agent = 'User Agent'
const cookie_value = 'cf_clearance=abcdefghijklmnopq'
const nhentai = new NHentai({ site: 'nhentai.net', user_agent, cookie_value }) //check above
;(async () => {
    //Explores the home page
    const { data } = await nhentai.explore()
    console.log(data)
})()
```

```ts
import { NHentai } from '@shineiichijo/nhentai-ts'

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
import { NHentai } from '@shineiichijo/nhentai-ts'

const nhentai = new NHentai({ site: 'nhentai.to' }) //configuring a mirror site of the class (you can check the available sites here: https://github.com/LuckyYam/nhentai-ts/blob/master/src/lib/constants.ts#L1)
//validates the ID of a doujin
nhentai.validate('172').then(console.log)
```

```ts
import { NHentai } from '@shineiichijo/nhentai-ts'

const nhentai = new NHentai()
//explores all of the available doujin (homepage)
nhentai.explore(2 /* Page number of exploring the doujin */).then(console.log)
```

```ts
import { NHentai } from '@shineiichijo/nhentai-ts'

const nhentai = new NHentai()
//gets a random doujin with its contents
nhentai.getRandom().then(console.log)
```

```ts
import { NHentai } from '@shineiichijo/nhentai-ts'

const nhentai = new NHentai()
//gets a doujin contents by its ID
nhentai.getDoujin(172).then(console.log)

```

```ts
import { NHentai } from '@shineiichijo/nhentai-ts'

const nhentai = new NHentai()
nhentai.getDoujin('2456').then(
    async (res) =>
        //downloads the pages of a doujin and saves it in a folder
        await res.images.download(
            'nhentai' /* Folder name where the downloaded pages should be saved */
        )
)
```

```ts
import { NHentai } from '@shineiichijo/nhentai-ts'

const nhentai = new NHentai()
nhentai.getRandom().then(
    async (res) =>
        //Builds a zip of doujin pages
        await res.images.zip(
            'nhentai.zip' /* Filname of where the zip should be saved */
        ) //it will return a Buffer if no filename is provided
)
```