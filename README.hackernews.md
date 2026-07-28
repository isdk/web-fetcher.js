### **Title:**

`Show HN: I built a declarative web automation library for AI agents`

---

### **First Comment (Final Masterpiece Version):**

GitHub: https://github.com/isdk/web-fetcher.js

Hey HN,

I’ve been building some AI agents lately and ran into a fundamental problem: LLMs are great at generating structured data like JSON, but they are terrible at writing the brittle, procedural JavaScript needed for web automation (`await page.click(...)`, `await page.waitFor(...)`, etc.).

This led me to build `@isdk/web-fetcher`, a library designed around a few core principles to solve this mismatch.

* **Declarative JSON Actions for AI:** Instead of code, you define tasks in a simple JSON "plan." This is a format an LLM can easily generate and reason about, making it a much more natural interface for an agent.

* **A Unified, Dual-Engine API:** It has a fast `http` engine (using Cheerio) and a full `browser` engine (using Playwright). The key was to design a single API (with actions like `extract`, `fill`, etc.) that works across both, allowing the library to execute your plan in the most efficient way.

* **Simple but Powerful Anti-Bot Evasion:** In `browser` mode, you just add `antibot: true`. Under the hood, this does more than just rotate user-agents; it meticulously equips the browser with a more convincing, human-like fingerprint—modifying TLS signatures, ordering headers correctly, and patching navigator properties to evade common commercial bot detectors. It's a complex problem solved with a single switch.

To avoid reinventing the core crawling infrastructure, the library is built on top of the excellent `crawlee` library. My work was to design and implement this declarative, AI-friendly layer on top.

Here’s an example of what a browser-based plan with the anti-bot flag looks like:

```typescript
// Define a plan to access a site with strong bot detection
const plan = {
  url: 'https://some-protected-site.com',
  engine: 'browser',
  antibot: true, // Just flip this switch for enhanced evasion
  actions: [
    { id: 'fill', params: { selector: '#search-input', value: 'Hacker News' } },
    { id: 'click', params: { selector: '#search-button' } },
    { id: 'waitFor', params: { selector: '#results' } },
    {
      id: 'extract',
      params: {"type": "array", "selector": "#results a", "attribute": "href"},
      storeAs: 'searchResults',
    },
  ]
};

const { result, outputs } = await fetchWeb(plan);
console.log('Search finalUrl:', result?.finalUrl);
console.log('Outputs searchResults:', outputs.searchResults);
```

The project is new, and I believe this declarative approach is a more robust path forward for building capable AI agents that can interact with the web. I'd love to hear the community's thoughts and critiques on this design.

Thanks
