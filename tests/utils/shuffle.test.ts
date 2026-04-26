import { describe, expect, it } from 'vitest'
import { shuffle } from '../../src/utils/shuffle'

describe('shuffle', () => {
  it('preserves all elements', () => {
    const input = [1, 2, 3, 4, 5]
    const output = shuffle(input)

    expect(output).toHaveLength(input.length)
    expect([...output].sort()).toEqual(input)
    expect(output).not.toBe(input)
  })

  it('returns an empty array unchanged', () => {
    expect(shuffle([])).toEqual([])
  })
})
