const BR_PLACEHOLDER = '___BR___'
const BLOCK_PLACEHOLDER = '___BLOCK___'
const P_PLACEHOLDER = '___P___'

const BLOCK_TAGS =
  'div, h1, h2, h3, h4, h5, h6, li, ul, ol, tr, dl, dt, dd, blockquote, pre, form, table, article, section, header, footer, nav, main, aside'

const WHITESPACE_REGEX = /\s+/g
const ALL_PLACEHOLDERS_REGEX = new RegExp(
  ` *(${BR_PLACEHOLDER}|${BLOCK_PLACEHOLDER}|${P_PLACEHOLDER}) *`,
  'g'
)
const ADJACENT_BLOCK_REGEX = new RegExp(
  `(?:${BLOCK_PLACEHOLDER}|${P_PLACEHOLDER})+`,
  'g'
)

/**
 * Simulates `innerText` behavior for Cheerio elements.
 */
export function getInnerText(el: any): string {
  const clone = el.clone()

  clone.find('br').replaceWith(BR_PLACEHOLDER)
  clone.find('p').before(P_PLACEHOLDER).after(P_PLACEHOLDER)
  clone.find(BLOCK_TAGS).before(BLOCK_PLACEHOLDER).after(BLOCK_PLACEHOLDER)

  let text = clone.text()

  // 1. Collapse normal whitespace to single space
  text = text.replace(WHITESPACE_REGEX, ' ')

  // 2. Clean up spaces around ALL placeholders to ensure clean transitions
  text = text.replace(ALL_PLACEHOLDERS_REGEX, '$1')

  // 3. Collapse adjacent block/p placeholders (P takes precedence for double newline)
  text = text.replace(ADJACENT_BLOCK_REGEX, (match: string) =>
    match.includes(P_PLACEHOLDER) ? P_PLACEHOLDER : BLOCK_PLACEHOLDER
  )

  // 4. Restore placeholders
  text = text.replaceAll(BR_PLACEHOLDER, '\n')
  text = text.replaceAll(P_PLACEHOLDER, '\n\n')
  text = text.replaceAll(BLOCK_PLACEHOLDER, '\n')

  // 5. Final trim
  return text.trim()
}

const STRUCTURAL_ENTITIES: Record<string, string> = {
  '&amp;': '&amp;',
  '&lt;': '&lt;',
  '&gt;': '&gt;',
  '&quot;': '&quot;',
}

const COMMON_ENTITIES: Record<string, string> = {
  '&apos;': "'",
  '&nbsp;': ' ',
  '&copy;': '©',
  '&reg;': '®',
  '&trade;': '™',
}

/**
 * Normalizes HTML string by decoding non-structural entities.
 * This aligns Cheerio's output with browser's `innerHTML` behavior.
 */
export function normalizeHtml(html: string): string {
  if (!html) return html
  return html.replace(/&(#?[a-zA-Z0-9]+);/g, (match) => {
    const lowerMatch = match.toLowerCase()
    if (STRUCTURAL_ENTITIES[lowerMatch]) {
      return match
    }
    if (COMMON_ENTITIES[lowerMatch]) {
      return COMMON_ENTITIES[lowerMatch]
    }
    if (match.startsWith('&#')) {
      const code = match.startsWith('&#x')
        ? parseInt(match.slice(3, -1), 16)
        : parseInt(match.slice(2, -1), 10)
      if (!isNaN(code)) {
        // 特别处理不间断空格 (U+00A0 = 160)
        if (code === 160) {
          // 160 is decimal for 0xA0
          return ' ' // 返回普通空格而不是不间断空格
        }

        return String.fromCharCode(code)
      }
    }
    return match
  })
}
