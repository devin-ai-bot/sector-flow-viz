import { useState, useEffect } from 'react'
import { TIME_PERIODS } from './data/sectors'
import { fetchSectorData } from './data/api'
import TreemapChart from './components/TreemapChart'
import SankeyChart from './components/SankeyChart'
import HeatmapChart from './components/HeatmapChart'

function formatFlow(v) {
  const abs = Math.abs(v)
  const sign = v >= 0 ? '+' : '-'
  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(2)}B`
  if (abs >= 1e6) return `${sign}${Math.round(abs / 1e6)}M`
  return `${sign}${Math.round(abs / 1e3)}K`
}

function SummaryCards({ data }) {
  if (!data?.sectors) return null
  const sectors = Object.values(data.sectors)
  const totalIn  = sectors.filter(s => s.moneyFlow > 0).reduce((a, s) => a + s.moneyFlow, 0)
  const totalOut = sectors.filter(s => s.moneyFlow < 0).reduce((a, s) => a + s.moneyFlow, 0)
  const net = totalIn + totalOut
  const topIn  = sectors.reduce((a, b) => b.moneyFlow > a.moneyFlow ? b : a)
  const topOut = sectors.reduce((a, b) => b.moneyFlow < a.moneyFlow ? b : a)
  const breadth = Math.round(sectors.filter(s => s.moneyFlow > 0).length / sectors.length * 100)

  const cards = [
    {
      label: '净资金流向',
      value: formatFlow(net),
      color: net >= 0 ? '#4ade80' : '#f87171',
      sub: net >= 0 ? '市场净流入' : '市场净流出',
    },
    {
      label: '流入最多',
      value: topIn.symbol,
      color: '#4ade80',
      sub: formatFlow(topIn.moneyFlow),
    },
    {
      label: '流出最多',
      value: topOut.symbol,
      color: '#f87171',
      sub: formatFlow(topOut.moneyFlow),
    },
    {
      label: '市场宽度',
      value: `${breadth}%`,
      color: breadth >= 50 ? '#4ade80' : '#f87171',
      sub: `${sectors.filter(s => s.moneyFlow > 0).length} / ${sectors.length} 板块流入`,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {cards.map(c => (
        <div key={c.label} className="bg-[#111] border border-[#1e1e1e] rounded-xl px-5 py-4">
          <div className="text-xs text-[#555] mb-2 uppercase tracking-wider">{c.label}</div>
          <div className="text-2xl font-mono font-semibold" style={{ color: c.color }}>
            {c.value}
          </div>
          <div className="text-xs text-[#444] mt-1 font-mono">{c.sub}</div>
        </div>
      ))}
    </div>
  )
}

function Section({ title, titleCN, children }) {
  return (
    <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-6">
      <div className="flex items-baseline gap-3 mb-5">
        <h2 className="text-sm font-semibold text-[#e5e7eb] uppercase tracking-widest">
          {title}
        </h2>
        <span className="text-xs text-[#444]">{titleCN}</span>
      </div>
      {children}
    </div>
  )
}

function App() {
  const [period, setPeriod] = useState('week')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchSectorData(period).then(result => {
      setData(result)
      setLoading(false)
    })
  }, [period])

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#e8e8e8]">
      {/* Header */}
      <header className="border-b border-[#1e1e1e] px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">US Sector Flow</h1>
            <p className="text-[#555] text-xs mt-0.5">美股板块资金流动可视化</p>
          </div>

          {/* Period tabs */}
          <div className="flex gap-1">
            {Object.entries(TIME_PERIODS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                className={`px-4 py-1.5 text-sm rounded-lg transition-all duration-150 font-mono ${
                  period === key
                    ? 'bg-[#1e293b] text-[#e2e8f0] border border-[#334155]'
                    : 'text-[#555] hover:text-[#888] border border-transparent'
                }`}
              >
                {value.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-32 text-[#555]">
            <div className="animate-pulse text-sm tracking-widest">LOADING...</div>
          </div>
        ) : (
          <>
            <SummaryCards data={data} />

            <div className="space-y-4">
              <Section title="Sector Overview" titleCN="板块总览 — 块大小 = AUM，颜色 = 涨跌幅">
                <TreemapChart data={data} />
              </Section>

              <Section title="Capital Flow" titleCN="资金流向桑基图 — 流出板块 → 市场 → 流入板块">
                <SankeyChart data={data} />
              </Section>

              <Section title="Returns Heatmap" titleCN="收益热力图 — 每格代表一个时间周期的涨跌">
                <HeatmapChart data={data} />
              </Section>
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-[#1e1e1e] px-6 py-4 mt-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#444]">
          <span>数据每日通过 GitHub Actions 更新</span>
          <span>Last update: {new Date().toLocaleDateString('zh-CN')}</span>
        </div>
      </footer>
    </div>
  )
}

export default App
