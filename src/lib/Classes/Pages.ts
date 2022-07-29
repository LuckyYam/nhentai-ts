import PDFDocument from 'pdfkit'
import { tmpdir } from 'os'
import { writeFile, unlink, readFile } from 'fs/promises'
import { createWriteStream } from 'fs'
import axios from 'axios'

export class Pages {
    constructor(public data: string[]) {}

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
        let file = filename
            ? `${filename}${filename.endsWith('.pdf') ? '' : '.pdf'}`
            : `${tmpdir()}/${Math.random().toString(36)}.pdf`
        const stream = createWriteStream(file)
        pdf.pipe(stream)
        for (const url of this.data) {
            const { data } = await axios.get<Buffer>(url, {
                responseType: 'arraybuffer'
            })
            const filename = `${tmpdir()}/${Math.random().toString(36)}.${
                url.includes('jpg') ? 'jpg' : 'png'
            }`
            await writeFile(filename, data)
            const img = (pdf as any).openImage(filename)
            pdf.addPage({ size: [img.width, img.height] })
            pdf.image(img, 0, 0)
            await unlink(filename)
            const index = this.data.indexOf(url)
            if (index === this.data.length - 1) pdf.end()
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
}
