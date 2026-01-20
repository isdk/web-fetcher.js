# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.3.0](https://github.com/isdk/web-fetcher.js/compare/v0.2.12...v0.3.0) (2026-01-20)


### ⚠ BREAKING CHANGES

* **extract:** major extraction logic refactoring and anchor tracking fix

### Features

* **action:** add evaluate action support for dual engines ([27fd209](https://github.com/isdk/web-fetcher.js/commit/27fd209383bd3de51f2b6449a96305dd6a3ae257))
* **action:** add trim action for DOM cleanup and enhance test runner ([0bf438e](https://github.com/isdk/web-fetcher.js/commit/0bf438ed99111567806842fce88253ad726dc47c))
* **action:** refactor 'evaluate' for better safety and navigation ([5939e48](https://github.com/isdk/web-fetcher.js/commit/5939e48b5d554ac90513839c38296c1ef0b97d4e))
* add centralized debug logging and enhance session diagnostics ([c5d13c5](https://github.com/isdk/web-fetcher.js/commit/c5d13c52f9457ee5152dee1cdb0cf562dae33995))
* **debug:** enhance _logDebug with category support and flexible configuration ([6e52127](https://github.com/isdk/web-fetcher.js/commit/6e5212742c622e6b40bc947be56a42e8a1e52283))
* **extract:** add 'depth' parameter for bubble-up traversal and enhance cross-engine consistency ([de3720e](https://github.com/isdk/web-fetcher.js/commit/de3720e9925cb230a4913e6e08fe796ef7d374da))
* **extract:** add relativeTo: 'previous' and order support for segmented extraction ([7a91b7a](https://github.com/isdk/web-fetcher.js/commit/7a91b7ab6cde38f40078bb9d3e4f5d02283cfa49))
* **extract:** enhance extraction with anchor-based arbitrary jumps ([5c9b481](https://github.com/isdk/web-fetcher.js/commit/5c9b481b9c66e623f33e82e9d2abbbc3908fd42a))
* **extract:** enhance segmented extraction with 'Bubble Up' strategy and multi-container support ([1afd917](https://github.com/isdk/web-fetcher.js/commit/1afd917b7f2d504dc5ab0091fbf254445e5d41c5))
* **extract:** enhance segmented mode and strictness propagation ([1e8280e](https://github.com/isdk/web-fetcher.js/commit/1e8280e827ae505a4ce8d40663999af1bb7feea1))
* **extract:** implement 'required' and 'strict' for data quality control ([17f6867](https://github.com/isdk/web-fetcher.js/commit/17f6867e63e70cd4639af266dbe36b0d24260e4e))
* **extract:** implement "Try-And-Bubble" strategy for object extraction ([626d35f](https://github.com/isdk/web-fetcher.js/commit/626d35f295fe74f84798e0cc716ccd3ca145e821))
* **extract:** improve implicit object extraction and add debug tracing ([06e9756](https://github.com/isdk/web-fetcher.js/commit/06e975637aa1ad372c7affbf1b8a024e57cf564c))
* **extract:** support segmented extraction across multiple containers ([a87fe0e](https://github.com/isdk/web-fetcher.js/commit/a87fe0e7bc65ad32fcceadb4ac157b138bc31de5))
* **test:** enable fastify server log if options.debug ([0bc9f5c](https://github.com/isdk/web-fetcher.js/commit/0bc9f5c79890ad5214fba03e8097fea665bda16e))
* **utils:** improve getInnerText and normalizeHtml in cheerio-helpers ([7f03896](https://github.com/isdk/web-fetcher.js/commit/7f03896899c6d2969517de07f350b08c0ef48841))


### Bug Fixes

* **build:** only use current tsconfig.spec.json to test ([9cb0add](https://github.com/isdk/web-fetcher.js/commit/9cb0addcafb0a8f0564a56876d235e7ae1309b7f))
* duplication BaseExtractSchema interface ([2b274ee](https://github.com/isdk/web-fetcher.js/commit/2b274eee5c8701b925567e967a1114e111682a1b))
* **engine:** resolve TypeScript tuple typing error in evaluate action ([9649393](https://github.com/isdk/web-fetcher.js/commit/9649393c1815b9759fa140f454c2fdb49c5b6f13))
* ensure strict sequential action execution and fix cheerio redirects ([448ecfd](https://github.com/isdk/web-fetcher.js/commit/448ecfd0d5390f8047935b4ef129b447a9e68998))
* **extract:** enable sequential scanning for single-element scopes and improve array anchors ([fdc78fb](https://github.com/isdk/web-fetcher.js/commit/fdc78fb5262a7c84e516bc1e6d90fe22e5d0ae06))
* **normalizeExtractSchema:** should process string shorthand for ExtractSchema ([dc4465a](https://github.com/isdk/web-fetcher.js/commit/dc4465a6a0ed061f8a20b8dd74372bb511191e95))


### Refactor

* clean up unused code and remove debug prints in tests ([f4fc3fb](https://github.com/isdk/web-fetcher.js/commit/f4fc3fb24a465b86ff1c73ba6909d85ac5049a9e))
* **core:** move and enhance schema normalization ([55b8ccd](https://github.com/isdk/web-fetcher.js/commit/55b8ccd134dd031bf380a10f993884fdd060e6a0))
* extract the normalizeExtractSchema as function to schema-normalization.ts ([3da6dd4](https://github.com/isdk/web-fetcher.js/commit/3da6dd438d57ca2083a3cf759e7c46df51e0ba2d))
* **extract:** decouple core extraction logic into three-layer architecture ([b2242b1](https://github.com/isdk/web-fetcher.js/commit/b2242b197b49aeede32d732225f0616815030198))
* **extract:** major extraction logic refactoring and anchor tracking fix ([1ceab8e](https://github.com/isdk/web-fetcher.js/commit/1ceab8e13418fea10d713d34218267fba398f2e6))
* **extract:** unify schema normalization and enhance implicit object logic ([d3a7d47](https://github.com/isdk/web-fetcher.js/commit/d3a7d4744dea71a999e11c33485ce9608ec0db07))
* unify action dispatching and refine extraction architecture ([a1357f7](https://github.com/isdk/web-fetcher.js/commit/a1357f7b713234fe73b24b9964a824f3e1956339))


### Performance

* **engine:** optimize tree traversal with LCA and container child lookups ([0580d5c](https://github.com/isdk/web-fetcher.js/commit/0580d5c0176f9f061ce4e3b9724e9a0e7079ec8d))
* **extract:** minimize RPC calls and pre-calculate broadcast flags in columnar mode ([525534d](https://github.com/isdk/web-fetcher.js/commit/525534d3488241ec8c4770081f09acdad98db45b))
* **extract:** optimize segmented extraction performance ([7111c16](https://github.com/isdk/web-fetcher.js/commit/7111c163353446b3ec0159bdeb0d40bf048a5ae0))

## [0.2.12](https://github.com/isdk/web-fetcher.js/compare/v0.2.11...v0.2.12) (2026-01-11)


### Features

* **extract:** add innerText mode support and normalize HTML entities in Cheerio engine ([de44c5f](https://github.com/isdk/web-fetcher.js/commit/de44c5f4abd8737caeaf294a12c3dc82f6dabde1))
* **extract:** implement Zip Strategy and Smart Inference for array extraction ([8d8eb6f](https://github.com/isdk/web-fetcher.js/commit/8d8eb6ff0de42ed899065571e7c70c0492f75020))
* **extract:** introduce advanced array extraction modes (columnar, segmented) ([57ebff8](https://github.com/isdk/web-fetcher.js/commit/57ebff8ee207781b4e62532da3b837f872173fa6))
* **extract:** support implicit object extraction schema ([0e33c8a](https://github.com/isdk/web-fetcher.js/commit/0e33c8a65664d32a45b4d73821d9cc9e030e27e9))
* **test:** fixture can use server.mjs now ([3cfe2ec](https://github.com/isdk/web-fetcher.js/commit/3cfe2ec5d896898f948baccddeff80d815324ad8))


### Bug Fixes

* **normalizeHtml:** return common space instead of a0 ([a5a9b87](https://github.com/isdk/web-fetcher.js/commit/a5a9b870ae9f4ba16fa0e46f7dbe9f82207344e4))
* **playwright:** normalizeHtml for innerHTML ([3055f32](https://github.com/isdk/web-fetcher.js/commit/3055f3223f58815b1533784c442fbdf7cb0157b0))


### Refactor

* **core:** refine engine selection priority and session persistence ([d4c3f2d](https://github.com/isdk/web-fetcher.js/commit/d4c3f2d0bbef0ec6c61129d21b5abed08c560ca2))
* **engine:** cleanup unused variables and refine implicit object detection ([168e273](https://github.com/isdk/web-fetcher.js/commit/168e273063eafbae2ecf2372c60aacafaac8b33d))
* **session:** unify action indexing and support temporary context overrides ([c5010f0](https://github.com/isdk/web-fetcher.js/commit/c5010f032187c86edfa8310a81c108e26e6de8a7))

## [0.2.11](https://github.com/isdk/web-fetcher.js/compare/v0.2.10...v0.2.11) (2026-01-06)


### Features

* add debug parameter ([afe0a5e](https://github.com/isdk/web-fetcher.js/commit/afe0a5e13450a86fe4523dc20e5ca72d705505a0))
* refactor proxy configuration and fix metadata reporting ([4a3d395](https://github.com/isdk/web-fetcher.js/commit/4a3d3954b48f882801c6631667860f6301e4d65e))

## [0.2.10](https://github.com/isdk/web-fetcher.js/compare/v0.2.9...v0.2.10) (2026-01-04)


### Features

* **engine:** add output control for cookies and sessionState ([837d3c4](https://github.com/isdk/web-fetcher.js/commit/837d3c42417eac76c29e1d3c380eb3112a147d16))
* **engine:** implement flexible session isolation and storage persistence ([c9e73d1](https://github.com/isdk/web-fetcher.js/commit/c9e73d1641b48cfa9c96858639a240ca7f2d9f5d))


### Bug Fixes

* **engine:** implement strict session isolation and fix cleanup deadlocks ([1f11d6b](https://github.com/isdk/web-fetcher.js/commit/1f11d6b2b691255ba6a88e80f258cdacdc5636d9))
* **test:** remove tmp dir ([c6694f5](https://github.com/isdk/web-fetcher.js/commit/c6694f50698959edc7c0cdb928907e3e0ef9bb70))

## [0.2.9](https://github.com/isdk/web-fetcher.js/compare/v0.2.8...v0.2.9) (2026-01-03)


### Features

* **engine:** include sessionState in FetchResponse ([01cca2d](https://github.com/isdk/web-fetcher.js/commit/01cca2d0c1fff7f4a39b581c7ab78606d6005f6f))


### Refactor

* **engine:** unify response building and cookie synchronization ([484b283](https://github.com/isdk/web-fetcher.js/commit/484b283182119df968a69e03f4f24b30ddee05c4))

## [0.2.8](https://github.com/isdk/web-fetcher.js/compare/v0.2.7...v0.2.8) (2026-01-03)


### Bug Fixes

* **engine:** enforce persistenceOptions.enable to true in sessionPoolOptions ([24aa447](https://github.com/isdk/web-fetcher.js/commit/24aa447ea9be9e3a1da373592877efd5d5bfa7a0))
* **engine:** sync cookies between FetchEngine and Crawlee Session ([11a5aa0](https://github.com/isdk/web-fetcher.js/commit/11a5aa09745b7f4f3f37a5e47c9e8032e6e099c3))
* **test:** rename forceSessionState to overrideSessionState ([4012d58](https://github.com/isdk/web-fetcher.js/commit/4012d5834ed0f65137f479e22955d65ac0436262))

## [0.2.7](https://github.com/isdk/web-fetcher.js/compare/v0.2.6...v0.2.7) (2026-01-02)


### Features

* **engine:** enhance session state management and restoration ([67ac2ab](https://github.com/isdk/web-fetcher.js/commit/67ac2abdb01356cc0cf363248f4ef8f77c28d78f))
* **session:** add engine parameter to FetchSession to force specific engine ([c29a847](https://github.com/isdk/web-fetcher.js/commit/c29a847403de9b7e232a3dbeee86ff3c7fb239d6))


### Bug Fixes

* **FetchAction:** should throw error if failOnError !== false ([5102206](https://github.com/isdk/web-fetcher.js/commit/5102206f382aaac12f747bc04d9dfe7e5eb88376))


### Refactor

* **test:** use the session.executeAll to run fixture's actions ([8a71db6](https://github.com/isdk/web-fetcher.js/commit/8a71db67543ed3d683e82c52f617e21b87184ad0))

## [0.2.6](https://github.com/isdk/web-fetcher.js/compare/v0.2.5...v0.2.6) (2025-12-31)


### Features

* **FetchAction:** add action alias and args alias ([e419cf3](https://github.com/isdk/web-fetcher.js/commit/e419cf3361832b87953f463086d5a6170944b772))
* **session:** executeAll record the actionIndex when error ([7d7c2ec](https://github.com/isdk/web-fetcher.js/commit/7d7c2ececd6c911aec79e1098aa2dacd70c7484b))
* **test:** add test error object supports ([d7b505c](https://github.com/isdk/web-fetcher.js/commit/d7b505cc39fc821039fb79f641e2e590d2fc028d))

## [0.2.5](https://github.com/isdk/web-fetcher.js/compare/v0.2.4...v0.2.5) (2025-12-30)


### Features

* **fetcher:** add getState() and expose cookies in FetchResponse ([9fd6f52](https://github.com/isdk/web-fetcher.js/commit/9fd6f52ba7cd5cb6b34c39a71febc51bb99168ca))


### Bug Fixes

* **engine:** ensure cookies are correctly seeded and restored ([47c40c1](https://github.com/isdk/web-fetcher.js/commit/47c40c12392078c3d23a60c947b5233297c3f3c7))
* **playwright:** solve TS comparison error with sameSite and apply session getState type ([454450f](https://github.com/isdk/web-fetcher.js/commit/454450fb9b2c03ba1bee72ac0677a667dd8faece))

## [0.2.4](https://github.com/isdk/web-fetcher.js/compare/v0.2.3...v0.2.4) (2025-12-30)


### Features

* **action:** add failOnTimeout option to waitFor action ([8bd7a48](https://github.com/isdk/web-fetcher.js/commit/8bd7a48c89b74012f283a5397c5c3b526fdb7b09))


### Bug Fixes

* **playwright:** extract should update lastResponse too ([828acc5](https://github.com/isdk/web-fetcher.js/commit/828acc53ee8c6dbacd332f19652dcf18122d5be8))

## [0.2.3](https://github.com/isdk/web-fetcher.js/compare/v0.2.2...v0.2.3) (2025-12-30)


### Features

* **types:** add const FetcherOptionKeys ([e79b751](https://github.com/isdk/web-fetcher.js/commit/e79b7513b1cfb1d340f05612396e10e6516d2ff1))


### Bug Fixes

* **cheerio:** requestHandlerTimeoutSecs should follow ctx ([f5d518f](https://github.com/isdk/web-fetcher.js/commit/f5d518f0066809ed188ee253d6a725dbfbe7a7f4))

## [0.2.2](https://github.com/isdk/web-fetcher.js/compare/v0.2.1...v0.2.2) (2025-12-20)


### Features

* add requestHandlerTimeoutSecs ([c9b10a9](https://github.com/isdk/web-fetcher.js/commit/c9b10a9b811356649540c1f406516666fcb72930))
* **engine:** add contentType to response and refine `fill` behavior ([bf3b3e5](https://github.com/isdk/web-fetcher.js/commit/bf3b3e531577bf3426af1a062e2c73592a9578ae))


### Bug Fixes

* **engine:** increase actionEmitter max listeners to prevent memory leak ([815af93](https://github.com/isdk/web-fetcher.js/commit/815af93e3763b4080e64d5330bb8e49398250db4))
* only update $ if no $ exists ([9d976e3](https://github.com/isdk/web-fetcher.js/commit/9d976e330f39f712a4e409b1bd1bd44a5fb476bf))
* **test:** inc TEST_TIMEOUT ([bd60426](https://github.com/isdk/web-fetcher.js/commit/bd604266b75c097780a17f745ba1b44cf304492e))

## [0.2.1](https://github.com/isdk/web-fetcher.js/compare/v0.2.0...v0.2.1) (2025-10-31)

## 0.2.0 (2025-10-31)


### ⚠ BREAKING CHANGES

* rename fetch-return.ts to fetch-return-type.ts
* initialize only this.ctx is empty
* add collector supports and more changes
* mv to src/action/fetch-action.ts
* rename base-fetch-action.ts to fetch-action.ts

### Features

* add antibot supports ([fe25e6d](https://github.com/isdk/web-fetcher.js/commit/fe25e6d3c6e8b6eb9148d7c371aa665861ceed8d))
* add BaseEngine ([864d3e1](https://github.com/isdk/web-fetcher.js/commit/864d3e1f0c0e1a7cec42ac4b4b7a7eff6f3cf240))
* add build files ([6e1975d](https://github.com/isdk/web-fetcher.js/commit/6e1975d146c63328d74a24cd802ce2d58d67b7c3))
* add builtin actions ([4467385](https://github.com/isdk/web-fetcher.js/commit/44673855506eb9bc9e8ad773da68e1b6cee43a43))
* add cheerio egnine ([e443073](https://github.com/isdk/web-fetcher.js/commit/e443073b98215e17d4d028f0fe47017d84b255e2))
* add delegateToEngine method ([b4232e4](https://github.com/isdk/web-fetcher.js/commit/b4232e4d7ef8e3135813c6eb8fa0584b8f13d85e))
* add event ([4d1d05d](https://github.com/isdk/web-fetcher.js/commit/4d1d05dbaf4100a01b126e56cd0e8419a3ece3cb))
* add extract action ([a1858b4](https://github.com/isdk/web-fetcher.js/commit/a1858b4a1f8f84cde8eb243cffb98d48bb2f2ff8))
* add fetcher/utils.ts ([f33bd6c](https://github.com/isdk/web-fetcher.js/commit/f33bd6c1dd77e389f85c4a144753020e423891aa))
* add FetcherOptions and FetchSite ([5eb36a1](https://github.com/isdk/web-fetcher.js/commit/5eb36a19397efb9099dc0f3ba57690bbed310ff7))
* add index.ts ([0be80b0](https://github.com/isdk/web-fetcher.js/commit/0be80b0d4d28cf1a8080f41ceb68f43778b782b0))
* add index.ts ([1fb335d](https://github.com/isdk/web-fetcher.js/commit/1fb335df3707d28a022f8f280572dc3cbe132516))
* add index.ts etc ([b8df11d](https://github.com/isdk/web-fetcher.js/commit/b8df11d10b33aeeb59d7f2eb4d8cfcf58ebd6dbd))
* add normalizeHeaders ([c9d8188](https://github.com/isdk/web-fetcher.js/commit/c9d81889945103978f9abeed744f1d0986122c00))
* add onPause?: OnPauseCallback ([f10f8ba](https://github.com/isdk/web-fetcher.js/commit/f10f8ba113f2a9187a4926e6e0e3f653d1c33683))
* add pause action ([cf1324d](https://github.com/isdk/web-fetcher.js/commit/cf1324d67483637ca34b440364d6440fc16008ff))
* add pause support to cheerio ([4cad34f](https://github.com/isdk/web-fetcher.js/commit/4cad34f2306109baa869d52a38a6b28857c04b92))
* add pause to engine ([eee14be](https://github.com/isdk/web-fetcher.js/commit/eee14be7b860bd17108ed737526e032ae568ab55))
* add playwright engine ([d49c4f2](https://github.com/isdk/web-fetcher.js/commit/d49c4f29b75cb913ce4ff9cbbefba032b47adeb3))
* add PromiseLock ([9cd7308](https://github.com/isdk/web-fetcher.js/commit/9cd7308e762a57160895fb0106ea538e5f03a537))
* add select-engine.ts ([e14a986](https://github.com/isdk/web-fetcher.js/commit/e14a986348cb7fdb039a91292a0f26228a03e328))
* add session ([84220cb](https://github.com/isdk/web-fetcher.js/commit/84220cb6846a84dd2207c76e0db1e925c55f8f3b))
* add throwHttpErrors? to BaseFetcherProperties ([5bb3dde](https://github.com/isdk/web-fetcher.js/commit/5bb3dde33725a8d9be209ee14a473bb5abceb20b))
* add utils helpers ([2bdaf78](https://github.com/isdk/web-fetcher.js/commit/2bdaf7813549beb143fc8db50507bb99ca10f5a5))
* add utils/headers ([6430bcd](https://github.com/isdk/web-fetcher.js/commit/6430bcdf8b7de187459a476e88fc9c69ef4404d3))
* add WebFetcher ([3a1debd](https://github.com/isdk/web-fetcher.js/commit/3a1debd8c8f7d7cea0e8807541f4094f2b8f1e15))
* basic API define ([5237816](https://github.com/isdk/web-fetcher.js/commit/5237816ffa96fdb109d08361bde861e4e838a4fd))
* **extract:** add has/exclude and normaize schema to simplify ([939ac6e](https://github.com/isdk/web-fetcher.js/commit/939ac6ee1a34b1066249fe98dc3690fa93a84ac9))
* **FetchContent:** add actionIndex to internal ([64109eb](https://github.com/isdk/web-fetcher.js/commit/64109ebb1738ff87803c41d2f45af0aaf70dc7c0))
* **testing:** enhance fixture assertions with logical operators ([abaf20f](https://github.com/isdk/web-fetcher.js/commit/abaf20f37d58d2fc8b22f25d7f29aab38899cc08))


### Bug Fixes

* add id and mode ([995b228](https://github.com/isdk/web-fetcher.js/commit/995b228ab11d9aa5e4f77b7fef3083ccbd9d9d8c))
* avoid crawler teardown error ([0dd15dc](https://github.com/isdk/web-fetcher.js/commit/0dd15dcc775816ccf1120d477fb922cdd88ec839))
* **engine:** correct array extraction with missing selector ([f9b89af](https://github.com/isdk/web-fetcher.js/commit/f9b89af6701bfb42b9233b2f42c62af744b0532d))
* failOnError should throw error ([0bffd5b](https://github.com/isdk/web-fetcher.js/commit/0bffd5bcd7ac8b3127fe71fe137c85324d0fb724))
* FetchEngineMode should be FetchEngineType or engine id string ([639fc05](https://github.com/isdk/web-fetcher.js/commit/639fc051464858fd2b60868eef1d871c094b28ac))
* fill should update lastResponse and buildResponse use $ first ([9411fe8](https://github.com/isdk/web-fetcher.js/commit/9411fe8179c0be4a6ac4a7eca879b306070059ba))
* forget to register engine ([0b0b2f7](https://github.com/isdk/web-fetcher.js/commit/0b0b2f7dcee4f00c70ae13e543f7209e521d8615))
* have to processs throwHttpErrors in _sharedRequestHandler for playwright not trigger the errorHandler or failedRequestHandler ([4d9514b](https://github.com/isdk/web-fetcher.js/commit/4d9514bff60ee8a18b61b2915868463394689492))
* import error ([af32d97](https://github.com/isdk/web-fetcher.js/commit/af32d97edebbb18e8a866b94129f8f4f0a775132))
* many bugs and add tests ([1651b05](https://github.com/isdk/web-fetcher.js/commit/1651b059bfddc40b28dffc41576cd0770ae0bb67))
* only apply context.lastResponse when result no error ([4a3d0ee](https://github.com/isdk/web-fetcher.js/commit/4a3d0ee3a9e22df99e880cb3dda22ef7c768b645))
* remove duplication action:start/end event; executeAll should use getContext to get the lastResponse ([2529661](https://github.com/isdk/web-fetcher.js/commit/2529661b52d3c57700829dcb2c3f82eda644103f))
* should update lastResponse after fill ([19d2613](https://github.com/isdk/web-fetcher.js/commit/19d26138888af1ea823c88c9cde953f602d67468))
* timeout ([82ec92b](https://github.com/isdk/web-fetcher.js/commit/82ec92bb8757d4ae552b34cee937f3bf99d0bf7e))
* **ts:** add ts type for beforeExec ([0108ba3](https://github.com/isdk/web-fetcher.js/commit/0108ba3507dc9c79704eb2c8e2f4c4edfeb8f459))


### Refactor

* add actionStack? ([cb7df90](https://github.com/isdk/web-fetcher.js/commit/cb7df902382b11a1e26c1550a5fb6d593efc2402))
* add collector supports and more changes ([bcce0c8](https://github.com/isdk/web-fetcher.js/commit/bcce0c822a96e41350dabca28de2d86facd4607e))
* add errorHandler: this.failedRequestHandler ([1b139f5](https://github.com/isdk/web-fetcher.js/commit/1b139f54a1bfffb4054220b1e2cf4b3f513d7462))
* add none to FetchReturnType ([dbe8616](https://github.com/isdk/web-fetcher.js/commit/dbe86161b9ddfc01b1aa060eab632dcfaae3e976))
* add sites and url to BaseFetcherProperties ([5dedef5](https://github.com/isdk/web-fetcher.js/commit/5dedef56eabfaeaf1dbca846613bf69c01daffdb))
* add static create method etc ([3426c23](https://github.com/isdk/web-fetcher.js/commit/3426c23bfdf403cf3eabcb679a4141a5c4ef4da6))
* BaseFetcherOptions and add site to FetchMode ([a626aff](https://github.com/isdk/web-fetcher.js/commit/a626aff5789073b4f66a0e4a8aa7e895a585918a))
* change default headless to false ([d88ddf3](https://github.com/isdk/web-fetcher.js/commit/d88ddf3a70c50ad616119c1f215de1faa8256bf1))
* change executeAll return value to {result, outputs} ([e5c982e](https://github.com/isdk/web-fetcher.js/commit/e5c982e58f4266f0ed8cb35cd27bb2b93c1edd15))
* click,sumbit use context.sendRequest instead of calling goto again ([db3dcf0](https://github.com/isdk/web-fetcher.js/commit/db3dcf033604ff8f81a8fd434175805a1aa68849))
* disable persistenceOptions ([5e73cf7](https://github.com/isdk/web-fetcher.js/commit/5e73cf7f347a04ea0f75c47478bad24d992314e7))
* **engine:** overhaul architecture with generics and template method ([8ac5bf6](https://github.com/isdk/web-fetcher.js/commit/8ac5bf649d7d89b38454294f25e2578302ed68cd))
* **execute:** ts supports ([ab21211](https://github.com/isdk/web-fetcher.js/commit/ab21211311853abf1392f88ee5c07b60fc726633))
* export ResourceType ([2e9e8ea](https://github.com/isdk/web-fetcher.js/commit/2e9e8eaeac84679fc9f99254aaf0ccd4dd1f773e))
* FetchResponse minor changes ([41bc94a](https://github.com/isdk/web-fetcher.js/commit/41bc94a719da11c52521e6ce6ef25a20b165dbf7))
* follow FetchEngine changed ([d88b2ce](https://github.com/isdk/web-fetcher.js/commit/d88b2ceeead554eed6298a02d42c76552eb8855a))
* initialize only this.ctx is empty ([ee2d9a8](https://github.com/isdk/web-fetcher.js/commit/ee2d9a861340cf82b0c52da60d932ce3e23dc3a0))
* initialize the context.engine; dispose clear context.internal.engine, and this.ctx/opts ([c041c70](https://github.com/isdk/web-fetcher.js/commit/c041c70145e756f1ca2f91b11277eeacf20b0a6d))
* many changes ([ab51fb6](https://github.com/isdk/web-fetcher.js/commit/ab51fb6a896490b95bf217bb2cc7c25dd4555fbe))
* minor changes ([75f451e](https://github.com/isdk/web-fetcher.js/commit/75f451e7409c96ad34127d8907ffbd8efd55bdc4))
* minor changes ([7b80f12](https://github.com/isdk/web-fetcher.js/commit/7b80f120b9eccfe7cacf250815903da1ae4b6de9))
* minor changes ([4258dc2](https://github.com/isdk/web-fetcher.js/commit/4258dc2736168be81a2889d0c0c0f65a3adce2bc))
* minor changes ([bbb952f](https://github.com/isdk/web-fetcher.js/commit/bbb952f948b2df0259b6cd9e6bebfb16b43ba00e))
* minor changes ([7cf244a](https://github.com/isdk/web-fetcher.js/commit/7cf244a0ca2703963b6c803d89f20a276ca8a28f))
* more adjustment ([2b56a06](https://github.com/isdk/web-fetcher.js/commit/2b56a06aceb8ca40200fbb4cc34b6624cd7c8917))
* move DefaultFetcherProperties to types.ts ([4b90f70](https://github.com/isdk/web-fetcher.js/commit/4b90f70e6e493ea74b5b41a105e9805cfb341f11))
* mv to src/action/fetch-action.ts ([f3037d0](https://github.com/isdk/web-fetcher.js/commit/f3037d072168347f4f80f57ac94d66ea3521bc25))
* navigationLock use PromiseLock ([550df96](https://github.com/isdk/web-fetcher.js/commit/550df968c2f7e69bd6f6d0b40b8973ef41ee556d))
* pause should be in engine ([b272e01](https://github.com/isdk/web-fetcher.js/commit/b272e01865980d24802baef7f89c34b5d426f7ba))
* refactor FetchEngine more ([a141c31](https://github.com/isdk/web-fetcher.js/commit/a141c31a25f77daf07cbcb68e81c390d65681a9c))
* remove internal file ([eac2e6d](https://github.com/isdk/web-fetcher.js/commit/eac2e6dacfbfea3c5b2f24c43e347c7d94866679))
* rename base-fetch-action.ts to fetch-action.ts ([db3fa27](https://github.com/isdk/web-fetcher.js/commit/db3fa2753b1dc04f131836b2fea08c661bc94850))
* rename cleanup to _cleanup etc ([41a1fe0](https://github.com/isdk/web-fetcher.js/commit/41a1fe03ed1515f70670b77974ed18c627b678d0))
* rename close to dispose and dispose engine too ([587cfe0](https://github.com/isdk/web-fetcher.js/commit/587cfe0017067a1559805d27ea758bbaf62a11be))
* rename dir fetcher to core ([ee600cf](https://github.com/isdk/web-fetcher.js/commit/ee600cf7eb65ba98aae62936fe45358b5d176712))
* rename fetch-return.ts to fetch-return-type.ts ([217035e](https://github.com/isdk/web-fetcher.js/commit/217035e51b94a01d123b43957bd881d9b0ec7a6c))
* rename FetchActionStatus to FetchActionResultStatus etc ([c3f3619](https://github.com/isdk/web-fetcher.js/commit/c3f3619a55a0416f29bff6ce4413def1da777c49))
* rename file engines/BaseEngine.ts to engine/base.ts ([0a616a7](https://github.com/isdk/web-fetcher.js/commit/0a616a7b7019a88a4b0d13cc806514184e076cb3))
* rename GotoOptions to GotoActionOptions, WaitForOptions to WaitForActionOptions ([2ca49d9](https://github.com/isdk/web-fetcher.js/commit/2ca49d9360e5ca3f68f7c83e82e94905ae15e863))
* **ts:** minor changes ([61f72f7](https://github.com/isdk/web-fetcher.js/commit/61f72f7c1eb62c9d1696401e85b361ddaf5629d2))
* update FetchContext ([6d54bd9](https://github.com/isdk/web-fetcher.js/commit/6d54bd9a8eaf3e4be736f82d25af665782e01ccc))
* use CommonError instead of Error ([05a4b58](https://github.com/isdk/web-fetcher.js/commit/05a4b58614698d6eda41832bbf185e1142d8fc12))
