import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

const forbidden = ['node_modules']

export default class Runner {
  constructor () {
    this.testFiles = []
    this.count = 1
  }

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
  }

  async run () {
    for (const f of this.testFiles) {
      console.log(chalk.blue(`${this.count}) ${f.rPath}`))
      this.count++
      const befores = []
      global.Before = fn => befores.push(fn)
      global.Test = (desc, fn) => {
        befores.forEach(fn => fn())
        try {
          fn()
          console.log(chalk.green(`  󰄳 ${desc}`))
        } catch (e) {
          console.log(chalk.red(`   ${desc}`))
          console.log(chalk.gray('    󰍩', e.message.replace(/\n\n/g, '\n      ')))
        }
      }

      try {
        import(f.fPath)
      } catch (e) {
        console.log(e.message)
      }
    }
  }
}
