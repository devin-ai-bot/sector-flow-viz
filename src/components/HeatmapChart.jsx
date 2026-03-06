/**
 * Heatmap Chart Component
 * Shows sector return rates with color coding
 */

import { useMemo } from 'react';

const HeatmapChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data?.heatmap) return null;
    return data.heatmap;
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-[#666666]">
        Loading...
      </div>
    );
  }

  const maxReturn = Math.max(...chartData.flatMap(d => d.returns.map(Math.abs)));

  return (
    <div className="space-y-3">
      {/* Legend */}
      <div className="flex items-center justify-between text-xs mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[#ff5252]" />
          <span className="text-[#a0a0a0]">-5%</span>
        </div>
        <div className="text-[#666666]">0%</div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#a0a0a0]">+5%</span>
          <div className="w-3 h-3 rounded-sm bg-[#d4a5ff]" />
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-1">
        {chartData.map((sector, idx) => (
          <div key={sector.symbol} className="flex items-center gap-2">
            {/* Symbol */}
            <div className="w-10 text-xs text-[#a0a0a0]">{sector.symbol}</div>
            
            {/* Return Cells */}
            <div className="flex-1 flex gap-0.5">
              {sector.returns.map((ret, i) => {
                const intensity = Math.abs(ret) / 5;
                const isPositive = ret >= 0;
                const bgColor = isPositive 
                  ? `rgba(212, 165, 255, ${Math.min(intensity, 1)})` 
                  : `rgba(255, 82, 82, ${Math.min(intensity, 1)})`;
                
                return (
                  <div
                    key={i}
                    className="flex-1 h-5 rounded-sm cursor-pointer transition-transform hover:scale-110 hover:z-10 relative group"
                    style={{ backgroundColor: bgColor }}
                    title={`${sector.symbol} Day ${i + 1}: ${ret > 0 ? '+' : ''}${ret.toFixed(2)}%`}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-[#2a2a2a] rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                      {ret > 0 ? '+' : ''}{ret.toFixed(2)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Day Labels */}
      <div className="flex items-center gap-2 mt-2">
        <div className="w-10" />
        <div className="flex-1 flex justify-between text-xs text-[#666666]">
          <span>30d ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-[#2a2a2a]">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-[#666666] mb-1">Best</div>
            <div className="text-sm font-medium text-[#d4a5ff]">
              {chartData.reduce((best, s) => {
                const max = Math.max(...s.returns);
                return max > best.val ? { symbol: s.symbol, val: max } : best;
              }, { symbol: '', val: -Infinity }).symbol}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#666666] mb-1">Worst</div>
            <div className="text-sm font-medium text-[#ff5252]">
              {chartData.reduce((worst, s) => {
                const min = Math.min(...s.returns);
                return min < worst.val ? { symbol: s.symbol, val: min } : worst;
              }, { symbol: '', val: Infinity }).symbol}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#666666] mb-1">Avg Return</div>
            <div className="text-sm font-medium text-[#f5f5f0]">
              {(() => {
                const allReturns = chartData.flatMap(s => s.returns);
                const avg = allReturns.reduce((a, b) => a + b, 0) / allReturns.length;
                return `${avg > 0 ? '+' : ''}${avg.toFixed(2)}%`;
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapChart;
