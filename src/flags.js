class Flag {
    /**
     * 
     * @param {string[]} id 
     * @param {string} defaultValue
     */ 
    constructor(id, hasValue, defaultValue = null) {
        this.id           = id
        this.hasValue     = hasValue
        this.defaultValue = defaultValue
    }
}

const FLAGS = {
    HELP: new Flag(['-h', '--help'], false),
    INPUT_DIRECTORY: new Flag(['-i', '--input-directory'], true, '.'),
    OUTPUT_DIRECTORY: new Flag(['-o', '--output-directory'], true, '.')
}

/**
 * 
 * @param {Flag} flag to get
 */
const isFlagPresent = (flag) => {
    return flag.id.find(id => process.argv.indexOf(id) !== -1)
}

/**
 * 
 * @param {Flag} flag to get
 */
const getFlagValue = (flag) => {
    if (!flag.hasValue) return null
    
    let indexOfFlag = null

    const isPresent = flag.id.find(id => {
        const index = process.argv.indexOf(id)
        if (index === -1) return false
        indexOfFlag = index
        return true
    })

    let value

    if (isPresent) {
        value = process.argv[indexOfFlag + 1]
    }

    if (!value && !flag.defaultValue) {
        return printHelp()
    }

    return value || flag.defaultValue
}


const printHelp = () => {
    console.log(`
        NAME
            svg-to-vue-converter

        SYNOPSIS
            svg-to-vue-converter [OPTIONS]...

        DESCRIPTION:
            Converts SVGs' to vue components and replaces 'fill' and 'stroke' porperties
            with 'currentColor' for an easier use in vue projects. Does not work well with
            multicolor SVGs'! By Default it takes the SVGs' in the current folder and replaces
            them with its' generated Vue counterparts -> SVGs' will be backed up.

            -h, --help
                display this help

            -i, --input-directory [PATH]
                directory to take the SVGs' from,
                defaults to the current directory '.'
            
            -o, --output-directory [PATH]
                directory to store the generated Vue components,
                defaults to the current directory '.',
                an 'svg' backup folder will be created inside the output folder

    `)
}

export {
    FLAGS,
    isFlagPresent,
    getFlagValue,
    printHelp
}