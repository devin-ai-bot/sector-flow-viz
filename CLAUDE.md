# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start Vite dev server
npm run build        # production build → dist/
npm run preview      # preview the production build locally
npm run deploy       # deploy frontend to Cloudflare Pages (wrangler pages deploy dist)
```

Worker (Cloudflare):
```bash
cd worker && npx wrangler dev    # run worker locally
cd worker && npx wrangler deploy # deploy worker to Cloudflare
```

Data fetcher:
```bash
python scripts/fetch_sector_data.py   # fetch real ETF data via yfinance → public/data/sectors.json
```

## Architecture

This is a React + Vite SPA deployed to GitHub Pages. There is no routing — single page only.

### Data flow

Three layers, each can fail gracefully:

1. **GitHub Actions** (`fetch-data.yml`) — runs weekdays at 9 PM UTC, calls `scripts/fetch_sector_data.py`, commits `public/data/sectors.json`
2. **Cloudflare Worker** (`worker/index.js`) — REST API at `https://sector-flow-viz.godlzr770.workers.dev` with KV cache (`SECTOR_CACHE`). Endpoints: `/api/sectors`, `/api/flows?period=`, `/api/heatmap?period=`
3. **`src/data/api.js`** — `fetchSectorData(period)` calls the worker; if it fails, falls back to `generateMockData(period)` entirely in the browser

The frontend always works with mock data when the worker is unavailable. Mock data now includes generated dates (`data.dates[]`) aligned with each heatmap column.

### ETF list and grouping

**`src/data/sectors.js`** is the single source of truth for all ETFs. It exports:
- `SECTOR_ETFS` — 37 ETFs, each with `{ name, nameCN, group, aum, color }`
- `ETF_GROUPS` — 8 group definitions with `{ label, labelEN, borderColor }` used by the treemap
- `TIME_PERIODS` — day/week/month/quarter/year with label and dataPoints count

Groups: `market` (5), `sector` (11 SPDR), `tech` (9), `ai` (3), `defense` (2), `energy` (2), `infra` (3), `future` (3).

When adding ETFs, add to both `SECTOR_ETFS` (with a `group` key) and ensure the group exists in `ETF_GROUPS`. The worker's `worker/sectors.js` is a separate copy of the ETF list — keep them in sync manually.

### Component structure

```
App.jsx
  SummaryCards        — inline in App.jsx, 4 KPI cards from data.sectors
  TreemapChart        — grouped treemap: groups sized by AUM sum, leaves colored by return rate
  SankeyChart         — 3-layer Sankey: outflow sectors → MARKET → inflow sectors (ECharts)
  HeatmapChart        — grid of colored cells per sector×date, dates from data.dates[]
```

All charts use **ECharts via `echarts-for-react`**. No other charting library.

### Sankey design note

The Sankey uses a synthetic 3-layer topology: each outflow sector links to a single `MARKET` center node, which links to each inflow sector. Node names for inflow sectors get a zero-width-space suffix (`\u200b`) to avoid ECharts name collisions. `levels[0].lineStyle = {color:'source'}` makes left links red; `levels[1].lineStyle = {color:'target'}` makes right links green.

### Deployment

Frontend auto-deploys to GitHub Pages on push to `main` via `deploy-frontend.yml`. The worker is deployed separately with `wrangler deploy` from the `worker/` directory using the config in `worker/wrangler.jsonc`.
