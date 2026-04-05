import http from 'node:http'
import path from 'node:path'
import { promises as fs } from 'node:fs'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const WORKS_FILE_PATH = path.join(ROOT_DIR, 'src', 'entities', 'project', 'model', 'works.ts')
const PROFILE_SHOWCASE_FILE_PATH = path.join(
  ROOT_DIR,
  'src',
  'entities',
  'profile',
  'model',
  'profileShowcase.ts',
)
const ANALYTICS_FILE_PATH = path.join(ROOT_DIR, 'tmp', 'portfolio-analytics.json')
const PORT = Number.parseInt(process.env.PORT ?? '8080', 10)

const createEmptyAnalyticsStore = () => ({
  version: 1,
  uniqueVisitors: {},
  updatedAt: null,
})

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Cache-Control': 'no-store',
  })

  response.end(JSON.stringify(payload))
}

const readRequestBody = async (request) => {
  const chunks = []

  for await (const chunk of request) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  if (chunks.length === 0) {
    return null
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim()

  if (!raw) {
    return null
  }

  return JSON.parse(raw)
}

const readAnalyticsStore = async () => {
  try {
    const raw = await fs.readFile(ANALYTICS_FILE_PATH, 'utf8')
    const parsed = JSON.parse(raw)

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof parsed.uniqueVisitors !== 'object' ||
      parsed.uniqueVisitors === null
    ) {
      return createEmptyAnalyticsStore()
    }

    return {
      version: 1,
      uniqueVisitors: parsed.uniqueVisitors,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : null,
    }
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return createEmptyAnalyticsStore()
    }

    throw error
  }
}

const writeAnalyticsStore = async (store) => {
  await fs.mkdir(path.dirname(ANALYTICS_FILE_PATH), { recursive: true })
  await fs.writeFile(ANALYTICS_FILE_PATH, JSON.stringify(store, null, 2), 'utf8')
}

const toMonthIndex = (value) => {
  const match = /^(\d{4})-(\d{2})$/.exec(value)

  if (!match) {
    return null
  }

  const year = Number.parseInt(match[1], 10)
  const month = Number.parseInt(match[2], 10)

  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return null
  }

  return year * 12 + (month - 1)
}

const countProjectsFromSource = (source) => {
  const koBlockMatch = source.match(/ko:\s*\[(?<block>[\s\S]*?)\],\s*en:/)
  const koBlock = koBlockMatch?.groups?.block ?? ''

  return (koBlock.match(/^\s*title:\s*'/gm) ?? []).length
}

const extractCareerIntervals = (source) => {
  const careerBlockMatch = source.match(
    /ko:\s*{[\s\S]*?careerTimeline:\s*\[(?<block>[\s\S]*?)\],\s*awards:/,
  )
  const careerBlock = careerBlockMatch?.groups?.block ?? ''
  const startMatches = [...careerBlock.matchAll(/startedAt:\s*'(\d{4}-\d{2})'/g)]

  return startMatches.flatMap((match, index) => {
    const startedAt = match[1]
    const chunkStart = match.index ?? 0
    const chunkEnd =
      index < startMatches.length - 1
        ? (startMatches[index + 1].index ?? careerBlock.length)
        : careerBlock.length
    const chunk = careerBlock.slice(chunkStart, chunkEnd)
    const endedAtMatch = chunk.match(/endedAt:\s*'(\d{4}-\d{2})'/)
    const endedAt = endedAtMatch?.[1] ?? startedAt

    if (!startedAt) {
      return []
    }

    return [
      {
        startedAt,
        endedAt,
      },
    ]
  })
}

const calculateExperienceMonths = (intervals) => {
  const coveredMonths = new Set()

  intervals.forEach((interval) => {
    const startIndex = toMonthIndex(interval.startedAt)
    const endIndex = toMonthIndex(interval.endedAt ?? interval.startedAt)

    if (startIndex === null || endIndex === null) {
      return
    }

    const from = Math.min(startIndex, endIndex)
    const to = Math.max(startIndex, endIndex)

    for (let current = from; current <= to; current += 1) {
      coveredMonths.add(current)
    }
  })

  return coveredMonths.size
}

const buildMetricsSnapshot = async () => {
  const [worksSource, profileShowcaseSource, analyticsStore] = await Promise.all([
    fs.readFile(WORKS_FILE_PATH, 'utf8'),
    fs.readFile(PROFILE_SHOWCASE_FILE_PATH, 'utf8'),
    readAnalyticsStore(),
  ])

  const projectCount = countProjectsFromSource(worksSource)
  const experienceMonths = calculateExperienceMonths(extractCareerIntervals(profileShowcaseSource))
  const visitorCount = Object.keys(analyticsStore.uniqueVisitors).length

  return {
    projectCount,
    visitorCount,
    experienceMonths,
    updatedAt: new Date().toISOString(),
  }
}

const registerVisitorAndBuildSnapshot = async (visitorId) => {
  const analyticsStore = await readAnalyticsStore()
  const now = new Date().toISOString()
  const existing = analyticsStore.uniqueVisitors[visitorId]

  analyticsStore.uniqueVisitors[visitorId] = {
    firstSeenAt: typeof existing?.firstSeenAt === 'string' ? existing.firstSeenAt : now,
    lastSeenAt: now,
    hits: typeof existing?.hits === 'number' ? existing.hits + 1 : 1,
  }
  analyticsStore.updatedAt = now

  await writeAnalyticsStore(analyticsStore)

  return buildMetricsSnapshot()
}

const server = http.createServer(async (request, response) => {
  if (!request.url) {
    sendJson(response, 400, { message: 'Missing request URL.' })
    return
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    })
    response.end()
    return
  }

  const url = new URL(request.url, `http://${request.headers.host ?? 'localhost'}`)

  try {
    if (request.method === 'GET' && url.pathname === '/portfolio/metrics') {
      const snapshot = await buildMetricsSnapshot()
      sendJson(response, 200, { data: snapshot })
      return
    }

    if (request.method === 'POST' && url.pathname === '/portfolio/metrics/visit') {
      const body = await readRequestBody(request)
      const visitorId =
        typeof body === 'object' && body !== null && typeof body.visitorId === 'string'
          ? body.visitorId.trim()
          : ''

      if (!visitorId) {
        sendJson(response, 400, { message: 'visitorId is required.' })
        return
      }

      const snapshot = await registerVisitorAndBuildSnapshot(visitorId)
      sendJson(response, 200, { data: snapshot })
      return
    }

    if (request.method === 'GET' && url.pathname === '/health') {
      sendJson(response, 200, { ok: true })
      return
    }

    sendJson(response, 404, { message: 'Not found.' })
  } catch (error) {
    console.error('[portfolio-metrics-api]', error)
    sendJson(response, 500, { message: 'Internal server error.' })
  }
})

server.listen(PORT, () => {
  console.log(`[portfolio-metrics-api] listening on http://localhost:${PORT}`)
})
