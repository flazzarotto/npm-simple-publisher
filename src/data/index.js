import babelrc from 'babelrc'
import gitignore from '.gitignore.js'
import configJson from './config.json.js'

export default {
    '.babelrc': JSON.stringify(babelrc),
    '.gitignore': gitignore,
    'config.json': JSON.stringify(configJson)
}