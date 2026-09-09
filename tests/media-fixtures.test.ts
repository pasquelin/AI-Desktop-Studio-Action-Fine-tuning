import { inflateSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'
import { buildMediaFixtures } from '../tools/prepare-media-fixtures.ts'

describe('procedural local media', () => {
  it('writes a decodable PNG with exact alternating RGB cells', () => {
    const png = buildMediaFixtures()['checker.png']
    expect(png).toBeDefined()
    if (!png) throw new Error('Missing image')
    expect(png.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    expect(png.readUInt32BE(16)).toBe(32)
    expect(png.readUInt32BE(20)).toBe(32)
    const compressed: Buffer[] = []
    for (let offset = 8; offset < png.length; ) {
      const length = png.readUInt32BE(offset)
      const type = png.toString('ascii', offset + 4, offset + 8)
      if (type === 'IDAT') compressed.push(png.subarray(offset + 8, offset + 8 + length))
      offset += length + 12
    }
    const pixels = inflateSync(Buffer.concat(compressed))
    expect(pixels.length).toBe(32 * 97)
    expect([...pixels.subarray(1, 4)]).toEqual([255, 0, 0])
    expect([...pixels.subarray(25, 28)]).toEqual([0, 0, 255])
  })

  it('writes two four-second mono PCM tones, with separate frequencies', () => {
    for (const [name, frequency] of [
      ['tone-220.wav', 220],
      ['tone-440.wav', 440],
    ] as const) {
      const wav = buildMediaFixtures()[name]
      if (!wav) throw new Error('Missing tone')
      expect(wav.toString('ascii', 0, 4)).toBe('RIFF')
      expect(wav.readUInt32LE(4)).toBe(wav.length - 8)
      expect(wav.readUInt16LE(20)).toBe(1)
      expect(wav.readUInt16LE(22)).toBe(1)
      expect(wav.readUInt32LE(24)).toBe(48000)
      expect(wav.readUInt16LE(34)).toBe(16)
      expect(wav.readUInt32LE(40)).toBe(4 * 48000 * 2)
      let crossings = 0
      for (let i = 1; i < 48000; i++)
        if (wav.readInt16LE(44 + (i - 1) * 2) <= 0 && wav.readInt16LE(44 + i * 2) > 0) crossings++
      expect(crossings).toBe(frequency)
    }
  })

  it('writes a static GLB with real indexed geometry and one material slot', () => {
    const glb = buildMediaFixtures()['triangle.glb']
    if (!glb) throw new Error('Missing GLB')
    expect(glb.readUInt32LE(0)).toBe(0x46546c67)
    expect(glb.readUInt32LE(4)).toBe(2)
    expect(glb.readUInt32LE(8)).toBe(glb.length)
    const jsonLength = glb.readUInt32LE(12)
    const model = JSON.parse(glb.toString('utf8', 20, 20 + jsonLength))
    expect(model.meshes[0].primitives[0].material).toBe(0)
    expect(model.accessors[0].count).toBe(3)
    expect(model.accessors[2].componentType).toBe(5123)
    expect(model.animations).toBeUndefined()
    const binary = glb.subarray(28 + jsonLength)
    expect([...new Uint16Array(binary.buffer, binary.byteOffset + 72, 3)]).toEqual([0, 1, 2])
  })
})
