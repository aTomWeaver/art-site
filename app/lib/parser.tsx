import { readFileSync, writeFileSync } from 'fs'
import { convertLineToHtml, enclose } from './html'

export interface MetaData {
    [key: string]: string
}

export interface StanzaDict {
    [key: number]: {
        'classes': string[],
        'lines': string[]
    }
}

interface StanzaDelimDict {
    [key: string]: string
}

const STANZATAGS: StanzaDelimDict = {
    '---': 'left',
    '|--': 'left',
    '-|-': 'center',
    '--|': 'right',
}

class File {
    lines: Array<string>
    rlines: Array<string>  // backwards array to then uses .pop()
    raw: string
    meta: MetaData

    constructor(path: string) {
        this.raw = readFileSync(path, "utf-8");
        this.lines = this.raw.toString().split('\n').filter((line) => line !== '')
        this.rlines = [...this.lines].reverse()  // used to pop lines
        this.meta = this.setMeta()
        this.lines = this.rlines.reverse()
    }

    readLine(): any {
        // pops next line in file
        if (this.rlines.length > 0) {
            return this.rlines.pop()
        } else {
            return null;
        }
    }

    private setMeta(): MetaData {
        // pops metadata from file, leaving rlines with just content
        // TODO: properly format meta into Object
        let inMeta = false
        let metadata: string[] = []
        while (!inMeta) {
            let line = this.readLine()
            if (line.startsWith("===")) {
                inMeta = true;
                break
            }
        }
        while (inMeta) {
            let line = this.readLine()
            if (line.startsWith("===")) {
                inMeta = false;
                break
            } else {
                metadata.push(line)
            }
        }
        return this.parseMeta(metadata)
    }

    private parseMeta(metaList: string[]): MetaData {
        let meta: MetaData = {}
        for (let i = 0; i < metaList.length; i++) {
            let [key, val] = metaList[i].split(':')
            key = key.trim().toLowerCase()
            val = val.trim()
            meta[key] = val
        }
        return meta
    } 
}

const convertToStanzaDict = (lines: string[]): StanzaDict => {
    let stanzas: StanzaDict = {}
    let stanzaNum = 0;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const stanzaTag = line.trim().slice(0, 3)
        if (stanzaTag in STANZATAGS) { // should be startswith and should allow alignment
            let classList: string[]
            if (line.trim().slice(3) !== '') {
                classList = line.trim().slice(3).split(' ')
            } else {
                classList = []
            }
            stanzaNum += 1
            stanzas[stanzaNum] = {
                'lines': [],
                'classes': []
            }
            stanzas[stanzaNum].classes = ['stanza', `align-${STANZATAGS[stanzaTag]}`]
            stanzas[stanzaNum].classes.push(...classList)
        } else {
            const htmlLine = convertLineToHtml(line)
            stanzas[stanzaNum].lines.push(htmlLine)
        }
    }
    return stanzas
}

// React Version //
//

export const getMetaAndContent = (path: string):[MetaData, StanzaDict] => {
    const file = new File(path);
    const meta: MetaData = file.meta
    const content: StanzaDict = convertToStanzaDict(file.lines);
    return [meta, content]
}
