import fs from "fs";

export const packageOptions = []

export const packageMod = {
    mod: 'package',
    description: 'Generate package.json from config.local.json',
    options: packageOptions
}

export function package(dir, args) {
    if (!fs.lstatSync('package.json').isFile()) {
        throw new Error('This seems not to be a project directory, `package.json` file is missing.')
    }

    console.info('Adding package.json settings')

    let packageJsonData
    try {
        packageJsonData = fs.readFileSync('package.json').toString()
    } catch (e) {
        console.warn('Creating a new package.json')
        packageJsonData = '{}'
    }

    let nspData = {
        ...JSON.parse(fs.readFileSync(dir + '/../data/config.json').toString()),
        ...JSON.parse(fs.readFileSync('config.local.json').toString())
    }

    packageJsonData = {
        ...JSON.parse(packageJsonData),
        name: nspData.NSP_PACKAGE_NAME,
        version: nspData.NSP_PACKAGE_VERSION,
        description: nspData.NSP_PACKAGE_DESCRIPTION,
        author: nspData.NSP_USERNAME,
        main: './dist/' + nspData.NSP_APP_ENTRY_POINT,
        license: nspData.NSP_PACKAGE_LICENSE,
        keywords: nspData.NSP_PACKAGE_KEYWORDS.split(',').map(x => x.replace(/(^\s)|(\s$)/g, '')),
        private: nspData.NSP_PACKAGE_PRIVATE,
        scripts: {
            build: "rm -rf dist && babel src -d dist && chmod +x ./dist/*.js"
        }
    }

    if (nspData.NSP_GIT_REPOSITORY_HOMEPAGE) {
        packageJsonData.homepage = nspData.NSP_GIT_REPOSITORY_HOMEPAGE
    }

    if (nspData.NSP_REPOSITORY_REMOTE) {
        packageJsonData.repository = {
            type: "git",
            url: nspData.NSP_REPOSITORY_REMOTE
        }
    }

    if (nspData.NSP_ISSUES) {
        packageJsonData.bugs = {
            url: nspData.NSP_ISSUES
        }
    }

    fs.writeFileSync(
        'package.json',
        JSON.stringify(packageJsonData, null, "\t")
    )
}
