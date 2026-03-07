/**
 * Heatmap Chart Component
 * Shows sector return rates over time with color coding.
 * X-axis shows real dates from data.dates.
 */

import { useMemo } from 'react';

function getColor(ret, maxAbs) {
  const intensity = Math.min(Math.abs(ret) / Math.max(maxAbs, 1), 1);
  if (ret > 0) {
    const g = Math.round(100 + 155 * intensity);
    const r = Math.round(30  * (1 - intensity));
    return `rgb(${r}, ${g}, 80)`;
  } else if (ret < 0) {
    const r = Math.round(120 + 135 * intensity);
    const g = Math.round(30  * (1 - intensity));
    return `rgb(${r}, ${g}, 60)`;
  }
  return '#2a2a2a';
}

const HeatmapChart = ({ data }) => {
  const { chartData, dates } = useMemo(() => {
    if (!data?.heatmap) return {};
    return { chartData: data.heatmap, dates: data.dates ?? [] };
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-[#555]">
        Loading...
      </div>
    );
  }

  const count      = chartData[0]?.returns.length ?? 0;
  const allReturns = chartData.flatMap(d => d.returns);
  const maxAbs     = Math.max(...allReturns.map(Math.abs));
  const avgReturn  = allReturns.reduce((a, b) => a + b, 0) / allReturns.length;

  const best = chartData.reduce((b, s) => {
    const avg = s.returns.reduce((a, v) => a + v, 0) / s.returns.length;
    return avg > b.avg ? { symbol: s.symbol, avg } : b;
  }, { symbol: '', avg: -Infinity });

  const worst = chartData.reduce((w, s) => {
    const avg = s.returns.reduce((a, v) => a + v, 0) / s.returns.length;
    return avg < w.avg ? { symbol: s.symbol, avg } : w;
  }, { symbol: '', avg: Infinity });

  // Show at most ~6 evenly-spaced date labels
  const labelStep = Math.max(1, Math.round(count / 6));
  const labelIndices = new Set(
    Array.from({ length: count }, (_, i) => i).filter(
      i => i % labelStep === 0 || i === count - 1
    )
  );

  return (
    <div>
      {/* Color scale */}
      <div className="flex items-center gap-3 mb-5 text-xs text-[#888]">
        <span style={{ color: '#f87171' }}>−5%</span>
        <div
          className="flex-1 h-2 rounded"
          style={{ background: 'linear-gradient(to right, #c53030, #2a2a2a, #22863a)' }}
        />
        <span style={{ color: '#4ade80' }}>+5%</span>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="space-y-1">
          {chartData.map(sector => (
            <div key={sector.symbol} className="flex items-center gap-2">
              <div className="w-11 text-xs font-mono text-[#ccc] text-right shrink-0">
                {sector.symbol}
              </div>
              <div className="flex-1 flex gap-px">
                {sector.returns.map((ret, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm cursor-pointer relative group"
                    style={{ backgroundColor: getColor(ret, maxAbs), minWidth: 6, height: 22 }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-[#1a1a1a] border border-[#333] rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 font-mono">
                      <span className="text-[#888]">{dates[i] ?? `[${i + 1}]`}</span>
                      {'  '}
                      <span style={{ color: ret >= 0 ? '#4ade80' : '#f87171' }}>
                        {ret >= 0 ? '+' : ''}{ret.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* X-axis date labels */}
      <div className="flex items-center gap-2 mt-1">
        <div className="w-11 shrink-0" />
        <div className="flex-1 relative" style={{ height: 18 }}>
          {[...labelIndices].map(i => (
            <span
              key={i}
              className="absolute text-[10px] font-mono text-[#444] -translate-x-1/2"
              style={{ left: `${((i + 0.5) / count) * 100}%` }}
            >
              {dates[i] ?? ''}
            </span>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-5 pt-4 border-t border-[#1e1e1e] grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs text-[#555] mb-1">最佳板块</div>
          <div className="text-sm font-mono font-medium" style={{ color: '#4ade80' }}>{best.symbol}</div>
        </div>
        <div>
          <div className="text-xs text-[#555] mb-1">最差板块</div>
          <div className="text-sm font-mono font-medium" style={{ color: '#f87171' }}>{worst.symbol}</div>
        </div>
        <div>
          <div className="text-xs text-[#555] mb-1">平均涨跌</div>
          <div
            className="text-sm font-mono font-medium"
            style={{ color: avgReturn >= 0 ? '#4ade80' : '#f87171' }}
          >
            {avgReturn >= 0 ? '+' : ''}{avgReturn.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapChart;
