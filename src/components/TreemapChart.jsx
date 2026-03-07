/**
 * Sector Treemap Component
 * Groups = thematic categories (market / sector / tech / ai / ...)
 * Leaf blocks sized by AUM, colored by return rate.
 */

import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { ETF_GROUPS } from '../data/sectors';

function returnToColor(ret) {
  if (ret >=  4) return '#14532d';
  if (ret >=  2) return '#166534';
  if (ret >=  1) return '#15803d';
  if (ret >=  0) return '#16a34a';
  if (ret > -1)  return '#dc2626';
  if (ret > -2)  return '#b91c1c';
  if (ret > -4)  return '#991b1b';
  return '#7f1d1d';
}

function formatFlow(v) {
  if (v == null) return '—';
  const abs = Math.abs(v);
  const sign = v >= 0 ? '+' : '-';
  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(2)}B`;
  return `${sign}${Math.round(abs / 1e6)}M`;
}

const TreemapChart = ({ data }) => {
  const option = useMemo(() => {
    if (!data?.sectors) return null;

    const sectors = Object.values(data.sectors);

    // Group sectors into nested structure
    const groupMap = {};
    sectors.forEach(s => {
      const g = s.group || 'sector';
      if (!groupMap[g]) groupMap[g] = [];
      groupMap[g].push(s);
    });

    // Build ECharts treemap data: one node per group, children = ETFs
    const chartData = Object.entries(groupMap)
      .filter(([, items]) => items.length > 0)
      .map(([groupKey, items]) => {
        const groupInfo = ETF_GROUPS[groupKey] || { label: groupKey, borderColor: '#333' };
        return {
          name: groupInfo.label,
          // group value = sum of children AUM (for proportional sizing)
          value: items.reduce((s, x) => s + (x.aum || 1), 0),
          itemStyle: { borderColor: groupInfo.borderColor, borderWidth: 3 },
          children: items.map(s => ({
            name: s.symbol,
            value: Math.max(s.aum || 1, 0.1),
            change: s.change,
            nameCN: s.nameCN,
            moneyFlow: s.moneyFlow,
            itemStyle: { color: returnToColor(s.change) },
          })),
        };
      });

    return {
      backgroundColor: 'transparent',
      tooltip: {
        backgroundColor: '#1a1a1a',
        borderColor: '#2a2a2a',
        textStyle: { color: '#e5e7eb', fontSize: 12, fontFamily: 'monospace' },
        formatter: p => {
          const d = p.data;
          if (!d.change && d.change !== 0) return `<b>${d.name}</b>`; // group header
          return [
            `<b style="font-size:14px">${d.name}</b>&nbsp;&nbsp;<span style="color:#6b7280">${d.nameCN}</span>`,
            `涨跌：<b style="color:${d.change >= 0 ? '#4ade80' : '#f87171'}">${d.change >= 0 ? '+' : ''}${d.change.toFixed(2)}%</b>`,
            `资金流：<b style="color:${(d.moneyFlow ?? 0) >= 0 ? '#4ade80' : '#f87171'}">${formatFlow(d.moneyFlow)}</b>`,
          ].join('<br/>');
        },
      },
      series: [
        {
          type: 'treemap',
          data: chartData,
          width: '100%',
          height: '100%',
          roam: false,
          nodeClick: false,
          breadcrumb: { show: false },
          // Group-level label (shown in header bar of each group)
          upperLabel: {
            show: true,
            height: 22,
            color: 'rgba(255,255,255,0.55)',
            fontSize: 10,
            fontFamily: 'monospace',
            fontWeight: 'normal',
            verticalAlign: 'middle',
            padding: [0, 6],
          },
          // Leaf-level label
          label: {
            show: true,
            formatter: p => {
              const d = p.data;
              if (!d.change && d.change !== 0) return d.name;
              const ch = `${d.change >= 0 ? '+' : ''}${d.change.toFixed(2)}%`;
              return `{sym|${d.name}}\n{cn|${d.nameCN}}\n{ch|${ch}}`;
            },
            rich: {
              sym: { fontSize: 15, fontWeight: 'bold', color: 'rgba(255,255,255,0.92)', fontFamily: 'monospace', lineHeight: 22 },
              cn:  { fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 15 },
              ch:  { fontSize: 12, fontWeight: 'bold', color: 'rgba(255,255,255,0.88)', fontFamily: 'monospace', lineHeight: 20 },
            },
          },
          levels: [
            // Depth 0 — group containers
            {
              itemStyle: { borderWidth: 3, gapWidth: 5 },
              upperLabel: { show: true },
            },
            // Depth 1 — individual ETF leaves
            {
              itemStyle: { borderWidth: 1, gapWidth: 1, borderColor: 'rgba(0,0,0,0.3)' },
              upperLabel: { show: false },
            },
          ],
        },
      ],
    };
  }, [data]);

  if (!option) {
    return (
      <div className="flex items-center justify-center h-64 text-[#555]">
        Loading...
      </div>
    );
  }

  return (
    <div>
      {/* Group color legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(ETF_GROUPS).map(([key, g]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-[#666]">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: g.borderColor }}
            />
            <span>{g.label}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-2 text-xs text-[#444]">
          <div className="w-3 h-3 rounded-sm bg-[#15803d]" />
          <span>涨</span>
          <div className="w-3 h-3 rounded-sm bg-[#b91c1c]" />
          <span>跌</span>
        </div>
      </div>

      <ReactECharts
        option={option}
        style={{ height: 400 }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default TreemapChart;
