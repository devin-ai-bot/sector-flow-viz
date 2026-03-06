/**
 * Sankey Chart Component
 * Visualizes money flow using ECharts
 */

import { useMemo } from 'react';
import { SECTOR_ETFS } from '../data/sectors';

const SankeyChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data?.sectors) return null;
    
    const sectors = Object.values(data.sectors);
    
    // Create nodes
    const nodes = sectors.map(s => ({
      name: s.symbol,
      itemStyle: { color: s.color },
      label: { 
        show: true, 
        position: 'right',
        color: '#a0a0a0',
        fontSize: 11
      }
    }));
    
    // Calculate flows based on money flow
    const flows = [];
    const sortedByFlow = [...sectors].sort((a, b) => b.moneyFlow - a.moneyFlow);
    
    // Create flows from inflow sectors to outflow sectors
    const inflows = sortedByFlow.filter(s => s.moneyFlow > 0);
    const outflows = sortedByFlow.filter(s => s.moneyFlow < 0);
    
    // Simplified: show bar chart style
    return { sectors: sortedByFlow, inflows, outflows };
  }, [data]);

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64 text-[#666666]">
        Loading...
      </div>
    );
  }

  const maxFlow = Math.max(...chartData.sectors.map(s => Math.abs(s.moneyFlow)));

  return (
    <div className="space-y-2">
      {/* Legend */}
      <div className="flex gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[#d4a5ff]" />
          <span className="text-[#a0a0a0]">Inflow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[#ffb74d]" />
          <span className="text-[#a0a0a0]">Outflow</span>
        </div>
      </div>
      
      {/* Flow Bars */}
      {chartData.sectors.map(sector => {
        const isPositive = sector.moneyFlow > 0;
        const width = Math.min((Math.abs(sector.moneyFlow) / maxFlow) * 100, 100);
        
        return (
          <div key={sector.symbol} className="flex items-center gap-3 group">
            {/* Symbol */}
            <div className="w-12 flex items-center gap-1.5">
              <div 
                className="w-1.5 h-4 rounded-full" 
                style={{ backgroundColor: sector.color }}
              />
              <span className="text-xs font-medium text-[#f5f5f0]">{sector.symbol}</span>
            </div>
            
            {/* Bar Container */}
            <div className="flex-1 h-6 bg-[#141414] rounded overflow-hidden relative">
              {isPositive ? (
                <div
                  className="h-full rounded transition-all duration-500 group-hover:opacity-80"
                  style={{ 
                    width: `${width}%`,
                    backgroundColor: '#d4a5ff'
                  }}
                />
              ) : (
                <div
                  className="h-full rounded transition-all duration-500 group-hover:opacity-80"
                  style={{ 
                    width: `${width}%`,
                    backgroundColor: '#ffb74d'
                  }}
                />
              )}
            </div>
            
            {/* Value */}
            <div className="w-20 text-right">
              <span className={`text-xs font-mono ${isPositive ? 'text-[#d4a5ff]' : 'text-[#ffb74d]'}`}>
                {isPositive ? '+' : ''}{(sector.moneyFlow / 1e6).toFixed(0)}M
              </span>
            </div>
          </div>
        );
      })}
      
      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-[#2a2a2a] grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-[#666666] mb-1">Total Inflow</div>
          <div className="text-lg font-medium text-[#d4a5ff]">
            +{(chartData.inflows.reduce((a, b) => a + b.moneyFlow, 0) / 1e9).toFixed(2)}B
          </div>
        </div>
        <div>
          <div className="text-xs text-[#666666] mb-1">Total Outflow</div>
          <div className="text-lg font-medium text-[#ffb74d]">
            {(chartData.outflows.reduce((a, b) => a + b.moneyFlow, 0) / 1e9).toFixed(2)}B
          </div>
        </div>
      </div>
    </div>
  );
};

export default SankeyChart;
