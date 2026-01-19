import { describe, it, expect } from 'vitest'
import * as cheerio from 'cheerio'
import { CheerioFetchEngine } from '../engine/cheerio'
import { extract } from './extract'

describe('Bubble Up Verification', () => {
  const html = `
    <div id="root">
      <div id="container" class="item-wrapper" data-wrapper="true" data-unique="container-only">
        <div id="wrapper" data-wrapper="false">
          <span class="target" id="internal">Internal Target</span>
        </div>
      </div>
      <div id="list">
         <div class="item"><span class="name">Item 1</span></div>
         <div class="item"><span class="name">Item 2</span></div>
      </div>
    </div>
  `

  const $ = cheerio.load(html)
  const context = {
    $: $,
    request: { url: 'http://localhost' },
    body: html,
  } as any

  const engine = new CheerioFetchEngine(context)
  const rootScope = { $, el: $('#root') }

  it('Object: should NOT bubble up if all required fields are found (Standard behavior)', async () => {
    const schema = {
      type: 'object',
      selector: '#internal',
      depth: 10,
      properties: {
        extractedId: { attribute: 'id' }, // Found on #internal
      },
    }

    // @ts-ignore
    const result = await extract.call(engine, schema, rootScope)
    expect(result.extractedId).toBe('internal')
  })

  it('Object: should bubble up if REQUIRED field is missing (Single Level)', async () => {
    const schema = {
      type: 'object',
      selector: '#internal',
      depth: 10,
      properties: {
        extractedId: { attribute: 'id' },
        wrapperData: { attribute: 'data-wrapper', required: true }, // Found on #wrapper
      },
    }

    // @ts-ignore
    const result = await extract.call(engine, schema, rootScope)
    // #wrapper has data-wrapper="false", so it stops there.
    expect(result.extractedId).toBe('wrapper')
    expect(result.wrapperData).toBe('false')
  })

  it('Object: should bubble up multiple levels if intermediate parent is missing required field', async () => {
    const schema = {
      type: 'object',
      selector: '#internal',
      depth: 10,
      properties: {
        extractedId: { attribute: 'id' },
        uniqueData: { attribute: 'data-unique', required: true }, // Only on #container
      },
    }

    // @ts-ignore
    const result = await extract.call(engine, schema, rootScope)

    // #internal: missing
    // #wrapper: missing
    // #container: found "container-only"
    expect(result.extractedId).toBe('container')
    expect(result.uniqueData).toBe('container-only')
  })

  it('Object: should try intermediate parents during bubble up', async () => {
    // #wrapper has data-wrapper="false". #container has data-wrapper="true".
    // If we require data-wrapper, it should stop at #wrapper (depth 1) first.
    const schema = {
      type: 'object',
      selector: '#internal',
      depth: 10,
      properties: {
        wrapperData: { attribute: 'data-wrapper', required: true },
      },
    }

    // @ts-ignore
    const result = await extract.call(engine, schema, rootScope)
    expect(result.wrapperData).toBe('false') // Should stop at #wrapper
  })

  it('Object: should fail if bubble up limit reached without finding required field', async () => {
    const schema = {
      type: 'object',
      selector: '#internal',
      depth: 0, // No bubble up allowed
      properties: {
        wrapperData: { attribute: 'data-wrapper', required: true },
      },
    }

    // @ts-ignore
    const result = await extract.call(engine, schema, rootScope)
    expect(result).toBeNull()
  })

  it('Nested Object: Child bubble up should be independent', async () => {
    const schema = {
      type: 'object',
      selector: '#container',
      properties: {
        parentId: { attribute: 'id' },
        child: {
          type: 'object',
          selector: '#internal', // Starts at #internal
          depth: 5,
          properties: {
            // Require something from #wrapper
            wrapperAttr: { attribute: 'data-wrapper', required: true },
            myId: { attribute: 'id' },
          },
        },
      },
    }

    // @ts-ignore
    const result = await extract.call(engine, schema, rootScope)

    expect(result.parentId).toBe('container')
    // Child should bubble up from #internal to #wrapper
    expect(result.child).not.toBeNull()
    expect(result.child.wrapperAttr).toBe('false') // #wrapper's data
    expect(result.child.myId).toBe('wrapper') // Scope became #wrapper
  })

  it('Array: items should NOT use Try-And-Bubble (Standard Array behavior)', async () => {
    // Array logic is different (Segmented/Nested), usually pre-calculated.
    // This test ensures we didn't break Array extraction.
    const schema = {
      type: 'array',
      selector: '.item',
      items: {
        name: { selector: '.name' },
      },
    }

    // @ts-ignore
    const result = await extract.call(engine, schema, rootScope)
    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Item 1')
  })

  it('Array as Property: should strictly bubble up (Deterministic)', async () => {
    const schema = {
      type: 'object',
      selector: '#list',
      properties: {
        items: {
          type: 'array',
          selector: '.name', // Selects span.name
          depth: 1, // FORCE Bubble up to div.item
          items: {
            attribute: 'class', // div.item has class="item"
          },
        },
      },
    }
    // @ts-ignore
    const result = await extract.call(engine, schema, rootScope)
    expect(result.items).toHaveLength(2)
    // If deterministic bubble up works, class is 'item'.
    // If it failed/didn't bubble, class is 'name'.
    expect(result.items[0]).toBe('item')
  })
})
