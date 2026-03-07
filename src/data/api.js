/**
 * Sector Flow API Client
 * Connects to Cloudflare Workers backend
 */

import { SECTOR_ETFS } from './sectors';

const API_BASE = 'https://sector-flow-viz.godlzr770.workers.dev';

/**
 * Fetch sector data
 * @param {string} period - day, week, month, quarter, year
 */
export async function fetchSectorData(period = 'day') {
  try {
    const [sectorsRes, flowsRes, heatmapRes] = await Promise.all([
      fetch(`${API_BASE}/api/sectors`),
      fetch(`${API_BASE}/api/flows?period=${period}`),
      fetch(`${API_BASE}/api/heatmap?period=${period}`)
    ]);

    if (sectorsRes.ok && flowsRes.ok && heatmapRes.ok) {
      const sectorsData = await sectorsRes.json();
      const flowsData = await flowsRes.json();
      const heatmapData = await heatmapRes.json();

      return {
        sectors: mergeSectorData(sectorsData.sectors, flowsData.flows),
        heatmap: heatmapData.data
      };
    }
  } catch (error) {
    console.log('API error, using mock data');
  }

  return generateMockData(period);
}

function mergeSectorData(sectors, flows) {
  const merged = {};
  sectors.forEach(s => {
    merged[s.symbol] = { ...s, moneyFlow: 0, change: 0 };
  });
  flows.forEach(f => {
    if (merged[f.symbol]) {
      merged[f.symbol].moneyFlow = f.moneyFlow;
      merged[f.symbol].change = f.change;
    }
  });
  return merged;
}

function generateDates(period, count) {
  const today = new Date();
  const dates = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    if (period === 'day')          d.setDate(d.getDate() - i);
    else if (period === 'week')    d.setDate(d.getDate() - i * 7);
    else if (period === 'month')   d.setMonth(d.getMonth() - i);
    else if (period === 'quarter') d.setMonth(d.getMonth() - i * 3);
    else if (period === 'year')    d.setFullYear(d.getFullYear() - i);
    dates.push(d);
  }
  return dates;
}

function formatDate(date, period) {
  const m  = date.getMonth() + 1;
  const d  = date.getDate();
  const y  = date.getFullYear();
  const yy = String(y).slice(2);
  if (period === 'day' || period === 'week') return `${m}/${d}`;
  if (period === 'month')   return `${yy}/${String(m).padStart(2, '0')}`;
  if (period === 'quarter') return `${yy}Q${Math.ceil(m / 3)}`;
  return `${y}`;
}

function generateMockData(period) {
  const sectors = {};
  const symbols = Object.keys(SECTOR_ETFS);

  symbols.forEach(symbol => {
    const info = SECTOR_ETFS[symbol];
    const change = (Math.random() - 0.5) * 10;
    sectors[symbol] = {
      symbol,
      name: info.name,
      nameCN: info.nameCN,
      color: info.color,
      aum: info.aum,
      change: parseFloat(change.toFixed(2)),
      moneyFlow: parseFloat((1e9 * (Math.random() + 0.5) * (change > 0 ? 1 : -1)).toFixed(0))
    };
  });

  const count = period === 'day' ? 30 : period === 'week' ? 12 : period === 'month' ? 12 : period === 'quarter' ? 8 : 5;
  const rawDates = generateDates(period, count);
  const dates    = rawDates.map(d => formatDate(d, period));

  const heatmap = symbols.map(symbol => ({
    symbol,
    name: SECTOR_ETFS[symbol].name,
    returns: Array.from({ length: count }, () => parseFloat(((Math.random() - 0.5) * 10).toFixed(2)))
  }));

  return { sectors, heatmap, dates };
}
