import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { suppliers } from '../data';

export default function EnvironmentalPerformance() {
  const [metric, setMetric] = useState<'water' | 'energy' | 'waste' | 'chemical'>('water');

  // Top consumers by metric
  const getTopConsumers = (m: string) => {
    const key = m === 'water' ? 'waterUse' : m === 'energy' ? 'energyUse' : m === 'waste' ? 'solidWaste' : 'chemicalUse';
    const unit = m === 'water' ? 'm³' : m === 'energy' ? 'MWh' : m === 'waste' ? '吨' : '吨';
    const label = m === 'water' ? '水耗' : m === 'energy' ? '能耗' : m === 'waste' ? '固废' : '化学品';
    return [...suppliers]
      .sort((a, b) => (b[key] as number) - (a[key] as number))
      .slice(0, 10)
      .map(s => ({ name: s.name.slice(0, 6), value: s[key] as number, unit, label }));
  };

  const topData = getTopConsumers(metric);

  const barOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '8%', bottom: '5%', top: '5%', containLabel: true },
    xAxis: { type: 'value', name: topData[0]?.unit || '' },
    yAxis: {
      type: 'category',
      data: topData.map(d => d.name).reverse(),
      axisLabel: { fontSize: 12 },
    },
    series: [{
      type: 'bar',
      data: topData.map(d => ({
        value: d.value,
        itemStyle: {
          color: d.value > (topData[0]?.value || 1000) * 0.7 ? '#ef4444' :
                 d.value > (topData[0]?.value || 1000) * 0.4 ? '#f59e0b' : '#10b981',
          borderRadius: [0, 6, 6, 0],
        },
      })),
      barWidth: '55%',
      label: { show: true, position: 'right', fontSize: 11, formatter: '{c}' },
    }],
  };

  // Radar for all metrics
  const radarOption = {
    tooltip: {},
    legend: {
      data: ['Tier 1 平均', 'Tier 2 平均', 'Tier 3 平均'],
      bottom: 0,
    },
    radar: {
      indicator: [
        { name: '水耗 (百m³)', max: 500 },
        { name: '能耗 (MWh)', max: 60000 },
        { name: '废水 (百m³)', max: 500 },
        { name: '固废 (吨)', max: 900 },
        { name: '化学品 (吨)', max: 350 },
      ],
      center: ['50%', '50%'],
      radius: '65%',
    },
    series: [
      {
        name: 'Tier 2 平均', type: 'radar',
        data: [{
          value: [
            Math.round(suppliers.filter(s => s.tier === 'Tier 2').reduce((a, b) => a + b.waterUse, 0) / 300 / 100),
            Math.round(suppliers.filter(s => s.tier === 'Tier 2').reduce((a, b) => a + b.energyUse, 0) / 3),
            Math.round(suppliers.filter(s => s.tier === 'Tier 2').reduce((a, b) => a + b.wasteWater, 0) / 300 / 100),
            Math.round(suppliers.filter(s => s.tier === 'Tier 2').reduce((a, b) => a + b.solidWaste, 0) / 3),
            Math.round(suppliers.filter(s => s.tier === 'Tier 2').reduce((a, b) => a + b.chemicalUse, 0) / 3),
          ],
          name: 'Tier 2 平均',
        }],
        itemStyle: { color: '#3b82f6' },
        areaStyle: { color: 'rgba(59,130,246,0.15)' },
        lineStyle: { color: '#3b82f6' },
      },
      {
        name: 'Tier 1 平均', type: 'radar',
        data: [{
          value: [
            Math.round(suppliers.filter(s => s.tier === 'Tier 1').reduce((a, b) => a + b.waterUse, 0) / 400 / 100),
            Math.round(suppliers.filter(s => s.tier === 'Tier 1').reduce((a, b) => a + b.energyUse, 0) / 4),
            Math.round(suppliers.filter(s => s.tier === 'Tier 1').reduce((a, b) => a + b.wasteWater, 0) / 400 / 100),
            Math.round(suppliers.filter(s => s.tier === 'Tier 1').reduce((a, b) => a + b.solidWaste, 0) / 4),
            Math.round(suppliers.filter(s => s.tier === 'Tier 1').reduce((a, b) => a + b.chemicalUse, 0) / 4),
          ],
          name: 'Tier 1 平均',
        }],
        itemStyle: { color: '#1a6b47' },
        areaStyle: { color: 'rgba(26,107,71,0.15)' },
        lineStyle: { color: '#1a6b47' },
      },
      {
        name: 'Tier 3 平均', type: 'radar',
        data: [{
          value: [
            Math.round(suppliers.filter(s => s.tier === 'Tier 3').reduce((a, b) => a + b.waterUse, 0) / 300 / 100),
            Math.round(suppliers.filter(s => s.tier === 'Tier 3').reduce((a, b) => a + b.energyUse, 0) / 3),
            Math.round(suppliers.filter(s => s.tier === 'Tier 3').reduce((a, b) => a + b.wasteWater, 0) / 300 / 100),
            Math.round(suppliers.filter(s => s.tier === 'Tier 3').reduce((a, b) => a + b.solidWaste, 0) / 3),
            Math.round(suppliers.filter(s => s.tier === 'Tier 3').reduce((a, b) => a + b.chemicalUse, 0) / 3),
          ],
          name: 'Tier 3 平均',
        }],
        itemStyle: { color: '#f59e0b' },
        areaStyle: { color: 'rgba(245,158,11,0.15)' },
        lineStyle: { color: '#f59e0b' },
      },
    ],
  };

  // Get high consumers list
  const highWaterConsumers = [...suppliers].sort((a, b) => b.waterUse - a.waterUse).slice(0, 5);
  const highEnergyConsumers = [...suppliers].sort((a, b) => b.energyUse - a.energyUse).slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">环境绩效看板</h1>
        <p className="page-desc">跟踪能耗、水耗、废水、废弃物、化学品等关键环境数据，识别高耗能、高耗水供应商</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">总用水量 (年度)</div>
            <div className="stat-card-value">{(suppliers.reduce((a, b) => a + b.waterUse, 0) / 10000).toFixed(0)}万</div>
            <div className="stat-card-change">m³</div>
          </div>
          <div className="stat-card-icon blue">💧</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">总能耗 (年度)</div>
            <div className="stat-card-value">{(suppliers.reduce((a, b) => a + b.energyUse, 0) / 1000).toFixed(0)}k</div>
            <div className="stat-card-change">MWh</div>
          </div>
          <div className="stat-card-icon orange">⚡</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">废水排放总量</div>
            <div className="stat-card-value">{(suppliers.reduce((a, b) => a + b.wasteWater, 0) / 10000).toFixed(0)}万</div>
            <div className="stat-card-change">m³</div>
          </div>
          <div className="stat-card-icon red">🟤</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">化学品使用总量</div>
            <div className="stat-card-value">{suppliers.reduce((a, b) => a + b.chemicalUse, 0)}</div>
            <div className="stat-card-change">吨</div>
          </div>
          <div className="stat-card-icon purple">🧪</div>
        </div>
      </div>

      {/* Metric selector */}
      <div className="tabs">
        <div className={`tab ${metric === 'water' ? 'active' : ''}`} onClick={() => setMetric('water')}>💧 水耗排名</div>
        <div className={`tab ${metric === 'energy' ? 'active' : ''}`} onClick={() => setMetric('energy')}>⚡ 能耗排名</div>
        <div className={`tab ${metric === 'waste' ? 'active' : ''}`} onClick={() => setMetric('waste')}>🗑️ 固废排名</div>
        <div className={`tab ${metric === 'chemical' ? 'active' : ''}`} onClick={() => setMetric('chemical')}>🧪 化学品排名</div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              {metric === 'water' ? '💧 水耗' : metric === 'energy' ? '⚡ 能耗' : metric === 'waste' ? '🗑️ 固废' : '🧪 化学品'} Top 10 排名
            </span>
          </div>
          <div className="card-body">
            <div className="chart-container" style={{ height: '380px' }}>
              <ReactECharts option={barOption} style={{ height: '100%' }} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">各层级环境绩效雷达图</span></div>
          <div className="card-body">
            <div className="chart-container" style={{ height: '380px' }}>
              <ReactECharts option={radarOption} style={{ height: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* High consumer lists */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">高耗水供应商清单</span>
            <span className="badge badge-red">重点关注</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>排名</th><th>供应商</th><th>层级</th><th>水耗 (m³)</th><th>废水排放 (m³)</th><th>风险等级</th></tr>
                </thead>
                <tbody>
                  {highWaterConsumers.map((s, i) => (
                    <tr key={s.id}>
                      <td><strong>#{i + 1}</strong></td>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td><span className="badge badge-blue">{s.tier}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--danger)' }}>{s.waterUse.toLocaleString()}</td>
                      <td>{s.wasteWater.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${s.riskLevel === 'high' ? 'badge-red' : s.riskLevel === 'medium' ? 'badge-yellow' : 'badge-green'}`}>
                          {s.riskLevel === 'high' ? '高' : s.riskLevel === 'medium' ? '中' : '低'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">高耗能供应商清单</span>
            <span className="badge badge-red">重点关注</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>排名</th><th>供应商</th><th>层级</th><th>能耗 (MWh)</th><th>碳排放 (tCO₂e)</th><th>风险等级</th></tr>
                </thead>
                <tbody>
                  {highEnergyConsumers.map((s, i) => (
                    <tr key={s.id}>
                      <td><strong>#{i + 1}</strong></td>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td><span className="badge badge-blue">{s.tier}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--danger)' }}>{s.energyUse.toLocaleString()}</td>
                      <td>{(s.carbonScope1 + s.carbonScope2).toLocaleString()}</td>
                      <td>
                        <span className={`badge ${s.riskLevel === 'high' ? 'badge-red' : s.riskLevel === 'medium' ? 'badge-yellow' : 'badge-green'}`}>
                          {s.riskLevel === 'high' ? '高' : s.riskLevel === 'medium' ? '中' : '低'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
