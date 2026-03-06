/**
 * Sector Data API
 * Fetches ETF data from backend or static JSON
 */

import { SECTOR_ETFS } from './sectors';

// Sample mock data for development
const generateMockData = (period = 'week') => {
  const sectors = Object.keys(SECTOR_ETFS).filter(s => s !== 'SPY');
  const data = {
    timestamp: new Date().toISOString(),
    period,
    sectors: {}
  };
  
  sectors.forEach(symbol => {
    const flow = (Math.random() - 0.5) * 1000000000; // -500M to +500M
    data.sectors[symbol] = {
      symbol,
      name: SECTOR_ETFS[symbol].name,
      nameCN: SECTOR_ETFS[symbol].nameCN,
      color: SECTOR_ETFS[symbol].color,
      moneyFlow: flow,
      flowChange: flow * (Math.random() * 0.2 - 0.1),
      price: 100 + Math.random() * 50,
      volume: Math.floor(Math.random() * 10000000)
    };
  });
  
  return data;
};

// Calculate flow between sectors (simplified model)
const calculateSectorFlows = (sectorData) => {
  const sectors = Object.keys(sectorData.sectors);
  const flows = [];
  
  for (let i = 0; i < sectors.length; i++) {
    for (let j = i + 1; j < sectors.length; j++) {
      const from = sectors[i];
      const to = sectors[j];
      const flow = (Math.random() - 0.5) * 50000000;
      
      if (Math.abs(flow) > 1000000) {
        flows.push({
          source: flow > 0 ? from : to,
          target: flow > 0 ? to : from,
          value: Math.abs(flow)
        });
      }
    }
  }
  
  return flows;
};

export const fetchSectorData = async (period = 'week') => {
  // TODO: Replace with real API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = generateMockData(period);
      data.flows = calculateSectorFlows(data);
      resolve(data);
    }, 500);
  });
};

export { calculateSectorFlows };
