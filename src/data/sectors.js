/**
 * US Sector ETF Configuration
 * Colors based on Dina's design spec
 */

export const SECTOR_ETFS = {
  XLK: { name: 'Technology', nameCN: '科技', color: '#6366f1' },
  XLF: { name: 'Financials', nameCN: '金融', color: '#22c55e' },
  XLV: { name: 'Healthcare', nameCN: '医疗', color: '#ef4444' },
  XLE: { name: 'Energy', nameCN: '能源', color: '#f97316' },
  XLI: { name: 'Industrials', nameCN: '工业', color: '#8b5cf6' },
  XLP: { name: 'Consumer Staples', nameCN: '消费必需品', color: '#ec4899' },
  XLU: { name: 'Utilities', nameCN: '公用事业', color: '#14b8a6' },
  XLRE: { name: 'Real Estate', nameCN: '房地产', color: '#84cc16' },
  XLC: { name: 'Communication', nameCN: '通信', color: '#06b6d4' },
  XLB: { name: 'Materials', nameCN: '原材料', color: '#f59e0b' },
  SPY: { name: 'S&P 500', nameCN: '标普500', color: '#64748b' }
};

export const TIME_PERIODS = {
  day: { label: '日', labelEN: 'Daily', days: 1, dataPoints: 30 },
  week: { label: '周', labelEN: 'Weekly', days: 7, dataPoints: 12 },
  month: { label: '月', labelEN: 'Monthly', days: 30, dataPoints: 12 },
  quarter: { label: '季', labelEN: 'Quarterly', days: 90, dataPoints: 8 },
  year: { label: '年', labelEN: 'Yearly', days: 365, dataPoints: 5 }
};

export const CHART_COLORS = {
  inflow: '#d4a5ff',
  outflow: '#ffb74d',
  positive: '#d4a5ff',
  negative: '#ff5252',
  border: '#3a3a3a',
  background: '#0a0a0a',
  cardBg: '#1a1a1a'
};
