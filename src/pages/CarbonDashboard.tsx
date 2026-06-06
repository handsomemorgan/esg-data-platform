import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { suppliers, monthlyCarbonData } from '../data';

export default function CarbonDashboard() {
  const [viewMode, setViewMode] = useState<'trend' | 'ranking' | 'breakdown'>('trend');

  const totalScope1 = suppliers.reduce((a, b) => a + b.carbonScope1, 0);
  const totalScope2 = suppliers.reduce((a, b) => a + b.carbonScope2, 0);
  const totalScope3 = suppliers.reduce((a, b) => a + b.carbonScope3, 0);
  const totalCarbon = totalScope1 + totalScope2 + totalScope3;

  // Scope breakdown pie
  const scopePieOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} tCO₂e ({d}%)' },
    legend: { orient: 'vertical', right: '5%', top: 'center' },
    series: [{
      type: 'pie', radius: ['50%', '75%'], center: ['40%', '50%'],
      data: [
        { value: totalScope1, name: 'Scope 1 (直接排放)', itemStyle: { color: '#1a6b47' } },
        { value: totalScope2, name: 'Scope 2 (能源间接)', itemStyle: { color: '#3b82f6' } },
        { value: totalScope3, name: 'Scope 3 (其他间接)', itemStyle: { color: '#f59e0b' } },
      ],
      label: { formatter: '{b}\n{d}%' },
    }],
  };

  // Monthly trend
  const trendOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Scope 1', 'Scope 2', 'Scope 3', '总计'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: monthlyCarbonData.map(d => d.month.slice(2)) },
    yAxis: { type: 'value', name: 'tCO₂e' },
    series: [
      {
        name: 'Scope 1', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
        data: monthlyCarbonData.map(d => d.scope1),
        itemStyle: { color: '#1a6b47' },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(26,107,71,0.25)' }, { offset: 1, color: 'rgba(26,107,71,0.02)' }] } },
      },
      {
        name: 'Scope 2', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
        data: monthlyCarbonData.map(d => d.scope2),
        itemStyle: { color: '#3b82f6' },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(59,130,246,0.25)' }, { offset: 1, color: 'rgba(59,130,246,0.02)' }] } },
      },
      {
        name: 'Scope 3', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
        data: monthlyCarbonData.map(d => d.scope3),
        itemStyle: { color: '#f59e0b' },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(245,158,11,0.2)' }, { offset: 1, color: 'rgba(245,158,11,0.02)' }] } },
      },
      {
        name: '总计', type: 'line', smooth: true, lineStyle: { type: 'dashed', width: 2 },
        data: monthlyCarbonData.map(d => d.scope1 + d.scope2 + d.scope3),
        itemStyle: { color: '#6b7280' },
      },
    ],
  };

  // Carbon intensity ranking
  const sortedByIntensity = [...suppliers].sort((a, b) =>
    ((b.carbonScope1 + b.carbonScope2) / (b.energyUse || 1)) - ((a.carbonScope1 + a.carbonScope2) / (a.energyUse || 1))
  );

  const rankingOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '5%', top: '5%', containLabel: true },
    xAxis: { type: 'value', name: 'tCO₂e' },
    yAxis: { type: 'category', data: sortedByIntensity.map(s => s.name.slice(0, 6)).reverse(), axisLabel: { fontSize: 11 } },
    series: [
      {
        name: 'Scope 1', type: 'bar', stack: 'total',
        data: sortedByIntensity.map(s => s.carbonScope1).reverse(),
        itemStyle: { color: '#1a6b47' }, barWidth: '60%',
      },
      {
        name: 'Scope 2', type: 'bar', stack: 'total',
        data: sortedByIntensity.map(s => s.carbonScope2).reverse(),
        itemStyle: { color: '#3b82f6' },
      },
      {
        name: 'Scope 3', type: 'bar', stack: 'total',
        data: sortedByIntensity.map(s => s.carbonScope3).reverse(),
        itemStyle: { color: '#f59e0b' },
      },
    ],
  };

  // Scatter chart: carbon vs energy intensity
  const scatterOption = {
    tooltip: {
      formatter: (params: { name: string; value: number[] }) =>
        `${params.name}<br/>碳排放强度: ${params.value[0]} tCO₂e<br/>能耗强度: ${params.value[1]} MWh`,
    },
    grid: { left: '8%', right: '5%', bottom: '10%', top: '5%' },
    xAxis: { name: '碳排放强度 (tCO₂e)', nameLocation: 'center', nameGap: 30 },
    yAxis: { name: '能耗强度 (MWh)', nameLocation: 'center', nameGap: 35 },
    series: [{
      type: 'scatter', symbolSize: (val: number[]) => Math.sqrt(val[0] / 1000) * 8,
      data: suppliers.map(s => ({
        name: s.name,
        value: [Math.round((s.carbonScope1 + s.carbonScope2) / 1000 * 100) / 100, Math.round(s.energyUse / 1000 * 100) / 100],
        itemStyle: { color: s.riskLevel === 'high' ? '#ef4444' : s.riskLevel === 'medium' ? '#f59e0b' : '#10b981' },
      })),
      label: { show: true, formatter: (params: { name: string }) => params.name.slice(0, 4), fontSize: 10, position: 'top' },
      emphasis: { label: { fontSize: 14, fontWeight: 'bold' } },
    }],
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">碳排放仪表盘</h1>
        <p className="page-desc">展示供应商Scope 1、Scope 2排放及供应链Scope 3估算数据，生成碳排放趋势图与碳强度排名</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">总碳排放 (年度)</div>
            <div className="stat-card-value">{(totalCarbon / 1000).toFixed(0)}k</div>
            <div className="stat-card-change down">↓ 5.2%</div>
          </div>
          <div className="stat-card-icon red">🌍</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">Scope 1 直接排放</div>
            <div className="stat-card-value">{(totalScope1 / 1000).toFixed(0)}k</div>
            <div className="stat-card-change">tCO₂e</div>
          </div>
          <div className="stat-card-icon orange">🏭</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">Scope 2 能源间接排放</div>
            <div className="stat-card-value">{(totalScope2 / 1000).toFixed(0)}k</div>
            <div className="stat-card-change">tCO₂e</div>
          </div>
          <div className="stat-card-icon blue">⚡</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">碳强度 (单位产值)</div>
            <div className="stat-card-value">0.42</div>
            <div className="stat-card-change down">↓ 3.8%</div>
          </div>
          <div className="stat-card-icon purple">📉</div>
        </div>
      </div>

      {/* View mode tabs */}
      <div className="tabs">
        <div className={`tab ${viewMode === 'trend' ? 'active' : ''}`} onClick={() => setViewMode('trend')}>📈 碳排放趋势</div>
        <div className={`tab ${viewMode === 'ranking' ? 'active' : ''}`} onClick={() => setViewMode('ranking')}>📊 碳强度排名</div>
        <div className={`tab ${viewMode === 'breakdown' ? 'active' : ''}`} onClick={() => setViewMode('breakdown')}>🔍 排放结构分析</div>
      </div>

      {viewMode === 'trend' && (
        <div className="grid-2">
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-header"><span className="card-title">12个月碳排放趋势</span></div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '420px' }}>
                <ReactECharts option={trendOption} style={{ height: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'ranking' && (
        <>
          <div className="card">
            <div className="card-header"><span className="card-title">供应商碳排放排名 (Scope 1+2+3 堆叠)</span></div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '400px' }}>
                <ReactECharts option={rankingOption} style={{ height: '100%' }} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">碳排放与能耗强度散点分析</span></div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '400px' }}>
                <ReactECharts option={scatterOption} style={{ height: '100%' }} />
              </div>
              <div className="heat-legend" style={{ marginTop: '12px', justifyContent: 'center' }}>
                <div className="heat-legend-item"><div className="heat-legend-dot green" /> 低风险</div>
                <div className="heat-legend-item"><div className="heat-legend-dot yellow" /> 中风险</div>
                <div className="heat-legend-item"><div className="heat-legend-dot red" /> 高风险</div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>气泡大小=碳排总量</span>
              </div>
            </div>
          </div>
        </>
      )}

      {viewMode === 'breakdown' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header"><span className="card-title">Scope 1/2/3 排放结构</span></div>
            <div className="card-body">
              <div className="chart-container">
                <ReactECharts option={scopePieOption} style={{ height: '100%' }} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">各层级碳排放占比</span></div>
            <div className="card-body">
              <div className="chart-container">
                <ReactECharts
                  option={{
                    tooltip: { trigger: 'item', formatter: '{b}: {c} tCO₂e ({d}%)' },
                    series: [{
                      type: 'pie', radius: ['45%', '70%'], center: ['50%', '50%'],
                      data: [
                        { value: suppliers.filter(s => s.tier === 'Tier 1').reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0), name: 'Tier 1', itemStyle: { color: '#1a6b47' } },
                        { value: suppliers.filter(s => s.tier === 'Tier 2').reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0), name: 'Tier 2', itemStyle: { color: '#3b82f6' } },
                        { value: suppliers.filter(s => s.tier === 'Tier 3').reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0), name: 'Tier 3', itemStyle: { color: '#f59e0b' } },
                      ],
                    }],
                  }}
                  style={{ height: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* High carbon supplier list */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div className="card">
              <div className="card-header">
                <span className="card-title">高碳排放供应商清单 (Top 5)</span>
                <span className="badge badge-red">需重点关注</span>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>排名</th><th>供应商</th><th>层级</th>
                        <th>Scope 1</th><th>Scope 2</th><th>Scope 3</th>
                        <th>总计 (tCO₂e)</th><th>碳强度排名</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...suppliers]
                        .sort((a, b) => (b.carbonScope1 + b.carbonScope2 + b.carbonScope3) - (a.carbonScope1 + a.carbonScope2 + a.carbonScope3))
                        .slice(0, 5)
                        .map((s, i) => (
                          <tr key={s.id}>
                            <td><strong>#{i + 1}</strong></td>
                            <td style={{ fontWeight: 600 }}>{s.name}</td>
                            <td><span className="badge badge-blue">{s.tier}</span></td>
                            <td>{s.carbonScope1.toLocaleString()}</td>
                            <td>{s.carbonScope2.toLocaleString()}</td>
                            <td>{s.carbonScope3.toLocaleString()}</td>
                            <td style={{ fontWeight: 700, color: 'var(--danger)' }}>{(s.carbonScope1 + s.carbonScope2 + s.carbonScope3).toLocaleString()}</td>
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
      )}
    </div>
  );
}
