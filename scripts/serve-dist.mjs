import { createServer } from 'node:http'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distRoot = path.resolve(__dirname, '..', 'dist')

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
}

const port = Number(process.env.PORT ?? 8080)

function toSafePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0])
  const normalized = path.normalize(decoded).replace(/^\/+/, '')
  return path.resolve(distRoot, normalized)
}

async function tryStat(filePath) {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    return await fs.stat(filePath)
  } catch {
    return null
  }
}

function writeHeaders(res, statusCode, filePath) {
  const ext = path.extname(filePath)
  const contentType = MIME_TYPES[ext] ?? 'application/octet-stream'
  res.writeHead(statusCode, {
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
  })
}

const server = createServer(async (req, res) => {
  const method = req.method ?? 'GET'
  if (method !== 'GET' && method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Method Not Allowed')
    return
  }

  const requestedPath = toSafePath(req.url ?? '/')
  if (!requestedPath.startsWith(distRoot)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Forbidden')
    return
  }

  let filePath = requestedPath
  let stats = await tryStat(filePath)

  if (stats?.isDirectory()) {
    filePath = path.join(filePath, 'index.html')
    stats = await tryStat(filePath)
  }

  if (!stats?.isFile()) {
    // SPA fallback: return index.html for non-asset paths.
    filePath = path.join(distRoot, 'index.html')
    stats = await tryStat(filePath)
  }

  if (!stats?.isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Not Found')
    return
  }

  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const content = await fs.readFile(filePath)
    writeHeaders(res, 200, filePath)
    if (method === 'HEAD') {
      res.end()
      return
    }
    res.end(content)
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Internal Server Error')
  }
})

server.listen(port, '0.0.0.0', () => {
  process.stdout.write(`Serving dist on 0.0.0.0:${port}\n`)
})
