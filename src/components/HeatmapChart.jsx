/**
 * Heatmap Chart Component
 * Shows sector strength/intensity
 */

import { useMemo } from 'react';

const HeatmapChart = ({ data }) => {
  const cells = useMemo(() => {
    if (!data?.sectors) return [];
    return Object.values(data.sectors).map(s => ({
      symbol: s.symbol,
      name: s.name,
      nameCN: s.nameCN,
      color: s.color,
      intensity: Math.abs(s.moneyFlow) / 1e9 // Normalize to billions
    }));
  }, [data]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 rounded">
        <p className="text-gray-500">Loading heatmap...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded">
      <h3 className="text-lg font-semibold mb-4">Sector Intensity Heatmap</h3>
      
      <div className="grid grid-cols-5 gap-2">
        {cells.map(cell => (
          <div
            key={cell.symbol}
            className="p-4 rounded transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: cell.color,
              opacity: 0.3 + cell.intensity * 0.7
            }}
          >
            <div className="text-lg font-bold">{cell.symbol}</div>
            <div className="text-xs opacity-80">{cell.nameCN}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeatmapChart;
