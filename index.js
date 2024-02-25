#!/usr/bin/env node
import fs from 'fs'
import { FLAGS, printHelp, getFlagValue } from './src/flags.js'
import { ensureFolderStructure } from './src/helpers.js'
import SvgConverter from './src/converter.js'

if (getFlagValue(FLAGS.HELP)) {
    printHelp()
    process.exit(0)
}

// get the settings from flags

// get the directories (cut the trailing slash if present)
const INPUT_DIRECTORY  = getFlagValue(FLAGS.INPUT_DIRECTORY).replace(/\/$/, '')
const OUTPUT_DIRECTORY = getFlagValue(FLAGS.OUTPUT_DIRECTORY).replace(/\/$/, '')
const PRINT_AS_IS      = getFlagValue(FLAGS.PRINT_AS_IS)
// will crash if the value is not an int, but that's fine
const TAB_SIZE         = parseInt(getFlagValue(FLAGS.TAB_SIZE), 10)

// set additional options needed
const BACKUP_DIRECTORY = OUTPUT_DIRECTORY + '/svg'

ensureFolderStructure(INPUT_DIRECTORY, OUTPUT_DIRECTORY, BACKUP_DIRECTORY)

const filesInInputDirectory = fs.readdirSync(INPUT_DIRECTORY)
const svgFiles = filesInInputDirectory.filter(file => file.toLowerCase().endsWith('.svg'))

if (!svgFiles || svgFiles.length === 0) {
    console.log('No SVGs\' to convert' )
    process.exit(0)
}

const converterOptions = {
    printAsIs: PRINT_AS_IS,
    tabSize:   TAB_SIZE
}
const svgConverter = new SvgConverter(INPUT_DIRECTORY, OUTPUT_DIRECTORY, BACKUP_DIRECTORY, converterOptions)
// async!
svgConverter.convert(...svgFiles)