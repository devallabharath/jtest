const form = document.querySelector('form')
const header = document.querySelector('h1')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const { value } = document.querySelector('input')
  if (value.includes('@')) {
    header.innerHTML = 'looks good'
  } else {
    header.innerHTML = 'invalid'
  }
})
