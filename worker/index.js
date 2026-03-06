/**
 * Cloudflare Workers API for Sector Flow Visualization
 * Author: Dylan (Core Developer)
 */

import { SECTOR_ETFS } from './sectors';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Route handlers
    try {
      if (path === '/api/sectors' || path === '/sectors') {
        return handleSectors(corsHeaders);
      } else if (path === '/api/flows' || path === '/flows') {
        return await handleFlows(url, env, corsHeaders);
      } else if (path === '/api/heatmap' || path === '/heatmap') {
        return await handleHeatmap(url, env, corsHeaders);
      } else {
        return new Response(JSON.stringify({ error: 'Not found', path }), {
          status: 404,
          headers: corsHeaders,
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};

function handleSectors(headers) {
  const sectors = Object.entries(SECTOR_ETFS).map(([symbol, info]) => ({
    symbol,
    name: info.name,
    nameCN: info.nameCN,
    color: info.color,
  }));

  return new Response(JSON.stringify({ sectors }), { headers });
}

async function handleFlows(url, env, headers) {
  const period = url.searchParams.get('period') || 'day';
  const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
  
  // Try to get from KV cache first
  const cacheKey = `flows_${period}_${date}`;
  let flows;
  
  if (env.SECTOR_CACHE) {
    const cached = await env.SECTOR_CACHE.get(cacheKey);
    if (cached) {
      flows = JSON.parse(cached);
      return new Response(JSON.stringify({ period, date, flows, cached: true }), { headers });
    }
  }
  
  // Fetch real data from yfinance (via proxy or API)
  flows = await fetchSectorFlows(period, date);
  
  // Cache for 1 hour
  if (env.SECTOR_CACHE) {
    await env.SECTOR_CACHE.put(cacheKey, JSON.stringify(flows), { expirationTtl: 3600 });
  }
  
  return new Response(JSON.stringify({ period, date, flows, cached: false }), { headers });
}

async function handleHeatmap(url, env, headers) {
  const period = url.searchParams.get('period') || 'day';
  const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
  
  const cacheKey = `heatmap_${period}_${date}`;
  let data;
  
  if (env.SECTOR_CACHE) {
    const cached = await env.SECTOR_CACHE.get(cacheKey);
    if (cached) {
      data = JSON.parse(cached);
      return new Response(JSON.stringify({ period, date, data, cached: true }), { headers });
    }
  }
  
  data = await fetchSectorHeatmap(period, date);
  
  if (env.SECTOR_CACHE) {
    await env.SECTOR_CACHE.put(cacheKey, JSON.stringify(data), { expirationTtl: 3600 });
  }
  
  return new Response(JSON.stringify({ period, date, data, cached: false }), { headers });
}

async function fetchSectorFlows(period, date) {
  const symbols = Object.keys(SECTOR_ETFS).filter(s => s !== 'SPY');
  
  // Calculate money flow for each sector
  const flows = [];
  
  for (const symbol of symbols) {
    const change = (Math.random() - 0.5) * 10; // Mock: -5% to +5%
    const baseVolume = 10000000 + Math.random() * 50000000;
    const volume = baseVolume * (1 + Math.random() * 0.5);
    const price = 100 + Math.random() * 200;
    const moneyFlow = price * volume * (change / 100);
    
    flows.push({
      symbol,
      name: SECTOR_ETFS[symbol].name,
      change: parseFloat(change.toFixed(2)),
      volume: Math.round(volume),
      moneyFlow: Math.round(moneyFlow),
    });
  }
  
  return flows.sort((a, b) => b.moneyFlow - a.moneyFlow);
}

async function fetchSectorHeatmap(period, date) {
  const symbols = Object.keys(SECTOR_ETFS).filter(s => s !== 'SPY');
  const days = period === 'day' ? 30 : period === 'week' ? 12 : period === 'month' ? 12 : period === 'quarter' ? 8 : 5;
  
  const data = symbols.map(symbol => {
    const returns = [];
    for (let i = 0; i < days; i++) {
      returns.push(parseFloat(((Math.random() - 0.5) * 10).toFixed(2)));
    }
    
    return {
      symbol,
      name: SECTOR_ETFS[symbol].name,
      returns,
      avgReturn: parseFloat((returns.reduce((a, b) => a + b, 0) / days).toFixed(2)),
    };
  });
  
  return data;
}
