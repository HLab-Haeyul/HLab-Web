const escapeHtml = (input: string) =>
  input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const escapeCodeHtml = (input: string) =>
  input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

export type MarkdownHeading = {
  level: 1 | 2 | 3 | 4 | 5 | 6
  text: string
  id: string
}

const stripInlineMarkdownSyntax = (value: string) =>
  value
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/<[^>]+>/g, '')
    .trim()

const normalizeHeadingText = (value: string) => stripInlineMarkdownSyntax(value)

const buildHeadingId = (rawText: string, usedIds: Map<string, number>) => {
  const normalized = normalizeHeadingText(rawText)
  const base =
    normalized
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase()
      .replace(/[^a-z0-9\u3131-\u318e\uac00-\ud7a3\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') || 'section'

  const currentCount = usedIds.get(base) ?? 0
  usedIds.set(base, currentCount + 1)

  if (currentCount === 0) {
    return base
  }

  return `${base}-${currentCount + 1}`
}

const normalizeFenceLanguage = (raw: string) => raw.trim().toLowerCase()

const getKeywordPattern = (language: string) => {
  if (language === 'python' || language === 'py') {
    return /\b(def|class|if|elif|else|for|while|try|except|finally|return|import|from|as|with|lambda|pass|break|continue|True|False|None|async|await|in|is|and|or|not|raise|yield)\b/g
  }

  if (
    language === 'javascript' ||
    language === 'js' ||
    language === 'typescript' ||
    language === 'ts' ||
    language === 'tsx' ||
    language === 'jsx'
  ) {
    return /\b(const|let|var|function|class|if|else|for|while|switch|case|default|return|import|from|export|new|try|catch|finally|throw|async|await|extends|implements|interface|type|enum|public|private|protected|static|readonly|true|false|null|undefined)\b/g
  }

  if (language === 'bash' || language === 'sh' || language === 'zsh' || language === 'shell') {
    return /\b(if|then|else|fi|for|in|do|done|while|case|esac|function|return|export|local|readonly)\b/g
  }

  if (language === 'json' || language === 'yaml' || language === 'yml') {
    return /\b(true|false|null)\b/g
  }

  return null
}

const getCommentPatterns = (language: string) => {
  if (language === 'python' || language === 'py') {
    return [/(^|\s)#.*$/gm]
  }

  if (
    language === 'javascript' ||
    language === 'js' ||
    language === 'typescript' ||
    language === 'ts' ||
    language === 'tsx' ||
    language === 'jsx'
  ) {
    return [/\/\*[\s\S]*?\*\//g, /(^|\s)\/\/.*$/gm]
  }

  if (language === 'bash' || language === 'sh' || language === 'zsh' || language === 'shell') {
    return [/(^|\s)#.*$/gm]
  }

  return []
}

const getStringPattern = (language: string) => {
  if (language === 'json') {
    return /"(?:\\.|[^"\\])*"/g
  }

  if (language === 'yaml' || language === 'yml') {
    return /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g
  }

  return /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g
}

const highlightCodeBlock = (rawCode: string, rawLanguage: string) => {
  const language = normalizeFenceLanguage(rawLanguage)

  if (!language) {
    return escapeCodeHtml(rawCode)
  }

  let content = escapeCodeHtml(rawCode)
  const tokens: string[] = []

  const stash = (pattern: RegExp, className: string) => {
    content = content.replace(pattern, (match: string) => {
      const token = `@@CODE_TOKEN_${tokens.length}@@`
      tokens.push(`<span class="code-token ${className}">${match}</span>`)
      return token
    })
  }

  getCommentPatterns(language).forEach((pattern) => {
    stash(pattern, 'comment')
  })
  stash(getStringPattern(language), 'string')

  const keywordPattern = getKeywordPattern(language)

  if (keywordPattern) {
    stash(keywordPattern, 'keyword')
  }

  tokens.forEach((token, index) => {
    content = content.replace(`@@CODE_TOKEN_${index}@@`, token)
  })

  return content
}

const sanitizeUrl = (raw: string) => {
  const value = raw.trim()

  if (!value) {
    return null
  }

  if (value.startsWith('/')) {
    return value
  }

  try {
    const parsed = new URL(value)

    if (parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:') {
      return parsed.toString()
    }
  } catch {
    return null
  }

  return null
}

const renderInline = (rawText: string) => {
  const linkTokens: string[] = []
  const codeTokens: string[] = []

  let text = rawText

  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label: string, href: string) => {
    const safeHref = sanitizeUrl(href)

    if (!safeHref) {
      return escapeHtml(label)
    }

    const token = `@@LINK_TOKEN_${linkTokens.length}@@`
    linkTokens.push(
      `<a href="${escapeHtml(safeHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`,
    )
    return token
  })

  text = text.replace(/`([^`]+)`/g, (_, code: string) => {
    const token = `@@CODE_TOKEN_${codeTokens.length}@@`
    codeTokens.push(`<code>${escapeHtml(code)}</code>`)
    return token
  })

  text = escapeHtml(text)
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  text = text.replace(/\n/g, '<br />')

  codeTokens.forEach((token, index) => {
    text = text.replace(`@@CODE_TOKEN_${index}@@`, token)
  })

  linkTokens.forEach((token, index) => {
    text = text.replace(`@@LINK_TOKEN_${index}@@`, token)
  })

  return text
}

const isUnorderedListLine = (line: string) => /^-\s+/.test(line)
const isOrderedListLine = (line: string) => /^\d+\.\s+/.test(line)
const isHeadingLine = (line: string) => /^(#{1,6})\s+/.test(line)
const isBlockquoteLine = (line: string) => /^>\s?/.test(line)
const isFenceStartLine = (line: string) => /^```/.test(line)

const isBlockStartLine = (line: string) =>
  isHeadingLine(line) ||
  isUnorderedListLine(line) ||
  isOrderedListLine(line) ||
  isBlockquoteLine(line) ||
  isFenceStartLine(line)

export const extractMarkdownHeadings = (markdown: string, levels: Array<1 | 2 | 3 | 4 | 5 | 6> = [1, 2, 3]) => {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const selectedLevels = new Set(levels)
  const usedIds = new Map<string, number>()
  const headings: MarkdownHeading[] = []
  let insideFence = false

  for (const rawLine of lines) {
    const trimmed = rawLine.trim()

    if (isFenceStartLine(trimmed)) {
      insideFence = !insideFence
      continue
    }

    if (insideFence) {
      continue
    }

    const match = trimmed.match(/^(#{1,6})\s+(.*)$/)

    if (!match) {
      continue
    }

    const headingMarks = match[1] ?? '#'
    const headingText = match[2] ?? ''
    const level = Math.min(headingMarks.length, 6) as MarkdownHeading['level']
    const id = buildHeadingId(headingText, usedIds)

    if (!selectedLevels.has(level)) {
      continue
    }

    headings.push({
      level,
      text: normalizeHeadingText(headingText),
      id,
    })
  }

  return headings
}

export const markdownToHtml = (markdown: string) => {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const blocks: string[] = []
  const usedHeadingIds = new Map<string, number>()

  for (let i = 0; i < lines.length; ) {
    const current = lines[i] ?? ''
    const trimmed = current.trim()

    if (!trimmed) {
      i += 1
      continue
    }

    if (isFenceStartLine(trimmed)) {
      const language = trimmed.slice(3).trim()
      i += 1
      const codeLines: string[] = []

      while (i < lines.length && !isFenceStartLine((lines[i] ?? '').trim())) {
        codeLines.push(lines[i] ?? '')
        i += 1
      }

      if (i < lines.length) {
        i += 1
      }

      const normalizedLanguage = normalizeFenceLanguage(language)
      const safeLanguage = escapeHtml(normalizedLanguage)
      const languageClass = normalizedLanguage ? ` class="language-${safeLanguage}"` : ''
      const languageAttr = normalizedLanguage ? ` data-language="${safeLanguage}"` : ''
      const highlighted = highlightCodeBlock(codeLines.join('\n'), normalizedLanguage)
      blocks.push(`<pre${languageAttr}><code${languageClass}>${highlighted}</code></pre>`)
      continue
    }

    if (isHeadingLine(trimmed)) {
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/)

      if (match) {
        const headingMarks = match[1] ?? '#'
        const headingText = match[2] ?? ''
        const level = Math.min(headingMarks.length, 6)
        const headingId = buildHeadingId(headingText, usedHeadingIds)
        blocks.push(`<h${level} id="${escapeHtml(headingId)}">${renderInline(headingText)}</h${level}>`)
      }

      i += 1
      continue
    }

    if (isUnorderedListLine(trimmed)) {
      const items: string[] = []

      while (i < lines.length && isUnorderedListLine((lines[i] ?? '').trim())) {
        items.push(`<li>${renderInline((lines[i] ?? '').trim().replace(/^-\s+/, ''))}</li>`)
        i += 1
      }

      blocks.push(`<ul>${items.join('')}</ul>`)
      continue
    }

    if (isOrderedListLine(trimmed)) {
      const items: string[] = []

      while (i < lines.length && isOrderedListLine((lines[i] ?? '').trim())) {
        items.push(`<li>${renderInline((lines[i] ?? '').trim().replace(/^\d+\.\s+/, ''))}</li>`)
        i += 1
      }

      blocks.push(`<ol>${items.join('')}</ol>`)
      continue
    }

    if (isBlockquoteLine(trimmed)) {
      const quoteLines: string[] = []

      while (i < lines.length && isBlockquoteLine((lines[i] ?? '').trim())) {
        quoteLines.push((lines[i] ?? '').trim().replace(/^>\s?/, ''))
        i += 1
      }

      blocks.push(`<blockquote>${renderInline(quoteLines.join('\n'))}</blockquote>`)
      continue
    }

    const paragraphLines = [trimmed]
    i += 1

    while (i < lines.length) {
      const line = lines[i] ?? ''
      const normalized = line.trim()

      if (!normalized || isBlockStartLine(normalized)) {
        break
      }

      paragraphLines.push(normalized)
      i += 1
    }

    blocks.push(`<p>${renderInline(paragraphLines.join('\n'))}</p>`)
  }

  return blocks.join('\n')
}
