import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import render from './render.js'

const forbidden = ['node_modules']

export default class Runner {
  constructor () {
    this.testFiles = []
    this.count = 1
  };

  async collectFiles (root) {
    const files = await fs.promises.readdir(root)
    for (const file of files) {
      const fpath = path.join(root, file)
      const stats = await fs.promises.lstat(fpath)
      if (stats.isFile() && file.includes('.test.js')) {
        this.testFiles.push({ fPath: fpath, rPath: file })
      } else if (stats.isDirectory() && !forbidden.includes(file)) {
        const childs = await fs.promises.readdir(fpath)
        files.push(...childs.map(f => path.join(file, f)))
      }
    }
  };

  logFilename (file) {
    console.log(chalk.blue(`${this.count}) ${file}`))
    this.count++
  }

  success (msg) { console.log(chalk.green(`  󰄳 ${msg}`)) };

  failure (msg, e) {
    console.log(chalk.red(`   ${msg}`))
    console.log(chalk.gray('    󰍩', e.message.replace(/\n\n/g, '\n').replace(/\n/g, '\n      ')))
  };

  globals () {
    const befores = []
    global.Render = render
    global.Before = fn => befores.push(fn)
    global.Test = async (desc, fn) => {
      befores.forEach(async fn => await fn())
      try {
        await fn()
        this.success(desc)
      } catch (e) {
        this.failure(desc, e)
      }
    }
  };

  async run () {
    for (const f of this.testFiles) {
      this.logFilename(f.rPath)
      this.globals()
      try {
        await import(f.fPath)
      } catch (e) {
        console.log(e.message)
      }
    }
  };
}
