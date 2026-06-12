# AGENTS.md

Compact guide for OpenCode agents working in `stne-log-parser`. Skip sections you don't need.

## What this is

ESM JavaScript library that parses log lines from the STNE (Space Trek – The New Empire) browser game, plus an in-repo browser demo. `package.json` has `"type": "module"`; the published artifact is `dist/main.js` (webpack `outputModule: true`).

Real entrypoints:
- Library: `src/index.js` (re-exports `StneLogParser`, `LogEntry`, `LogLine`, the `enum`/`statistics`/`regex` namespaces, and `util`).
- Browser demo: `src/demonstration/index.js` (mounted on `window.stneLogParser`, loaded by `public/index.html`).

`StneLogParser` in `src/stne-log-parser.js` is currently a stub class — actual work happens in `LogLine` and `LogEntry`.

## Commands

All commands are `yarn …` (Yarn 4.11 via Corepack, see `packageManager` in `package.json`).

- `yarn install --immutable` — required in CI; locally just `yarn install` (`.yarnrc.yml` pins `nodeLinker: node-modules`).
- `yarn test` — Jest. The script sets `NODE_OPTIONS="--experimental-vm-modules"`; that flag is required for ESM tests, don't drop it.
- `yarn build` — webpack production build → `dist/main.js` and `dist/demonstration.js`. `yarn prepare` is the same command and runs on `yarn install` for publish.
- `yarn watch` — `webpack serve` in dev mode, serves `public/` plus the built `demonstration.js` (HMR is off, see `webpack.dev.js`).

Single test: `yarn test path/to/file.test.js` (or `-t "name"` for a single test). No separate lint/typecheck scripts — there is no ESLint or TS config; the test suite is the verification step.

## Critical gotcha: webpack-only auto-loader

`src/line-type.index.js` and `src/preprocessor.index.js` use `import.meta.webpackContext` to glob every matching file at build time. **That call throws in Node/Jest.** `tests/setupTests.js` mocks `line-type.index.js` to an empty module, and any test that needs a parser must inject the types it wants manually:

```js
import LogLine from '../src/log-line.js';
import MyType from '../src/line-type/my-type.js';

beforeAll(() => { LogLine.overrideLogLineTypes([MyType]); });
afterAll(() => { LogLine.resetLogLineTypes(); });
// Same pattern with LogEntry.overridePreprocessors / resetPreprocessors.
```

See `tests/log-line.test.js`, `tests/statistics/statistics.test.js`, and `tests/preprocessor/player-linebreak-fix-preprocessor.test.js` for canonical examples. If your new test silently does nothing, you forgot the override.

## Architecture, in one pass

- `src/log-line.js` — `LogLine.parse(text, lang)`. Iterates registered `GenericType` subclasses, returns the first hit plus tags/parseResult. `lang` defaults to "any".
- `src/log-entry.js` — `LogEntry.parseLogEntries(text)` and `parseLogMessage`. Runs preprocessors on the body, then splits by `\n` and parses each line. `findAttacks()` groups `LineTag.battle` lines into attacks (also exposed via `buildStatistics()` / `populateStatistics()`).
- `src/line-type/generic-type.js` — base class. Subclasses set `static _regexByLanguage = { de: …, en: …, es: … }` (built with `addSubroutines` from `src/util/regex-helper.js`, which uses the `regex` package's `pattern` tagged template). Override `_buildResultObject`, `getTags`, and optionally `populateStatistics`.
- `src/line-type/<name>-type.js` + `src/line-type/parse-result/<name>-result.js` — one file per log-line type. New types are picked up automatically by the webpack glob; **the new file name must end in `-type.js`** (`line-type.index.js` regex is `/-type\.js$/`).
- `src/regex/subroutine/` — reusable regex building blocks (player, ship, building, etc.); each exposes `asSubroutineDefinition()` and `matchResult()`.
- `src/regex/log-head-parser.js` — splits a multi-entry log into per-entry headers + bodies, and the body into lines. Called by `LogEntry.parseLogEntries`.
- `src/preprocessor/` — runs on the body before line parsing; fix things like `destroy-ship` and `player-linebreak` that get mangled by the game's HTML copy-paste. Implementations extend `GenericPreprocessor` and may override the static `priority` getter (lower runs first; default 0).
- `src/enum/line-tag.js` — `enumify` enum of tags used to classify line types. Add a new tag here before using it.
- `src/demonstration/` — browser-only UI sections (`section/line-types.js`, `section/log-parser.js`, `section/log-parser-stats.js`).

## Conventions

- Editor config: 2-space indent, LF, UTF-8, final newline (`.editorconfig`).
- Imports: include the `.js` extension on relative imports (e.g. `'./log-line.js'`). A few test files in `tests/line-type/` omit it; copy from the canonical files (`tests/log-line.test.js`, `tests/preprocessor/…`) instead.
- Multilingual: every line type must handle `de` and `en` at minimum. When adding a new language, update `LogHeadParser.headPattern` (it lists the localized trigger words) and add a key in each line type's `_regexByLanguage`.
- No comments unless required. JSDoc is already used throughout; don't strip it.
- Issue template `.github/ISSUE_TEMPLATE/undetected-log.md` is the intake for new log lines — when adding support, prefer referencing that template's example shape.

## CI / dependencies

- `.github/workflows/node.js.yml` runs `yarn install --immutable` and `yarn test` on Node 20.x, 22.x, 24.x. No build step in CI; build only runs on `yarn install` via `prepare`.
- Dependabot updates `dependencies`/`devDependencies` weekly (`.github/dependabot.yml`).
- Don't commit `dist/` — it's gitignored and regenerated.

## Pointers

- Logs the parser doesn't recognize: file a "Undetected Log" issue with the entry fenced in a code block (template above).
- A snapshot of generated knowledge-graph artifacts lives in `.understand-anything/`; it's tool output, not source — safe to leave alone.
