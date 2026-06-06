import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { suppliers, monthlyCarbonData } from '../data';
import { useLang } from '../context/LanguageContext';
import { t } from '../i18n';

const C1 = '#2563eb'; const C2 = '#3b82f6'; const C3 = '#60a5fa'; const C4 = '#93c5fd';
const CR = '#ef4444'; const AX = '#e2e8f0'; const TX = '#64748b';

export default function CarbonDashboard() {
  const { lang } = useLang();
  const [viewMode, setViewMode] = useState<'trend' | 'ranking' | 'breakdown'>('trend');
  const totalScope1 = suppliers.reduce((a, b) => a + b.carbonScope1, 0);
  const totalScope2 = suppliers.reduce((a, b) => a + b.carbonScope2, 0);
  const totalScope3 = suppliers.reduce((a, b) => a + b.carbonScope3, 0);
  const totalCarbon = totalScope1 + totalScope2 + totalScope3;
  const as = { axisLabel: { color: TX }, axisLine: { lineStyle: { color: AX } }, splitLine: { lineStyle: { color: AX } } };
  const nt = { nameTextStyle: { color: TX } };

  const scopePieOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} tCO₂e ({d}%)' },
    legend: { orient: 'vertical', right: '5%', top: 'center', textStyle: { color: TX } },
    series: [{ type: 'pie', radius: ['50%', '75%'], center: ['40%', '50%'], itemStyle: { borderColor: '#fff', borderWidth: 3 }, data: [{ value: totalScope1, name: 'Scope 1 (Direct)', itemStyle: { color: C1 } }, { value: totalScope2, name: 'Scope 2 (Energy)', itemStyle: { color: C2 } }, { value: totalScope3, name: 'Scope 3 (Other)', itemStyle: { color: C3 } }], label: { formatter: '{b}\n{d}%', color: TX } }],
  };

  const trendOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Scope 1', 'Scope 2', 'Scope 3', 'Total'], bottom: 0, textStyle: { color: TX } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: monthlyCarbonData.map(d => d.month.slice(2)), ...as },
    yAxis: { type: 'value', name: 'tCO₂e', ...as, ...nt },
    series: [
      { name: 'Scope 1', type: 'line', smooth: true, data: monthlyCarbonData.map(d => d.scope1), itemStyle: { color: C1 }, lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 5, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(37,99,235,0.12)' }, { offset: 1, color: 'rgba(37,99,235,0.01)' }] } } },
      { name: 'Scope 2', type: 'line', smooth: true, data: monthlyCarbonData.map(d => d.scope2), itemStyle: { color: C2 }, lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 5, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(59,130,246,0.12)' }, { offset: 1, color: 'rgba(59,130,246,0.01)' }] } } },
      { name: 'Scope 3', type: 'line', smooth: true, data: monthlyCarbonData.map(d => d.scope3), itemStyle: { color: C3 }, lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 5, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(96,165,250,0.1)' }, { offset: 1, color: 'rgba(96,165,250,0.01)' }] } } },
      { name: 'Total', type: 'line', smooth: true, data: monthlyCarbonData.map(d => d.scope1 + d.scope2 + d.scope3), itemStyle: { color: C4 }, lineStyle: { type: 'dashed', width: 2 } },
    ],
  };

  const sortedByIntensity = [...suppliers].sort((a, b) => ((b.carbonScope1 + b.carbonScope2) / (b.energyUse || 1)) - ((a.carbonScope1 + a.carbonScope2) / (a.energyUse || 1)));
  const rankingOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } }, legend: { bottom: 0, textStyle: { color: TX } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'value', name: 'tCO₂e', ...as, ...nt },
    yAxis: { type: 'category', data: sortedByIntensity.map(s => s.name.slice(0, 6)).reverse(), ...as },
    series: [
      { name: 'Scope 1', type: 'bar', stack: 'total', data: sortedByIntensity.map(s => s.carbonScope1).reverse(), itemStyle: { color: C1 }, barWidth: '55%' },
      { name: 'Scope 2', type: 'bar', stack: 'total', data: sortedByIntensity.map(s => s.carbonScope2).reverse(), itemStyle: { color: C2 } },
      { name: 'Scope 3', type: 'bar', stack: 'total', data: sortedByIntensity.map(s => s.carbonScope3).reverse(), itemStyle: { color: C3 } },
    ],
  };

  const scatterOption = {
    tooltip: { formatter: (params: { name: string; value: number[] }) => `${params.name}<br/>Carbon Intensity: ${params.value[0]}<br/>Energy Intensity: ${params.value[1]} MWh` },
    grid: { left: '8%', right: '5%', bottom: '10%', top: '5%' },
    xAxis: { name: 'Carbon Intensity (tCO₂e)', ...nt, ...as },
    yAxis: { name: 'Energy Intensity (MWh)', ...nt, ...as },
    series: [{ type: 'scatter', symbolSize: (val: number[]) => Math.sqrt(val[0] / 1000) * 8, data: suppliers.map(s => ({ name: s.name, value: [Math.round((s.carbonScope1 + s.carbonScope2) / 1000 * 100) / 100, Math.round(s.energyUse / 1000 * 100) / 100], itemStyle: { color: s.riskLevel === 'high' ? CR : s.riskLevel === 'medium' ? C2 : C1 } })), label: { show: true, formatter: (params: { name: string }) => params.name.slice(0, 4), fontSize: 10, color: TX, position: 'top' }, emphasis: { label: { fontSize: 14, fontWeight: 'bold' } } }],
  };

  return (
    <div>
      <div className="page-header"><h1 className="page-title">{t(lang, 'carbon.title')}</h1><p className="page-desc">{t(lang, 'carbon.desc')}</p></div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'carbon.totalCarbon')}</div><div className="stat-card-value">{(totalCarbon / 1000).toFixed(0)}k</div><div className="stat-card-change up">-5.2%</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'carbon.scope1')}</div><div className="stat-card-value">{(totalScope1 / 1000).toFixed(0)}k</div><div className="stat-card-change">tCO₂e</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'carbon.scope2')}</div><div className="stat-card-value">{(totalScope2 / 1000).toFixed(0)}k</div><div className="stat-card-change">tCO₂e</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'carbon.intensity')}</div><div className="stat-card-value">0.42</div><div className="stat-card-change up">-3.8%</div></div></div>
      </div>
      <div className="tabs"><div className={`tab ${viewMode === 'trend' ? 'active' : ''}`} onClick={() => setViewMode('trend')}>{t(lang, 'carbon.tabTrend')}</div><div className={`tab ${viewMode === 'ranking' ? 'active' : ''}`} onClick={() => setViewMode('ranking')}>{t(lang, 'carbon.tabRanking')}</div><div className={`tab ${viewMode === 'breakdown' ? 'active' : ''}`} onClick={() => setViewMode('breakdown')}>{t(lang, 'carbon.tabBreakdown')}</div></div>
      {viewMode === 'trend' && <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'carbon.trendTitle')}</span></div><div className="card-body"><div className="chart-container" style={{ height: '420px' }}><ReactECharts option={trendOption} style={{ height: '100%' }} /></div></div></div>}
      {viewMode === 'ranking' && (<><div className="card"><div className="card-header"><span className="card-title">{t(lang, 'carbon.rankingTitle')}</span></div><div className="card-body"><div className="chart-container" style={{ height: '400px' }}><ReactECharts option={rankingOption} style={{ height: '100%' }} /></div></div></div><div className="card"><div className="card-header"><span className="card-title">{t(lang, 'carbon.scatterTitle')}</span></div><div className="card-body"><div className="chart-container" style={{ height: '400px' }}><ReactECharts option={scatterOption} style={{ height: '100%' }} /></div><div className="heat-legend" style={{ marginTop: '12px', justifyContent: 'center' }}><div className="heat-legend-item"><div className="heat-legend-dot green" /> {t(lang, 'dashboard.riskLow')}</div><div className="heat-legend-item"><div className="heat-legend-dot yellow" /> {t(lang, 'dashboard.riskMedium')}</div><div className="heat-legend-item"><div className="heat-legend-dot red" /> {t(lang, 'dashboard.riskHigh')}</div></div></div></div></>)}
      {viewMode === 'breakdown' && (<div className="grid-2"><div className="card"><div className="card-header"><span className="card-title">{t(lang, 'carbon.scopePie')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={scopePieOption} style={{ height: '100%' }} /></div></div></div><div className="card"><div className="card-header"><span className="card-title">{t(lang, 'carbon.tierPie')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={{ tooltip: { trigger: 'item', formatter: '{b}: {c} tCO₂e ({d}%)' }, series: [{ type: 'pie', radius: ['45%', '70%'], center: ['50%', '50%'], itemStyle: { borderColor: '#fff', borderWidth: 3 }, data: [{ value: suppliers.filter(s => s.tier === 'Tier 1').reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0), name: 'Tier 1', itemStyle: { color: C1 } }, { value: suppliers.filter(s => s.tier === 'Tier 2').reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0), name: 'Tier 2', itemStyle: { color: C2 } }, { value: suppliers.filter(s => s.tier === 'Tier 3').reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0), name: 'Tier 3', itemStyle: { color: C3 } }] }] }} style={{ height: '100%' }} /></div></div></div></div>)}
    </div>
  );
}
