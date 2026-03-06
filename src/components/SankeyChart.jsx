/**
 * Sankey Chart Component
 * Visualizes money flow between sectors
 */

import { useMemo } from 'react';

const SankeyChart = ({ data, height = 500 }) => {
  const nodes = useMemo(() => {
    if (!data?.sectors) return [];
    return Object.values(data.sectors).map(s => ({
      name: s.symbol,
      displayName: s.name,
      color: s.color,
      flow: s.moneyFlow
    }));
  }, [data]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 rounded">
        <p className="text-gray-500">Loading chart...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded">
      <h3 className="text-lg font-semibold mb-4">Sector Money Flow</h3>
      
      {/* Sector Flow Bars */}
      <div className="space-y-3">
        {nodes.map(node => {
          const isPositive = node.flow > 0;
          const barWidth = Math.min(Math.abs(node.flow) / 1e9 * 100, 100);
          
          return (
            <div key={node.name} className="flex items-center gap-3">
              <span className="w-12 text-sm font-mono">{node.name}</span>
              <div className="flex-1 h-6 bg-gray-700 rounded overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: isPositive ? '#d4a5ff' : '#ffb74d'
                  }}
                />
              </div>
              <span className={`text-sm w-24 text-right ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{(node.flow / 1e6).toFixed(1)}M
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#d4a5ff' }} />
          <span className="text-gray-400">Inflow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ffb74d' }} />
          <span className="text-gray-400">Outflow</span>
        </div>
      </div>
    </div>
  );
};

export default SankeyChart;
