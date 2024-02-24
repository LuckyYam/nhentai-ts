export const clean = (x: string[]): string[] => {
    const result: string[] = []
    x.forEach((a) => {
        const text = a.split(/\d/g)[0].trim()
        if (text !== '') result.push(text)
    })
    return result
}
