/**
 * Sector Flow API Client
 * Reads data from static JSON (updated daily by GitHub Actions)
 */

import { SECTOR_ETFS } from './sectors';

/**
 * Fetch sector data from static JSON
 * @param {string} period - day, week, month, quarter, year
 */
export async function fetchSectorData(period = 'day') {
  try {
    const response = await fetch('/data/sectors.json');
    if (!response.ok) throw new Error('Failed to fetch data');
    
    const json = await response.json();
    return transformData(json, period);
  } catch (error) {
    console.error('API Error:', error);
    return generateMockData(period);
  }
}

/**
 * Transform API response to chart format
 */
function transformData(json, period) {
  const { sectors } = json;
  
  const sectorsData = {};
  const heatmap = [];
  
  Object.entries(sectors).forEach(([symbol, data]) => {
    const info = SECTOR_ETFS[symbol] || {};
    
    sectorsData[symbol] = {
      symbol,
      name: data.name,
      nameCN: info.nameCN || data.name,
      color: info.color || '#888',
      close: data.close,
      volume: data.volume,
      change: data.change,
      moneyFlow: data.moneyFlow
    };
    
    heatmap.push({
      symbol,
      name: data.name,
      returns: data.returns || []
    });
  });
  
  return { sectors: sectorsData, heatmap };
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
