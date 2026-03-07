/**
 * US ETF Configuration — 37 ETFs across 8 thematic groups
 * aum: approximate AUM in billions USD (treemap sizing)
 */

export const ETF_GROUPS = {
  market:  { label: '市场核心',   labelEN: 'Market Core',    borderColor: '#334155' },
  sector:  { label: '行业板块',   labelEN: 'Sectors',        borderColor: '#1e3a5f' },
  tech:    { label: '科技/半导体',labelEN: 'Tech & Semi',    borderColor: '#312e81' },
  ai:      { label: 'AI/机器人',  labelEN: 'AI & Robotics',  borderColor: '#581c87' },
  defense: { label: '军工国防',   labelEN: 'Defense',        borderColor: '#374151' },
  energy:  { label: '能源',       labelEN: 'Energy',         borderColor: '#78350f' },
  infra:   { label: 'AI基础设施', labelEN: 'AI Infra',       borderColor: '#064e3b' },
  future:  { label: '未来科技',   labelEN: 'Future Tech',    borderColor: '#4a044e' },
};

export const SECTOR_ETFS = {
  // ── Market Core ──────────────────────────────────────────────────────────
  SPY:  { name: 'S&P 500',             nameCN: '标普500',   group: 'market',  aum: 570, color: '#94a3b8' },
  QQQ:  { name: 'Nasdaq 100',          nameCN: '纳斯达克',  group: 'market',  aum: 310, color: '#818cf8' },
  IWM:  { name: 'Russell 2000',        nameCN: '小盘股',    group: 'market',  aum: 62,  color: '#a78bfa' },
  VUG:  { name: 'Growth',              nameCN: '成长股',    group: 'market',  aum: 135, color: '#c4b5fd' },
  VTV:  { name: 'Value',               nameCN: '价值股',    group: 'market',  aum: 125, color: '#7c3aed' },

  // ── 11 Standard SPDR Sectors ─────────────────────────────────────────────
  XLK:  { name: 'Technology',          nameCN: '科技',      group: 'sector',  aum: 72,  color: '#3b82f6' },
  XLF:  { name: 'Financials',          nameCN: '金融',      group: 'sector',  aum: 48,  color: '#22c55e' },
  XLE:  { name: 'Energy',              nameCN: '能源',      group: 'sector',  aum: 36,  color: '#f97316' },
  XLI:  { name: 'Industrials',         nameCN: '工业',      group: 'sector',  aum: 26,  color: '#14b8a6' },
  XLV:  { name: 'Healthcare',          nameCN: '医疗',      group: 'sector',  aum: 42,  color: '#ef4444' },
  XLY:  { name: 'Consumer Disc.',      nameCN: '可选消费',  group: 'sector',  aum: 24,  color: '#fb923c' },
  XLP:  { name: 'Consumer Staples',    nameCN: '必需消费',  group: 'sector',  aum: 18,  color: '#ec4899' },
  XLU:  { name: 'Utilities',           nameCN: '公用事业',  group: 'sector',  aum: 15,  color: '#06b6d4' },
  XLB:  { name: 'Materials',           nameCN: '原材料',    group: 'sector',  aum: 7,   color: '#f59e0b' },
  XLRE: { name: 'Real Estate',         nameCN: '房地产',    group: 'sector',  aum: 5,   color: '#84cc16' },
  XLC:  { name: 'Communication',       nameCN: '通信',      group: 'sector',  aum: 20,  color: '#0ea5e9' },

  // ── Tech & Semiconductors ─────────────────────────────────────────────────
  SMH:  { name: 'Semiconductors',      nameCN: '半导体',    group: 'tech',    aum: 26,  color: '#6366f1' },
  SOXX: { name: 'Semiconductors (iS)', nameCN: '半导体(iS)',group: 'tech',    aum: 12,  color: '#4f46e5' },
  XSD:  { name: 'Semi Equipment',      nameCN: '半导体设备',group: 'tech',    aum: 1,   color: '#4338ca' },
  IGV:  { name: 'Software',            nameCN: '软件',      group: 'tech',    aum: 8,   color: '#3730a3' },
  SKYY: { name: 'Cloud Computing',     nameCN: '云计算',    group: 'tech',    aum: 3,   color: '#312e81' },
  WCLD: { name: 'Cloud SaaS',          nameCN: '云SaaS',    group: 'tech',    aum: 0.5, color: '#1e1b4b' },
  AIQ:  { name: 'AI & Big Data',       nameCN: 'AI大数据',  group: 'tech',    aum: 0.3, color: '#2d1b69' },
  CIBR: { name: 'Cybersecurity',       nameCN: '网络安全',  group: 'tech',    aum: 2,   color: '#5b21b6' },
  HACK: { name: 'Cybersecurity (PH)',  nameCN: '网络安全2', group: 'tech',    aum: 0.5, color: '#6d28d9' },

  // ── AI & Robotics ─────────────────────────────────────────────────────────
  BOTZ: { name: 'Robotics & AI',       nameCN: '机器人/AI', group: 'ai',      aum: 3,   color: '#c084fc' },
  ROBO: { name: 'Robotics',            nameCN: '机器人',    group: 'ai',      aum: 1.5, color: '#a855f7' },
  IRBO: { name: 'AI & Robotics',       nameCN: 'AI机器人',  group: 'ai',      aum: 0.6, color: '#9333ea' },

  // ── Defense ───────────────────────────────────────────────────────────────
  ITA:  { name: 'Aerospace & Defense', nameCN: '军工',      group: 'defense', aum: 7,   color: '#94a3b8' },
  XAR:  { name: 'Aerospace',           nameCN: '航空航天',  group: 'defense', aum: 2,   color: '#64748b' },

  // ── Energy (traditional + new) ───────────────────────────────────────────
  URA:  { name: 'Uranium / Nuclear',   nameCN: '核能',      group: 'energy',  aum: 3,   color: '#fbbf24' },
  TAN:  { name: 'Solar Energy',        nameCN: '太阳能',    group: 'energy',  aum: 2,   color: '#facc15' },

  // ── AI Infrastructure ─────────────────────────────────────────────────────
  SRVR: { name: 'Data Centers',        nameCN: '数据中心',  group: 'infra',   aum: 1,   color: '#2dd4bf' },
  PAVE: { name: 'Infrastructure',      nameCN: '基建',      group: 'infra',   aum: 8,   color: '#34d399' },
  GRID: { name: 'Electric Grid',       nameCN: '电网',      group: 'infra',   aum: 1,   color: '#4ade80' },

  // ── Future Tech ───────────────────────────────────────────────────────────
  ARKK: { name: 'Disruptive Innovation',nameCN: 'AI创新',   group: 'future',  aum: 7,   color: '#f472b6' },
  QTUM: { name: 'Quantum Computing',   nameCN: '量子计算',  group: 'future',  aum: 0.3, color: '#e879f9' },
  DRIV: { name: 'Autonomous Driving',  nameCN: '自动驾驶',  group: 'future',  aum: 0.2, color: '#d946ef' },
};

export const TIME_PERIODS = {
  day:     { label: '日', labelEN: 'Daily',     days: 1,   dataPoints: 30 },
  week:    { label: '周', labelEN: 'Weekly',    days: 7,   dataPoints: 12 },
  month:   { label: '月', labelEN: 'Monthly',   days: 30,  dataPoints: 12 },
  quarter: { label: '季', labelEN: 'Quarterly', days: 90,  dataPoints: 8  },
  year:    { label: '年', labelEN: 'Yearly',    days: 365, dataPoints: 5  },
};

export const CHART_COLORS = {
  inflow:     '#4ade80',
  outflow:    '#f87171',
  border:     '#1e1e1e',
  background: '#0d0d0d',
  cardBg:     '#111',
};
