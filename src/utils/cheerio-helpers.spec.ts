import { describe, it, expect } from 'vitest'
import { load } from 'cheerio'
import { getInnerText, normalizeHtml } from './cheerio-helpers'

describe('cheerio-helpers', () => {
  describe('getInnerText', () => {
    it('should extract basic text content', () => {
      const $ = load('<div>Hello World</div>')
      expect(getInnerText($('div'))).toBe('Hello World')
    })

    it('should handle <br> tags as newlines', () => {
      const $ = load('<div>Line 1<br>Line 2</div>')
      expect(getInnerText($('div'))).toBe('Line 1\nLine 2')
    })

    it('should handle <p> tags with double newlines', () => {
      const $ = load('<div><p>Para 1</p><p>Para 2</p></div>')
      expect(getInnerText($('div'))).toBe('Para 1\n\nPara 2')
    })

    it('should handle block-level elements with single newlines', () => {
      const $ = load(
        '<div><h1>Title</h1><div>Content</div><ul><li>Item 1</li><li>Item 2</li></ul></div>'
      )
      const result = getInnerText($('div').first())
      expect(result).toBe('Title\nContent\nItem 1\nItem 2')
    })

    it('should collapse adjacent block/p placeholders correctly', () => {
      const $ = load('<div><h1>Title</h1><p>Paragraph</p></div>')
      // Title\n\nParagraph (P takes precedence over H1's single newline)
      expect(getInnerText($('div'))).toBe('Title\n\nParagraph')
    })

    it('should remove script, style, and hidden elements', () => {
      const $ = load(`
        <div>
          Visible
          <script>console.log("hide me")</script>
          <style>.hide { display: none; }</style>
          <div hidden>I am hidden</div>
          <span>Still visible</span>
        </div>
      `)
      const result = getInnerText($('div').first())
      expect(result).toContain('Visible')
      expect(result).toContain('Still visible')
      expect(result).not.toContain('console.log')
      expect(result).not.toContain('I am hidden')
    })

    it('should collapse multiple whitespaces into a single space', () => {
      const $ = load('<div>  Hello   \n   World  </div>')
      expect(getInnerText($('div'))).toBe('Hello World')
    })

    it('should trim the final result', () => {
      const $ = load('<div>   Text with spaces   </div>')
      expect(getInnerText($('div'))).toBe('Text with spaces')
    })
  })

  describe('normalizeHtml', () => {
    it('should decode common HTML entities', () => {
      expect(normalizeHtml('Hello&nbsp;World &copy; 2024')).toBe(
        'Hello World © 2024'
      )
      expect(normalizeHtml('Price: &euro;100 &yen;1000')).toBe(
        'Price: €100 ¥1000'
      )
    })

    it('should decode numeric and hex entities', () => {
      expect(normalizeHtml('&#65;&#66;&#67;')).toBe('ABC')
      expect(normalizeHtml('&#x41;&#x42;&#x43;')).toBe('ABC')
    })

    it('should decode high-point Unicode entities', () => {
      // Emoji: 🚀 (U+1F680)
      expect(normalizeHtml('&#x1F680;')).toBe('🚀')
    })

    it('should preserve structural entities', () => {
      const input = '&lt;div&gt;Hello &amp; Welcome&lt;/div&gt;'
      expect(normalizeHtml(input)).toBe(input)
    })

    it('should decode &quot; and &apos;', () => {
      expect(normalizeHtml('He said: &quot;Hello&quot;')).toBe(
        'He said: "Hello"'
      )
      expect(normalizeHtml('It&apos;s a test')).toBe("It's a test")
    })

    it('should handle non-breaking space (U+00A0) as regular space', () => {
      expect(normalizeHtml('&#160;')).toBe(' ')
      expect(normalizeHtml('&#xA0;')).toBe(' ')
      expect(normalizeHtml('&nbsp;')).toBe(' ')
    })

    it('should return original string for invalid entities', () => {
      expect(normalizeHtml('&invalid;')).toBe('&invalid;')
      expect(normalizeHtml('&#zzzz;')).toBe('&#zzzz;')
    })
  })
})
