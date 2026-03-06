import { useState, useEffect } from 'react'
import { SECTOR_ETFS, TIME_PERIODS, CHART_COLORS } from './data/sectors'
import { fetchSectorData } from './data/api'
import SankeyChart from './components/SankeyChart'
import HeatmapChart from './components/HeatmapChart'

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
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f0]">
      {/* Header */}
      <header className="border-b border-[#2a2a2a] px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-medium tracking-tight">US Sector Flow</h1>
          <p className="text-[#a0a0a0] mt-1 text-sm">美股板块资金流动可视化</p>
        </div>
      </header>

      {/* Time Period Selector */}
      <div className="border-b border-[#2a2a2a] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-center gap-2">
          {Object.entries(TIME_PERIODS).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-4 py-2 text-sm rounded transition-all duration-200 ${
                period === key
                  ? 'bg-[#1a1a1a] text-[#d4a5ff] border border-[#d4a5ff]'
                  : 'bg-transparent text-[#666666] border border-[#2a2a2a] hover:border-[#3a3a3a] hover:text-[#a0a0a0]'
              }`}
            >
              {value.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-[#a0a0a0]">
            <div className="animate-pulse">Loading...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sankey Chart */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              <h3 className="text-lg font-medium mb-4">Money Flow</h3>
              <SankeyChart data={data} />
            </div>

            {/* Heatmap */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              <h3 className="text-lg font-medium mb-4">Returns Heatmap</h3>
              <HeatmapChart data={data} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] px-6 py-4 mt-8">
        <div className="max-w-7xl mx-auto text-center text-xs text-[#666666]">
          Data updates daily via GitHub Actions · Last update: {new Date().toLocaleDateString()}
        </div>
      </footer>
    </div>
  )
}

export default App
