import fs from 'fs'

let version

try {
    version =
        JSON.parse(fs.readFileSync(__dirname + '/../../package.json').toString()).version
}
catch (e) {
    version = '1.0.0'
}

export {version}
