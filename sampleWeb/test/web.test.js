import assert from 'assert'

Test('Input rendered', async () => {
  const dom = await Render('index.html')
  const input = dom.window.document.querySelector('input')
  if (input === null) { throw new Error('input not found in the dom') }
})

Test('Message rendered on form submit', async () => {
  const dom = await Render('index.html')
  const input = dom.window.document.querySelector('input')
  const h1 = dom.window.document.querySelector('h1')
  const form = dom.window.document.querySelector('form')
  input.value = 'devalla@'
  form.dispatchEvent(new dom.window.Event('submit'))
  if (h1.innerHTML !== 'looks goo' && h1.innerHTML !== 'invalid') {
    throw new Error('message is other than two posibilities')
  }
})
