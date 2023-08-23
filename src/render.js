import jsdom from 'jsdom'
import path from 'path'
const { JSDOM } = jsdom

export default async function render (htmlfile) {
  const file = path.join(process.cwd(), htmlfile)
  const dom = await JSDOM.fromFile(file, {
    runScripts: 'dangerously',
    resources: 'usable'
  })

  return new Promise((res, rej) => {
    dom.window.document.addEventListener('DOMContentLoaded', () => {
      res(dom)
    })
  })
}
