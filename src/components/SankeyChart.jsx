/**
 * Sankey Chart Component
 * Three-layer structure:  outflow sectors → MARKET → inflow sectors
 *
 * Node depth is auto-assigned by ECharts based on link topology:
 *   depth 0 — sectors with only outgoing links  (pure outflow)
 *   depth 1 — MARKET node (receives outflow, distributes to inflow)
 *   depth 2 — sectors with only incoming links  (pure inflow)
 *
 * Link width ∝ money flow value (millions USD).
 */

import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

function formatFlow(v) {
  const abs = Math.abs(v);
  const sign = v >= 0 ? '+' : '-';
  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}${Math.round(abs / 1e6)}M`;
  return `${sign}${Math.round(abs / 1e3)}K`;
}

const SankeyChart = ({ data }) => {
  const { option, summary } = useMemo(() => {
    if (!data?.sectors) return {};

    const sectors  = Object.values(data.sectors);
    const outflows = sectors.filter(s => s.moneyFlow < 0).sort((a, b) => a.moneyFlow - b.moneyFlow);
    const inflows  = sectors.filter(s => s.moneyFlow > 0).sort((a, b) => b.moneyFlow - a.moneyFlow);

    if (!outflows.length || !inflows.length) return {};

    const totalOut = outflows.reduce((s, x) => s + Math.abs(x.moneyFlow), 0);
    const totalIn  = inflows.reduce((s, x) => s + x.moneyFlow, 0);

    // Suffix inflow sector names to keep ECharts node names unique
    // (a sector that has the same symbol on both sides would break the chart)
    const inflowKey = s => s.symbol + '\u200b'; // zero-width space suffix

    const nodes = [
      ...outflows.map(s => ({
        name: s.symbol,
        itemStyle: { color: '#ef4444', borderColor: '#7f1d1d' },
        label: { color: '#fca5a5', fontFamily: 'monospace', fontSize: 12 },
      })),
      {
        name: 'MARKET',
        itemStyle: { color: '#374151', borderColor: '#4b5563' },
        label: {
          color: '#9ca3af',
          fontSize: 13,
          fontWeight: 'bold',
          fontFamily: 'sans-serif',
        },
      },
      ...inflows.map(s => ({
        name: inflowKey(s),
        itemStyle: { color: '#22c55e', borderColor: '#14532d' },
        label: { color: '#86efac', fontFamily: 'monospace', fontSize: 12 },
      })),
    ];

    const links = [
      ...outflows.map(s => ({
        source: s.symbol,
        target: 'MARKET',
        value: Math.max(1, Math.round(Math.abs(s.moneyFlow) / 1e6)),
      })),
      ...inflows.map(s => ({
        source: 'MARKET',
        target: inflowKey(s),
        value: Math.max(1, Math.round(s.moneyFlow / 1e6)),
      })),
    ];

    const opt = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#1a1a1a',
        borderColor: '#333',
        textStyle: { color: '#e5e7eb', fontSize: 12, fontFamily: 'monospace' },
        formatter: params => {
          if (params.dataType === 'edge') {
            const src = params.data.source.replace(/\u200b/g, '');
            const tgt = params.data.target.replace(/\u200b/g, '');
            return `${src} → ${tgt}<br/><b>${params.data.value}M</b>`;
          }
          const name = params.name.replace(/\u200b/g, '');
          return `<b>${name}</b>`;
        },
      },
      series: [
        {
          type: 'sankey',
          orient: 'horizontal',
          left: '1%',
          right: '8%',
          top: 24,
          bottom: 16,
          nodeWidth: 14,
          nodeGap: 10,
          data: nodes,
          links,
          emphasis: { focus: 'adjacency' },
          // depth-based styling: left links red, right links green
          levels: [
            {
              depth: 0,
              itemStyle: { color: '#ef4444', borderColor: '#7f1d1d' },
              lineStyle: { color: 'source', opacity: 0.45 },
            },
            {
              depth: 1,
              itemStyle: { color: '#374151', borderColor: '#4b5563' },
              lineStyle: { color: 'target', opacity: 0.45 },
            },
            {
              depth: 2,
              itemStyle: { color: '#22c55e', borderColor: '#14532d' },
            },
          ],
          lineStyle: { curveness: 0.5 },
          label: {
            formatter: p => p.name.replace(/\u200b/g, ''),
          },
        },
      ],
    };

    return {
      option: opt,
      summary: { totalIn, totalOut, net: totalIn - totalOut },
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
      {/* Legend */}
      <div className="flex items-center gap-6 mb-2 text-xs text-[#888]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#ef4444]" />
          <span>净流出板块</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#374151]" />
          <span>MARKET（中转节点）</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#22c55e]" />
          <span>净流入板块</span>
        </div>
        <span className="ml-auto text-[#444]">节点宽度 ∝ 资金量</span>
      </div>

      <ReactECharts
        option={option}
        style={{ height: 560 }}
        opts={{ renderer: 'canvas' }}
      />

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1e1e1e] text-center">
        <div>
          <div className="text-xs text-[#555] mb-1">总流入</div>
          <div className="text-base font-mono font-semibold text-[#4ade80]">
            {formatFlow(summary.totalIn)}
          </div>
        </div>
        <div>
          <div className="text-xs text-[#555] mb-1">净流向</div>
          <div
            className="text-base font-mono font-semibold"
            style={{ color: summary.net >= 0 ? '#4ade80' : '#f87171' }}
          >
            {formatFlow(summary.net)}
          </div>
        </div>
        <div>
          <div className="text-xs text-[#555] mb-1">总流出</div>
          <div className="text-base font-mono font-semibold text-[#f87171]">
            {formatFlow(-summary.totalOut)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SankeyChart;
