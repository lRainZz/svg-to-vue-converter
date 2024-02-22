#!/usr/bin/env node
import fs from 'fs'
import { FLAGS, printHelp, isFlagPresent, getFlagValue } from './src/flags.js'
import { ensureFolderStructure } from './src/helpers.js'
import SvgConverter from './src/converter.js'

if (isFlagPresent(FLAGS.HELP)) {
    printHelp()
    process.exit(0)
}

// get the directories (cut the trailing slash if present)
const inputDirectory  = getFlagValue(FLAGS.INPUT_DIRECTORY).replace(/\/$/, '')
const outputDirectory = getFlagValue(FLAGS.OUTPUT_DIRECTORY).replace(/\/$/, '')
const backupDirectory = outputDirectory + '/svg'

ensureFolderStructure(inputDirectory, outputDirectory, backupDirectory)

const filesInInputDirectory = fs.readdirSync(inputDirectory)
const svgFiles = filesInInputDirectory.filter(file => file.toLowerCase().endsWith('.svg'))

if (!svgFiles || svgFiles.length === 0) {
    console.log('No SVGs\' to convert' )
    process.exit(0)
}

const svgConverter = new SvgConverter(inputDirectory, outputDirectory, backupDirectory)
// async!
svgConverter.convert(...svgFiles)