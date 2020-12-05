import babelrc from './babelrc'
import gitignore from './gitignore'
import configJson from './config.json.js'

import {map} from "../lib/arrayCombine";

export default {
    '.babelrc': JSON.stringify(babelrc),
    '.gitignore': gitignore,
    configProperties: configJson,
    'config.json': JSON.stringify(map(configJson, prop => prop.default))
}

