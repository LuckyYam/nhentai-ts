import PDFDocument from 'pdfkit'
import { tmpdir } from 'os'
import { writeFile, unlink, readFile, mkdir, stat } from 'fs/promises'
import { createWriteStream, existsSync } from 'fs'
import axios from 'axios'
import JSZip from 'jszip'
import { join } from 'path'

export class Pages {
    #title: string
    /**
     *
     * @param pages An array of URLS of the doujin pages
     */
    constructor(public pages: string[], __title: string) {
        this.#title = __title
    }

    /**
     * Builds a PDF from the doujin pages
     * @returns Buffer of the PDF
     */
    public async PDF(): Promise<Buffer>
    /**
     * Builds a PDF from the doujin pages
     * @param filename Filename of the PDF
     * @returns The filename where the PDF is saved
     */
    public async PDF(filename: string): Promise<string>
    public async PDF(filename?: string): Promise<Buffer | string> {
        const pdf = new PDFDocument({ autoFirstPage: false })
        const file = filename
            ? `${filename}${filename.endsWith('.pdf') ? '' : '.pdf'}`
            : `${tmpdir()}/${Math.random().toString(36)}.pdf`
        const stream = createWriteStream(file)
        pdf.pipe(stream)
        for (const url of this.pages) {
            const { data } = await axios.get<Buffer>(url, {
                headers: url.includes('cdn.dogehls.xyz') ? { 'Referer': 'https://nhentai.to' } : {},
                responseType: 'arraybuffer'
            })
            const img = (pdf as any).openImage(data)
            pdf.addPage({ size: [img.width, img.height] })
            pdf.image(img, 0, 0)
            const index = this.pages.indexOf(url)
            if (index === this.pages.length - 1) pdf.end()
        }
        await new Promise((resolve, reject) => {
            stream.on('finish', () => resolve(file))
            stream.on('error', reject)
        })
        if (filename) return file
        const buffer = await readFile(file)
        await unlink(file)
        return buffer
    }

    /**
     * Builds a zip of doujin pages
     * @returns Buffer of the result zip
     */
    public async zip(): Promise<Buffer>
    /**
     * Builds a zip of doujin pages and saves it locally
     * @param filename Filename of the zip where it should be saved
     * @returns The filename of the saved zip
     */
    public async zip(filename: string): Promise<string>
    public async zip(filename?: string): Promise<Buffer | string> {
        const zip = new JSZip()
        const folder = zip.folder(this.#title)
        for (const url of this.pages)
            folder.file(
                `${this.pages.indexOf(url) + 1}.${
                    url.split('.')[url.split('.').length - 1]
                }`,
                (await axios.get<Buffer>(url, {
                    headers: url.includes('cdn.dogehls.xyz') ? { 'Referer': 'https://nhentai.to' } : {},
                    responseType: 'arraybuffer'
                })).data,
                { binary: true }
            )
        const buffer = await zip.generateAsync({ type: 'nodebuffer' })
        if (filename) {
            await writeFile(
                `${filename}${filename.endsWith('.zip') ? '' : '.zip'}`,
                buffer
            )
            return `${filename}${filename.endsWith('.zip') ? '' : '.zip'}`
        }
        return buffer
    }

    /**
     * Downloads the pages of a doujin and saves all of it in a folder
     * @param folderName The name of the folder in which all of the pages should be saved
     */
    public async download(folderName: string): Promise<void> {
        if (!folderName)
            throw new Error(
                'No folder name provided to save the downloaded doujin pages'
            )
        if (!existsSync(folderName))
            await mkdir(folderName, { recursive: true })
        const isDirectory = (await stat(folderName)).isDirectory()
        if (!isDirectory)
            throw new Error(
                'Expected a directory for saving the downloads, but recieved a file.'
            )
        for (const url of this.pages)
            await writeFile(
                join(
                    folderName,
                    `${this.pages.indexOf(url) + 1}.${
                        url.split('.')[url.split('.').length - 1]
                    }`
                ),
                (
                    await axios.get<Buffer>(url, {
                        responseType: 'arraybuffer'
                    })
                ).data
            )
    }
}
