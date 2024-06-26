interface TagList {
    [key: string]: {
        'html': string,
        're': RegExp
    }
}

const TAGS: TagList = {
    'bold': {
        'html': 'b',
        're': /\*\*/,
    },
    'italic': {
        'html': 'i',
        're': /\*/,
    },
    'strikethrough': {
        'html': 's',
        're': /\=/,
    },
    'underline': {
        'html': 'u',
        're': /\_/
    },
}

const PROCESSORDER = ['bold', 'italic', 'strikethrough', 'underline']


const enclose = (string: string, tag: string, classes?: string[]): string => {
    let openTag, closeTag
    if (classes) {
        [openTag, closeTag] = htmlPair(tag, classes)
    } else {
        [openTag, closeTag] = htmlPair(tag)
    }
    return openTag + string + closeTag
}

const htmlPair = (type: string, classes?: string[]): string[] => {
    /* Get an array of an opening html tag and a closing html tag of 
    * given type.
    *
    * Classes can be passed in to go in the open tag. */
    let [open, close] = [`<${type}>`, `</${type}>`]
    if (classes) {
        open = `<${type} class="${classes.join(' ')}">`
    }
    return [open, close]
}

const replaceTags = (string: string, type: string): string => {
    /* Replace PML tags with HTML enclosures. */
    const [open, close] = htmlPair(TAGS[type].html)
    while (string.match(TAGS[type].re) !== null) {
        string = string.replace(TAGS[type].re, open)  // open tag
        string = string.replace(TAGS[type].re, close) // close tag
    }
    return string
}

const convertLineToHtml = (line: string) => {
    for (let i = 0; i < PROCESSORDER.length; i++) {
        const tagToProcess = PROCESSORDER[i]
        line = replaceTags(line, tagToProcess)
    }
    return line
}

// const line = '**This is bold** and *this is italic*. =Strikethough=, and _underline_.'
export { enclose, htmlPair, convertLineToHtml }
