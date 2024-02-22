import fs from 'fs'

const ensureFolderStructure = (input, ouput, backup) => {
    try {
        if (!fs.existsSync(input)) {
            console.log('Input directory <' + input + '> does not exist')
            process.exit(1)
        }
        
        if (!fs.existsSync(ouput)) {
            console.log('Input directory <' + ouput + '> does not exist')
            process.exit(1)
        }
        
        if (!fs.existsSync(backup)) {
            fs.mkdirSync(backup)
        }
    } catch (error) {
        console.log(error)
        process.exit(0)
    }
}

export {
    ensureFolderStructure
}