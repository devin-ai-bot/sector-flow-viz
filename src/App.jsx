import { useState, useEffect } from 'react'
import { SECTOR_ETFS, TIME_PERIODS } from './data/sectors'
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
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">US Sector Flow Visualization</h1>
        <p className="text-gray-400">美股板块资金流动可视化</p>
      </header>

      {/* Time Period Selector */}
      <div className="flex gap-4 mb-8">
        {Object.entries(TIME_PERIODS).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            className={`px-4 py-2 border transition-colors ${
              period === key
                ? 'border-[#d4a5ff] text-[#d4a5ff]'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {value.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-12 text-gray-500">
            Loading data...
          </div>
        ) : (
          <>
            <SankeyChart data={data} />
            <HeatmapChart data={data} />
          </>
        )}
      </div>

      {/* Sector Grid */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Sectors</h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(SECTOR_ETFS).map(([symbol, info]) => (
            <div key={symbol} className="bg-gray-800 p-4 rounded">
              <div className="text-2xl font-bold" style={{ color: info.color }}>{symbol}</div>
              <div className="text-sm text-gray-400">{info.name}</div>
              <div className="text-xs text-gray-500">{info.nameCN}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
