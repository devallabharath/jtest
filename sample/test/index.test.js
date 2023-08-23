import { forEach } from '../index.js'
import assert from 'assert'

let nums

Before(() => {
  nums = [1, 2, 3]
})

Test('Should sum an array', () => {
  let total = 0
  forEach(nums, (v) => { total += v })
  assert.strictEqual(total, 6)
})

Test('Before is working', () => {
  assert.strictEqual(nums.length, 4)
})
