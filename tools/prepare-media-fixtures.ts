import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";
import { sha256 } from "../src/catalogue/catalogue.ts";
import { runCheck } from "./run-check.ts";

function pngChunk(type: string, data: Buffer): Buffer {
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  let crc = 0xffffffff;
  for (const byte of body) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++)
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  const header = Buffer.alloc(4);
  header.writeUInt32BE(data.length);
  const trailer = Buffer.alloc(4);
  trailer.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
  return Buffer.concat([header, body, trailer]);
}

function checker(): Buffer {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(32, 0);
  header.writeUInt32BE(32, 4);
  header[8] = 8;
  header[9] = 2; // RGB, no alpha, no interlacing.
  const rows = Buffer.alloc(32 * 97);
  for (let y = 0; y < 32; y++)
    for (let x = 0; x < 32; x++) {
      const red = (Math.floor(x / 8) + Math.floor(y / 8)) % 2 === 0;
      const offset = y * 97 + 1 + x * 3;
      rows[offset] = red ? 255 : 0;
      rows[offset + 2] = red ? 0 : 255;
    }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", header),
    pngChunk("IDAT", deflateSync(rows)),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function tone(frequency: number): Buffer {
  const sampleRate = 48000;
  const dataBytes = 4 * sampleRate * 2;
  const wav = Buffer.alloc(44 + dataBytes);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(wav.length - 8, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(dataBytes, 40);
  for (let sample = 0; sample < dataBytes / 2; sample++)
    wav.writeInt16LE(
      Math.round(
        Math.sin((2 * Math.PI * frequency * sample) / sampleRate) * 8192,
      ),
      44 + sample * 2,
    );
  return wav;
}

/** A real static mesh, deliberately not a humanoid or animated-character substitute. */
function triangle(): Buffer {
  const binary = Buffer.alloc(80);
  const positions = [-1, -1, 0, 1, -1, 0, 0, 1, 0];
  for (const [index, value] of positions.entries())
    binary.writeFloatLE(value, index * 4);
  for (let vertex = 0; vertex < 3; vertex++) {
    binary.writeFloatLE(1, 36 + vertex * 12 + 8);
    binary.writeUInt16LE(vertex, 72 + vertex * 2);
  }
  const model = {
    asset: {
      version: "2.0",
      generator: "Studio fine-tuning procedural fixture",
    },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ name: "Fixture Triangle", mesh: 0 }],
    meshes: [
      {
        primitives: [
          { attributes: { POSITION: 0, NORMAL: 1 }, indices: 2, material: 0 },
        ],
      },
    ],
    materials: [
      {
        doubleSided: true,
        pbrMetallicRoughness: {
          baseColorFactor: [1, 1, 1, 1],
          metallicFactor: 0,
          roughnessFactor: 1,
        },
      },
    ],
    buffers: [{ byteLength: binary.length }],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: 36, target: 34962 },
      { buffer: 0, byteOffset: 36, byteLength: 36, target: 34962 },
      { buffer: 0, byteOffset: 72, byteLength: 6, target: 34963 },
    ],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126,
        count: 3,
        type: "VEC3",
        min: [-1, -1, 0],
        max: [1, 1, 0],
      },
      { bufferView: 1, componentType: 5126, count: 3, type: "VEC3" },
      { bufferView: 2, componentType: 5123, count: 3, type: "SCALAR" },
    ],
  };
  const encoded = Buffer.from(JSON.stringify(model));
  const padded = Buffer.alloc(Math.ceil(encoded.length / 4) * 4, 32);
  encoded.copy(padded);
  const header = Buffer.alloc(20);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(28 + padded.length + binary.length, 8);
  header.writeUInt32LE(padded.length, 12);
  header.writeUInt32LE(0x4e4f534a, 16);
  const binaryHeader = Buffer.alloc(8);
  binaryHeader.writeUInt32LE(binary.length, 0);
  binaryHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, padded, binaryHeader, binary]);
}

export function buildMediaFixtures(): Record<string, Buffer> {
  return {
    "checker.png": checker(),
    "tone-220.wav": tone(220),
    "tone-440.wav": tone(440),
    "triangle.glb": triangle(),
  };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await runCheck(
    async () => {
      if (process.argv.length > 2)
        throw new Error("This command takes no arguments");
      const directory = join(
        import.meta.dirname,
        "../artifacts/fixtures/media",
      );
      await mkdir(directory, { recursive: true });
      const files = [];
      for (const [name, bytes] of Object.entries(buildMediaFixtures())) {
        await writeFile(join(directory, name), bytes);
        files.push({
          name,
          bytes: bytes.length,
          sha256: sha256(bytes),
        });
      }
      await writeFile(
        join(directory, "manifest.json"),
        `${JSON.stringify(
          {
            version: 1,
            files,
            importedIntoStudio: false,
            notes: [
              "Tones are synthetic signals, not speech or music.",
              "Triangle is static with one material slot; no rig or animation.",
              "No video encoder or ffmpeg dependency is assumed.",
              "Real Studio asset identifiers must be obtained after import into the guest project.",
            ],
          },
          null,
          2,
        )}\n`,
      );
      return [];
    },
    "Prepared four local media fixtures in artifacts/fixtures/media",
    "Media preparation failed",
  );
