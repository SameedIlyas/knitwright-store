#!/usr/bin/env node
/**
 * Generates the store's photography with an image API and writes web-ready files to
 * public/photos/. Cutouts are white garments on transparent backgrounds (the store
 * tints them live per colourway); scenes are full-bleed lifestyle photos.
 *
 * Usage: put OPENAI_API_KEY or FAL_KEY in .env.local, then `npm run photos`.
 * Re-running skips files that already exist; pass --force to regenerate, or ids to limit.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'photos')

function loadEnv() {
  const file = join(ROOT, '.env.local')
  if (!existsSync(file)) return
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]] && m[2]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
  }
}

const GARMENT = (item, view = 'front view') =>
  `Professional e-commerce studio product photo of a blank, plain, pure white ${item}, ${view}, ` +
  'laid perfectly flat and symmetrical, no logos, no text, no stripes, no prints, completely white material ' +
  'with realistic soft folds, seams and fabric texture, soft even studio lighting, centered with a generous margin, ' +
  'isolated on a transparent background, photorealistic, high detail'

const SCENE = (subject) =>
  `${subject}. Editorial sports photography, photorealistic, natural colour grading with deep cobalt blue (#2b46f0) and near-black accents, ` +
  'shallow depth of field. All jerseys and clothing are plain with NO crests, NO emblems, NO team logos, NO maple leaves, NO brand marks; no readable text or watermarks'

/** @type {{ id: string; kind: 'cutout' | 'scene'; size: 'square' | 'landscape' | 'portrait'; prompt: string }[]} */
export const SHOTS = [
  { id: 'hockey-front', kind: 'cutout', size: 'square', prompt: GARMENT('ice hockey jersey with lace-up V-neck collar and long sleeves spread horizontally') },
  { id: 'hockey-back', kind: 'cutout', size: 'square', prompt: GARMENT('ice hockey jersey with long sleeves spread horizontally', 'back view') },
  { id: 'baseball-front', kind: 'cutout', size: 'square', prompt: GARMENT('button-front baseball jersey with short sleeves') },
  { id: 'baseball-pants', kind: 'cutout', size: 'square', prompt: GARMENT('pair of baseball pants with belt loops') },
  { id: 'tee', kind: 'cutout', size: 'square', prompt: GARMENT('athletic crew-neck performance t-shirt') },
  { id: 'hoodie', kind: 'cutout', size: 'square', prompt: GARMENT('heavyweight pullover hoodie with kangaroo pocket and drawstrings') },
  { id: 'track-jacket', kind: 'cutout', size: 'square', prompt: GARMENT('full-zip athletic track jacket with stand-up collar') },
  { id: 'winter-jacket', kind: 'cutout', size: 'square', prompt: GARMENT('insulated quilted winter team puffer jacket with hood') },
  { id: 'pant-shell', kind: 'cutout', size: 'square', prompt: GARMENT('ice hockey pant shell (nylon cover for hockey pants)') },
  { id: 'joggers', kind: 'cutout', size: 'square', prompt: GARMENT('pair of tapered fleece jogging pants with cuffed ankles') },
  { id: 'shorts', kind: 'cutout', size: 'square', prompt: GARMENT('pair of athletic training shorts') },
  { id: 'socks', kind: 'cutout', size: 'square', prompt: GARMENT('pair of knit ice hockey socks laid side by side') },
  { id: 'gloves', kind: 'cutout', size: 'square', prompt: GARMENT('pair of ice hockey player gloves, white leather and nylon', 'top view') },
  { id: 'cap', kind: 'cutout', size: 'square', prompt: GARMENT('six-panel structured baseball cap with curved brim', 'three-quarter front view') },
  { id: 'toque', kind: 'cutout', size: 'square', prompt: GARMENT('knit winter toque beanie with folded cuff and pom-pom') },
  { id: 'duffel', kind: 'cutout', size: 'square', prompt: GARMENT('large hockey player equipment duffel bag with handles and shoulder strap', 'three-quarter view') },
  { id: 'backpack', kind: 'cutout', size: 'square', prompt: GARMENT('sports team backpack with front pocket', 'front view standing upright') },
  { id: 'bottle', kind: 'cutout', size: 'square', prompt: GARMENT('plastic sports squeeze water bottle with cap', 'front view standing upright') },

  { id: 'scene-hero', kind: 'scene', size: 'portrait', prompt: SCENE('Rear view of a youth ice hockey player skating away from camera toward bright arena lights, wearing a plain solid black hockey jersey with solid cobalt blue sleeves and a large plain white number 19 on the back, matte black unbranded helmet, ice spray, dramatic atmosphere') },
  { id: 'scene-sublimation', kind: 'scene', size: 'portrait', prompt: SCENE('Close-up of a heat press sublimation printer in a garment factory transferring a vibrant cobalt blue geometric pattern onto white jersey fabric') },
  { id: 'scene-shipping', kind: 'scene', size: 'square', prompt: SCENE('Neatly folded stacks of plain solid black and solid cobalt blue athletic shirts with no graphics at all, packed in open plain cardboard shipping boxes on a warehouse table, soft daylight') },
  { id: 'scene-crest', kind: 'scene', size: 'square', prompt: SCENE('Macro close-up of a thick embroidered crest patch with dense satin stitching sewn onto a cobalt blue jersey') },
  { id: 'scene-fabric', kind: 'scene', size: 'square', prompt: SCENE('Overhead flat lay of athletic fabric swatches: cobalt blue mesh, white air-knit, black fleece, arranged on a light grey table') },
  { id: 'scene-names', kind: 'scene', size: 'square', prompt: SCENE('Close-up of a seamstress stitching white tackle-twill letters onto the back of a navy hockey jersey on an industrial sewing machine') },
  { id: 'scene-numbers', kind: 'scene', size: 'square', prompt: SCENE('Back view of a plain solid black hockey jersey on a hanger in a wooden locker room stall, with only a large white stitched number 19 on the back and nothing else, no name, no letters') },
  { id: 'scene-factory', kind: 'scene', size: 'landscape', prompt: SCENE('Wide shot of a bright, clean sportswear factory floor in Sialkot with rows of industrial sewing machines and workers stitching blue jerseys') },
  { id: 'scene-dugout', kind: 'scene', size: 'square', prompt: SCENE('Youth baseball team in navy and white button-front jerseys cheering together in a dugout on a sunny afternoon') },
  { id: 'scene-locker', kind: 'scene', size: 'square', prompt: SCENE('Row of matching plain solid black athletic team jerseys with solid cobalt blue sleeves hanging in wooden locker room stalls, the chests are completely blank with no emblem or symbol, warm light') },
  { id: 'scene-sewing', kind: 'scene', size: 'square', prompt: SCENE("Close-up of a tailor's hands guiding cobalt blue jersey fabric through an industrial sewing machine") },
  { id: 'scene-team', kind: 'scene', size: 'landscape', prompt: SCENE('A youth hockey team in matching cobalt blue jerseys celebrating together on the ice after a win, arena lights') },
]

const SIZES = {
  openai: { square: '1024x1024', landscape: '1536x1024', portrait: '1024x1536' },
  fal: { square: { width: 1440, height: 1440 }, landscape: { width: 1440, height: 800 }, portrait: { width: 1152, height: 1440 } },
}

/** Strips API keys (and anything key-shaped) from provider errors before they're logged. */
function redact(message) {
  let out = String(message)
  for (const key of [process.env.OPENAI_API_KEY, process.env.FAL_KEY]) if (key) out = out.replaceAll(key, '[redacted]')
  return out.replace(/sk-[\w-]{6,}/g, 'sk-[redacted]').replace(/Key \S+/g, 'Key [redacted]').slice(0, 300)
}

async function download(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Image download failed: HTTP ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

async function viaOpenAI(shot) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: process.env.IMAGE_MODEL || 'gpt-image-1',
      prompt: shot.prompt,
      size: SIZES.openai[shot.size],
      quality: shot.kind === 'cutout' || shot.id === 'scene-hero' ? 'high' : 'medium',
      background: shot.kind === 'cutout' ? 'transparent' : 'opaque',
      output_format: 'png',
      n: 1,
    }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.message ?? `OpenAI HTTP ${res.status}`)
  return Buffer.from(json.data[0].b64_json, 'base64')
}

async function falRun(model, input) {
  const res = await fetch(`https://fal.run/${model}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Key ${process.env.FAL_KEY}` },
    body: JSON.stringify(input),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.detail ? JSON.stringify(json.detail) : `fal HTTP ${res.status}`)
  return json
}

async function viaFal(shot) {
  const gen = await falRun('fal-ai/flux-pro/v1.1', {
    prompt: shot.prompt.replace('isolated on a transparent background', 'isolated on a plain light grey background'),
    image_size: SIZES.fal[shot.size],
    output_format: 'png',
    safety_tolerance: '2',
  })
  let url = gen.images[0].url
  if (shot.kind === 'cutout') url = (await falRun('fal-ai/birefnet', { image_url: url })).image.url
  return download(url)
}

async function save(shot, png) {
  const img = sharp(png)
  const target = join(OUT, `${shot.id}.webp`)
  if (shot.kind === 'cutout') {
    // Trim transparent margins so every product sits at the same visual scale.
    await img.trim().resize(900, 900, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 86, alphaQuality: 90 }).toFile(target)
  } else {
    const width = shot.size === 'landscape' ? 1800 : 1200
    await img.resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(target)
  }
  return target
}

async function main() {
  loadEnv()
  const provider = process.env.OPENAI_API_KEY ? 'openai' : process.env.FAL_KEY ? 'fal' : null
  if (!provider) {
    console.error('No OPENAI_API_KEY or FAL_KEY found. Add one to .env.local (see .env.example).')
    process.exit(1)
  }
  mkdirSync(OUT, { recursive: true })
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const only = args.filter((a) => !a.startsWith('--'))
  const queue = SHOTS.filter((s) => (only.length ? only.includes(s.id) : true)).filter((s) => force || !existsSync(join(OUT, `${s.id}.webp`)))
  console.log(`Generating ${queue.length} image(s) with ${provider}…`)

  const failures = []
  const worker = async () => {
    for (let shot = queue.shift(); shot; shot = queue.shift()) {
      try {
        const png = provider === 'openai' ? await viaOpenAI(shot) : await viaFal(shot)
        await save(shot, png)
        console.log(`  ✓ ${shot.id}`)
      } catch (err) {
        failures.push(shot.id)
        console.error(`  ✗ ${shot.id}: ${redact(err instanceof Error ? err.message : err)}`)
      }
    }
  }
  await Promise.all([worker(), worker(), worker()])
  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(SHOTS.map(({ id, kind, size }) => ({ id, kind, size })), null, 2))
  if (failures.length) {
    console.error(`\n${failures.length} failed: ${failures.join(', ')} — re-run to retry just those.`)
    process.exit(1)
  }
  console.log('\nDone → public/photos/')
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main()
