import argv from "argv";
import {version} from "./lib/getVersion"
import {init, initOptions, initMod} from "./lib/init"
import {packageOptions, package, packageMod} from "./lib/package";

argv.version(version)

const mods = [initMod, packageMod]

for (let mod of mods) {
    argv.mod(mod)
}

const args = {mod: 'default', ...argv.run()}

const commands = {
    init,
    package,
    // TODO manage LICENSE (maybe)
    // TODO build
    // TODO publish
    // TODO see if anything needs refacto
    // TODO test global command line !!!
}

if (mods.map(mod => mod.mod).indexOf(args.mod) > -1) {
    commands[args.mod](__dirname, args)
} else {
    argv.help()
}
