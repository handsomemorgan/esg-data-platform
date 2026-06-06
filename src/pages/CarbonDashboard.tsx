import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { suppliers, monthlyCarbonData } from '../data';
import { useLang } from '../context/LanguageContext';
import { t } from '../i18n';

const AXIS = { axisLabel: { color: '#7b8ca3' }, axisLine: { lineStyle: { color: '#1a2555' } }, splitLine: { lineStyle: { color: '#1a2555' } } };
const NAMETEXT = { nameTextStyle: { color: '#7b8ca3' } };

export default function CarbonDashboard() {
  const { lang } = useLang();
  const [viewMode, setViewMode] = useState<'trend' | 'ranking' | 'breakdown'>('trend');
  const totalScope1 = suppliers.reduce((a, b) => a + b.carbonScope1, 0);
  const totalScope2 = suppliers.reduce((a, b) => a + b.carbonScope2, 0);
  const totalScope3 = suppliers.reduce((a, b) => a + b.carbonScope3, 0);
  const totalCarbon = totalScope1 + totalScope2 + totalScope3;

  const scopePieOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} tCO₂e ({d}%)' },
    legend: { orient: 'vertical', right: '5%', top: 'center', textStyle: { color: '#7b8ca3' } },
    series: [{ type: 'pie', radius: ['50%', '75%'], center: ['40%', '50%'], itemStyle: { borderColor: '#0d1330', borderWidth: 3 }, data: [{ value: totalScope1, name: 'Scope 1 (Direct)', itemStyle: { color: '#0077b6' } }, { value: totalScope2, name: 'Scope 2 (Energy)', itemStyle: { color: '#00b4d8' } }, { value: totalScope3, name: 'Scope 3 (Other)', itemStyle: { color: '#48cae4' } }], label: { formatter: '{b}\n{d}%', color: '#7b8ca3' } }],
  };

  const trendOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Scope 1', 'Scope 2', 'Scope 3', 'Total'], bottom: 0, textStyle: { color: '#7b8ca3' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: monthlyCarbonData.map(d => d.month.slice(2)), ...AXIS },
    yAxis: { type: 'value', name: 'tCO₂e', ...AXIS, ...NAMETEXT },
    series: [
      { name: 'Scope 1', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: monthlyCarbonData.map(d => d.scope1), itemStyle: { color: '#0077b6' }, lineStyle: { width: 2 }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(0,119,182,0.3)' }, { offset: 1, color: 'rgba(0,119,182,0.02)' }] } } },
      { name: 'Scope 2', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: monthlyCarbonData.map(d => d.scope2), itemStyle: { color: '#00b4d8' }, lineStyle: { width: 2 }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(0,180,216,0.3)' }, { offset: 1, color: 'rgba(0,180,216,0.02)' }] } } },
      { name: 'Scope 3', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: monthlyCarbonData.map(d => d.scope3), itemStyle: { color: '#48cae4' }, lineStyle: { width: 2 }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(72,202,228,0.25)' }, { offset: 1, color: 'rgba(72,202,228,0.02)' }] } } },
      { name: 'Total', type: 'line', smooth: true, lineStyle: { type: 'dashed', width: 2, color: '#90e0ef' }, data: monthlyCarbonData.map(d => d.scope1 + d.scope2 + d.scope3), itemStyle: { color: '#90e0ef' } },
    ],
  };

  const sortedByIntensity = [...suppliers].sort((a, b) => ((b.carbonScope1 + b.carbonScope2) / (b.energyUse || 1)) - ((a.carbonScope1 + a.carbonScope2) / (a.energyUse || 1)));
  const rankingOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } }, legend: { bottom: 0, textStyle: { color: '#7b8ca3' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'value', name: 'tCO₂e', ...AXIS, ...NAMETEXT },
    yAxis: { type: 'category', data: sortedByIntensity.map(s => s.name.slice(0, 6)).reverse(), ...AXIS },
    series: [
      { name: 'Scope 1', type: 'bar', stack: 'total', data: sortedByIntensity.map(s => s.carbonScope1).reverse(), itemStyle: { color: '#0077b6' }, barWidth: '55%' },
      { name: 'Scope 2', type: 'bar', stack: 'total', data: sortedByIntensity.map(s => s.carbonScope2).reverse(), itemStyle: { color: '#00b4d8' } },
      { name: 'Scope 3', type: 'bar', stack: 'total', data: sortedByIntensity.map(s => s.carbonScope3).reverse(), itemStyle: { color: '#48cae4' } },
    ],
  };

  const scatterOption = {
    tooltip: { formatter: (params: { name: string; value: number[] }) => `${params.name}<br/>Carbon Intensity: ${params.value[0]} tCO₂e<br/>Energy Intensity: ${params.value[1]} MWh` },
    grid: { left: '8%', right: '5%', bottom: '10%', top: '5%' },
    xAxis: { name: 'Carbon Intensity (tCO₂e)', ...NAMETEXT, ...AXIS },
    yAxis: { name: 'Energy Intensity (MWh)', ...NAMETEXT, ...AXIS },
    series: [{ type: 'scatter', symbolSize: (val: number[]) => Math.sqrt(val[0] / 1000) * 8, data: suppliers.map(s => ({ name: s.name, value: [Math.round((s.carbonScope1 + s.carbonScope2) / 1000 * 100) / 100, Math.round(s.energyUse / 1000 * 100) / 100], itemStyle: { color: s.riskLevel === 'high' ? '#e63946' : s.riskLevel === 'medium' ? '#0096c7' : '#48cae4' } })), label: { show: true, formatter: (params: { name: string }) => params.name.slice(0, 4), fontSize: 10, color: '#7b8ca3', position: 'top' }, emphasis: { label: { fontSize: 14, fontWeight: 'bold' } } }],
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
      <div className="tabs">
        <div className={`tab ${viewMode === 'trend' ? 'active' : ''}`} onClick={() => setViewMode('trend')}>{t(lang, 'carbon.tabTrend')}</div>
        <div className={`tab ${viewMode === 'ranking' ? 'active' : ''}`} onClick={() => setViewMode('ranking')}>{t(lang, 'carbon.tabRanking')}</div>
        <div className={`tab ${viewMode === 'breakdown' ? 'active' : ''}`} onClick={() => setViewMode('breakdown')}>{t(lang, 'carbon.tabBreakdown')}</div>
      </div>
      {viewMode === 'trend' && <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'carbon.trendTitle')}</span></div><div className="card-body"><div className="chart-container" style={{ height: '420px' }}><ReactECharts option={trendOption} style={{ height: '100%' }} /></div></div></div>}
      {viewMode === 'ranking' && (<>
        <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'carbon.rankingTitle')}</span></div><div className="card-body"><div className="chart-container" style={{ height: '400px' }}><ReactECharts option={rankingOption} style={{ height: '100%' }} /></div></div></div>
        <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'carbon.scatterTitle')}</span></div><div className="card-body"><div className="chart-container" style={{ height: '400px' }}><ReactECharts option={scatterOption} style={{ height: '100%' }} /></div><div className="heat-legend" style={{ marginTop: '12px', justifyContent: 'center' }}><div className="heat-legend-item"><div className="heat-legend-dot green" /> {t(lang, 'dashboard.riskLow')}</div><div className="heat-legend-item"><div className="heat-legend-dot yellow" /> {t(lang, 'dashboard.riskMedium')}</div><div className="heat-legend-item"><div className="heat-legend-dot red" /> {t(lang, 'dashboard.riskHigh')}</div><span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>Bubble size = total carbon</span></div></div></div>
      </>)}
      {viewMode === 'breakdown' && (
        <div className="grid-2">
          <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'carbon.scopePie')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={scopePieOption} style={{ height: '100%' }} /></div></div></div>
          <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'carbon.tierPie')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={{ tooltip: { trigger: 'item', formatter: '{b}: {c} tCO₂e ({d}%)' }, series: [{ type: 'pie', radius: ['45%', '70%'], center: ['50%', '50%'], itemStyle: { borderColor: '#0d1330', borderWidth: 3 }, data: [{ value: suppliers.filter(s => s.tier === 'Tier 1').reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0), name: 'Tier 1', itemStyle: { color: '#0077b6' } }, { value: suppliers.filter(s => s.tier === 'Tier 2').reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0), name: 'Tier 2', itemStyle: { color: '#00b4d8' } }, { value: suppliers.filter(s => s.tier === 'Tier 3').reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0), name: 'Tier 3', itemStyle: { color: '#48cae4' } }] }] }} style={{ height: '100%' }} /></div></div></div>
        </div>
      )}
    </div>
  );
}
