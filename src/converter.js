import fs from 'fs'
import prettier from 'prettier'

class SvgConverter {
    constructor(inputDirectory, ouputDirectory, backupDirectory, { printAsIs = false, tabSize = 4 }) {
        this.inputDirectory  = inputDirectory
        this.ouputDirectory  = ouputDirectory
        this.backupDirectory = backupDirectory
        this.printAsIs       = printAsIs
        this.tabSize         = tabSize
    }

    convert = async (...svgNames) => {
        for (const svgName of svgNames) {
            const svgContent        = this._readSvg(svgName)
            const svgContentUpdated = this._replaceFillAndStroke(svgContent)
            const vueComponent      = await this._convertToVueComponent(svgContentUpdated)

            const componentName = this._convertSvgNameToVueComponentName(svgName)

            this._writeVueComponent(componentName, vueComponent)
            this._backupSvg(svgName)
        }
    }

    _readSvg = (svgName) => {
        return fs.readFileSync(this.inputDirectory + '/' + svgName, 'utf8')
    }

    _replaceFillAndStroke = (svgString) => {
        // 1. we need to replace all 'stroke' and 'fill' properties
        // -> BUT ONLY IF THEY ARE NOT SET TO 'none'!
        // e.g. stroke="#fff" fill="none" -> stroke="currentColor" fill="none"
        // regex:
        //  'fill="' matches the literal string '"fill='
        //  '((?!none)\S)+' matches one or more '(+)' non-whitespace characters '(\S)'
        //   that are not preceeded by "none" using a negative lookahead '((?!none))'
        svgString = svgString.replaceAll(/fill="((?!none)\S)+"/g, 'fill="currentColor"')
        svgString = svgString.replaceAll(/stroke="((?!none)\S)+"/g, 'stroke="currentColor"')

        // 2. edge case: fill and stroke are set in the 'style' tag
        // -> replace them inside the style tag
        // -> BUT ONLY IF THEY ARE NOT SET TO 'none'!
        // e.g. style="fill:#fff;stroke:none;" -> style="fill:curentColor;stroke:none;"
        // since the style tag can contain more properties, we need to rely on the syntax of the
        // fill/stroke properties
        // regex:
        //  'fill:' matches the literal string 'fill:'
        //  (?!none)[^;]+ matches one more '(+)' characters not '(^)' one of '(;)' '([^;])'
        //  that are not preceeded by "none" using a negative lookahead '((?!none))'
        svgString = svgString.replaceAll(/fill:(?!none)[^;]+;/g, 'fill:currentColor;')
        svgString = svgString.replaceAll(/stroke:(?!none)[^;]+;/g, 'stroke:currentColor;')

        return svgString
    }

    _convertToVueComponent = async (svgString) => {
        // trim whitespaces and linebreaks from the beginning and the end of the string
        svgString = svgString.trim().replace(/^\n*/, '').replace(/\n*$/, '')

        let componentString = '<template>\n'
        componentString += ' '.repeat(this.tabSize) + svgString
        componentString += '\n</template>'

        if (this.printAsIs) return componentString

        // sanitize double linebreaks with only whitespace on between
        // -> mostly fixes empty lines before the closing tag if the original svg
        //    had an extra linebreak before the eof
        componentString = componentString.replace(/\n\s*\n/g)
        return prettier.format(componentString, { parser: 'html', tabWidth: this.tabSize, useTabs: false })
    }

    _backupSvg = (svgName) => {
        const filePath   = this.inputDirectory + '/' + svgName
        const backupPath = this.backupDirectory + '/' + svgName
        return fs.renameSync(filePath, backupPath)
    }

    _convertSvgNameToVueComponentName = (svgFileName) => {
        // try to sanitize the SVG name so it can be used as vue component name
        // 1. Cut away file ending
        const nameOnly = svgFileName.replace(/\.svg$/, '')

        // 2. convert to pacal case
        // replace hyphen and underscrore with whitespaces to split words
        let pascalCaseName = nameOnly.replace(/[-_]+/g, ' ')
        // remove everything that is not a word or a whitespace character
        pascalCaseName = pascalCaseName.replace(/[^\w\s]/g, '')
        // split the words into two groups $1 first letter of the word, $2 rest of the word
        // $0 contains the whole word, so we ingore that
        pascalCaseName = pascalCaseName.replace(/\s+(.)(\w*)/g, ($1, $2, $3) => {
            // transform the first letter of each word to uppercase
            return `${$2.toUpperCase() + $3}`
        })
        // transform the very first letter to uppercase
        pascalCaseName = pascalCaseName.replace(/\w/, s => s.toUpperCase())

        return pascalCaseName + '.vue'
    }

    _writeVueComponent = (componentName, componentString) => {
        const filePath = this.ouputDirectory + '/' + componentName
        return fs.writeFileSync(filePath, componentString)
    }
}



export default SvgConverter