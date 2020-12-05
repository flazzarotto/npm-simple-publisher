import fs from "fs";

export function updateReadme(contextDir, nspData) {

    let readmeData
    try {
        readmeData = fs.readFileSync(contextDir + 'README.md').toString()
    } catch (e) {
        readmeData = `# ${nspData.NSP_PACKAGE_NAME}
Here be documentation soon`
    }

    const poweredBy1 = `
-----------------------------------------
## Powered by @kebab-case/npm-simple-publisher`

    const poweredBy2 = `

This package has been brought to you by **npm-simple-publisher**

This little nodejs command-line script allows you to easily compile and publish node **and** es6 compliant code 
packages to npm. Init your project with minimal babel configuration for es6, compile to cjs and 
publish to npm with only two commands.

Try it now:

\`\`\`shell script
sudo apt install yarn
sudo npm install -g @kebab-case/npm-simple-publisher
mkdir my_project
cd my_project
# getting help about command
kc-nsp -h # list of command modules
kc-nsp init -h # and so on
# getting started
kc-nsp init -f # create project 
# ... do things in my_project/src, using proposed build or your own (not npm-friendly)
kc-nsp publish -t M|m|r # publish new Major / minor version or revision
\`\`\`

Basically, that's all!

Find on npm: https://www.npmjs.com/package/@kebab-case/npm-simple-publisher`

    let index = readmeData.indexOf(poweredBy1)

    readmeData = readmeData.substr(0, (index > -1) ? index : readmeData.length)
        .replace(/\n+$/g, "\n")

    readmeData += "\n" + poweredBy1 + poweredBy2

    fs.writeFileSync(contextDir + 'README.md', readmeData)
}