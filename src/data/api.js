/**
 * Sector Flow API Client
 * Connects to Cloudflare Workers backend
 */

import { SECTOR_ETFS } from './sectors';

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Fetch sector data for visualization
 * @param {string} period - day, week, month, quarter, year
 */
export async function fetchSectorData(period = 'day') {
  // Try to fetch from API first
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
    console.log('API not available, using mock data');
  }

  // Fallback to mock data
  return generateMockData(period);
}

/**
 * Merge sector info with flow data
 */
function mergeSectorData(sectors, flows) {
  const merged = {};
  
  sectors.forEach(s => {
    merged[s.symbol] = {
      ...s,
      moneyFlow: 0,
      change: 0
    };
  });
  
  flows.forEach(f => {
    if (merged[f.symbol]) {
      merged[f.symbol].moneyFlow = f.moneyFlow;
      merged[f.symbol].change = f.change;
    }
  });
  
  return merged;
}

/**
 * Generate mock data for development
 */
function generateMockData(period) {
  const sectors = {};
  const symbols = Object.keys(SECTOR_ETFS).filter(s => s !== 'SPY');
  
  symbols.forEach(symbol => {
    const info = SECTOR_ETFS[symbol];
    const change = (Math.random() - 0.5) * 10;
    const baseFlow = 1e9 * (Math.random() + 0.5);
    
    sectors[symbol] = {
      symbol,
      name: info.name,
      nameCN: info.nameCN,
      color: info.color,
      change: parseFloat(change.toFixed(2)),
      moneyFlow: parseFloat((baseFlow * (change > 0 ? 1 : -1)).toFixed(0))
    };
  });

  const days = period === 'day' ? 30 : period === 'week' ? 12 : period === 'month' ? 12 : period === 'quarter' ? 8 : 5;
  
  const heatmap = symbols.map(symbol => ({
    symbol,
    name: SECTOR_ETFS[symbol].name,
    returns: Array.from({ length: days }, () => parseFloat(((Math.random() - 0.5) * 10).toFixed(2)))
  }));

  return { sectors, heatmap };
}
