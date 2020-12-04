#!/usr/bin/env node
import cmd from './index'
import fs from "fs"

const contextDir = fs.realpathSync('.').replace(/\/+$/, '') + '/'
const fileDir = fs.realpathSync(__dirname).replace(/\/+$/, '') + '/'

cmd.call(fileDir, contextDir)
