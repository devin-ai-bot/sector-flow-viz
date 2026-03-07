/**
 * US ETF Configuration — 37 ETFs across 8 groups
 * Must stay in sync with src/data/sectors.js
 */

export const SECTOR_ETFS = {
  // ── Market Core ──
  SPY:  { name: 'S&P 500',              nameCN: '标普500',   group: 'market',  color: '#94a3b8' },
  QQQ:  { name: 'Nasdaq 100',           nameCN: '纳斯达克',  group: 'market',  color: '#818cf8' },
  IWM:  { name: 'Russell 2000',         nameCN: '小盘股',    group: 'market',  color: '#a78bfa' },
  VUG:  { name: 'Growth',               nameCN: '成长股',    group: 'market',  color: '#c4b5fd' },
  VTV:  { name: 'Value',                nameCN: '价值股',    group: 'market',  color: '#7c3aed' },

  // ── 11 Standard SPDR Sectors ──
  XLK:  { name: 'Technology',           nameCN: '科技',      group: 'sector',  color: '#3b82f6' },
  XLF:  { name: 'Financials',           nameCN: '金融',      group: 'sector',  color: '#22c55e' },
  XLE:  { name: 'Energy',               nameCN: '能源',      group: 'sector',  color: '#f97316' },
  XLI:  { name: 'Industrials',          nameCN: '工业',      group: 'sector',  color: '#14b8a6' },
  XLV:  { name: 'Healthcare',           nameCN: '医疗',      group: 'sector',  color: '#ef4444' },
  XLY:  { name: 'Consumer Disc.',       nameCN: '可选消费',  group: 'sector',  color: '#fb923c' },
  XLP:  { name: 'Consumer Staples',     nameCN: '必需消费',  group: 'sector',  color: '#ec4899' },
  XLU:  { name: 'Utilities',            nameCN: '公用事业',  group: 'sector',  color: '#06b6d4' },
  XLB:  { name: 'Materials',            nameCN: '原材料',    group: 'sector',  color: '#f59e0b' },
  XLRE: { name: 'Real Estate',          nameCN: '房地产',    group: 'sector',  color: '#84cc16' },
  XLC:  { name: 'Communication',        nameCN: '通信',      group: 'sector',  color: '#0ea5e9' },

  // ── Tech & Semiconductors ──
  SMH:  { name: 'Semiconductors',       nameCN: '半导体',    group: 'tech',    color: '#6366f1' },
  SOXX: { name: 'Semiconductors (iS)',  nameCN: '半导体(iS)',group: 'tech',    color: '#4f46e5' },
  XSD:  { name: 'Semi Equipment',       nameCN: '半导体设备',group: 'tech',    color: '#4338ca' },
  IGV:  { name: 'Software',             nameCN: '软件',      group: 'tech',    color: '#3730a3' },
  SKYY: { name: 'Cloud Computing',      nameCN: '云计算',    group: 'tech',    color: '#312e81' },
  WCLD: { name: 'Cloud SaaS',           nameCN: '云SaaS',    group: 'tech',    color: '#1e1b4b' },
  AIQ:  { name: 'AI & Big Data',        nameCN: 'AI大数据',  group: 'tech',    color: '#2d1b69' },
  CIBR: { name: 'Cybersecurity',        nameCN: '网络安全',  group: 'tech',    color: '#5b21b6' },
  HACK: { name: 'Cybersecurity (PH)',   nameCN: '网络安全2', group: 'tech',    color: '#6d28d9' },

  // ── AI & Robotics ──
  BOTZ: { name: 'Robotics & AI',        nameCN: '机器人/AI', group: 'ai',      color: '#c084fc' },
  ROBO: { name: 'Robotics',             nameCN: '机器人',    group: 'ai',      color: '#a855f7' },
  IRBO: { name: 'AI & Robotics',        nameCN: 'AI机器人',  group: 'ai',      color: '#9333ea' },

  // ── Defense ──
  ITA:  { name: 'Aerospace & Defense',  nameCN: '军工',      group: 'defense', color: '#94a3b8' },
  XAR:  { name: 'Aerospace',            nameCN: '航空航天',  group: 'defense', color: '#64748b' },

  // ── Energy ──
  URA:  { name: 'Uranium / Nuclear',    nameCN: '核能',      group: 'energy',  color: '#fbbf24' },
  TAN:  { name: 'Solar Energy',         nameCN: '太阳能',    group: 'energy',  color: '#facc15' },

  // ── AI Infrastructure ──
  SRVR: { name: 'Data Centers',         nameCN: '数据中心',  group: 'infra',   color: '#2dd4bf' },
  PAVE: { name: 'Infrastructure',       nameCN: '基建',      group: 'infra',   color: '#34d399' },
  GRID: { name: 'Electric Grid',        nameCN: '电网',      group: 'infra',   color: '#4ade80' },

  // ── Future Tech ──
  ARKK: { name: 'Disruptive Innovation',nameCN: 'AI创新',   group: 'future',  color: '#f472b6' },
  QTUM: { name: 'Quantum Computing',    nameCN: '量子计算',  group: 'future',  color: '#e879f9' },
  DRIV: { name: 'Autonomous Driving',   nameCN: '自动驾驶',  group: 'future',  color: '#d946ef' },
};
