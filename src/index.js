import {CommandManager, getVersion} from "@kebab-case/node-command-manager"
import {initMod} from "./lib/init"
import {packageMod} from "./lib/generatePackageJson"
import {buildMod} from "./lib/build"
import {publishMod} from "./lib/publish"

export const mods = [initMod, packageMod, buildMod, publishMod]

// TODO add Command repository

const npmSimplePublisherCommand = new CommandManager(getVersion(__dirname+'/../'))

const cmd = npmSimplePublisherCommand.newCommand({mods})

export default cmd
