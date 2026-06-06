import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { suppliers } from '../data';
import { useLang } from '../context/LanguageContext';
import { t } from '../i18n';

const AXIS = { axisLabel: { color: '#7b8ca3' }, axisLine: { lineStyle: { color: '#1a2555' } }, splitLine: { lineStyle: { color: '#1a2555' } } };
const NAMETEXT = { nameTextStyle: { color: '#7b8ca3' } };

export default function EnvironmentalPerformance() {
  const { lang } = useLang();
  const [metric, setMetric] = useState<'water' | 'energy' | 'waste' | 'chemical'>('water');

  const getTopConsumers = (m: string) => {
    const key = m === 'water' ? 'waterUse' : m === 'energy' ? 'energyUse' : m === 'waste' ? 'solidWaste' : 'chemicalUse';
    const unit = m === 'water' ? 'm³' : m === 'energy' ? 'MWh' : m === 'waste' ? 'tons' : 'tons';
    return [...suppliers].sort((a, b) => (b[key] as number) - (a[key] as number)).slice(0, 10).map(s => ({ name: s.name.slice(0, 6), value: s[key] as number, unit }));
  };

  const topData = getTopConsumers(metric);
  const barOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '8%', bottom: '5%', top: '5%', containLabel: true },
    xAxis: { type: 'value', name: topData[0]?.unit || '', ...AXIS, ...NAMETEXT },
    yAxis: { type: 'category', data: topData.map(d => d.name).reverse(), ...AXIS },
    series: [{ type: 'bar', data: topData.map(d => ({ value: d.value, itemStyle: { color: d.value > (topData[0]?.value || 1000) * 0.7 ? '#e63946' : d.value > (topData[0]?.value || 1000) * 0.4 ? '#0096c7' : '#48cae4', borderRadius: [0, 4, 4, 0] } })), barWidth: '55%', label: { show: true, position: 'right', fontSize: 11, color: '#7b8ca3', formatter: '{c}' } }],
  };

  const radarOption = {
    tooltip: {},
    legend: { data: ['Tier 1 Avg', 'Tier 2 Avg', 'Tier 3 Avg'], bottom: 0, textStyle: { color: '#7b8ca3' } },
    radar: {
      indicator: [{ name: 'Water', max: 500 }, { name: 'Energy', max: 60000 }, { name: 'Wastewater', max: 500 }, { name: 'Solid Waste', max: 900 }, { name: 'Chemical', max: 350 }],
      center: ['50%', '50%'], radius: '65%', axisName: { color: '#7b8ca3' }, splitArea: { areaStyle: { color: ['rgba(0,180,216,0.02)', 'rgba(0,180,216,0.04)'] } }, splitLine: { lineStyle: { color: '#1a2555' } }, axisLine: { lineStyle: { color: '#1a2555' } },
    },
    series: [
      { name: 'Tier 2 Avg', type: 'radar', data: [{ value: [Math.round(suppliers.filter(s => s.tier === 'Tier 2').reduce((a, b) => a + b.waterUse, 0) / 300 / 100), Math.round(suppliers.filter(s => s.tier === 'Tier 2').reduce((a, b) => a + b.energyUse, 0) / 3), Math.round(suppliers.filter(s => s.tier === 'Tier 2').reduce((a, b) => a + b.wasteWater, 0) / 300 / 100), Math.round(suppliers.filter(s => s.tier === 'Tier 2').reduce((a, b) => a + b.solidWaste, 0) / 3), Math.round(suppliers.filter(s => s.tier === 'Tier 2').reduce((a, b) => a + b.chemicalUse, 0) / 3)], name: 'Tier 2 Avg' }], itemStyle: { color: '#00b4d8' }, areaStyle: { color: 'rgba(0,180,216,0.12)' }, lineStyle: { color: '#00b4d8' } },
      { name: 'Tier 1 Avg', type: 'radar', data: [{ value: [Math.round(suppliers.filter(s => s.tier === 'Tier 1').reduce((a, b) => a + b.waterUse, 0) / 400 / 100), Math.round(suppliers.filter(s => s.tier === 'Tier 1').reduce((a, b) => a + b.energyUse, 0) / 4), Math.round(suppliers.filter(s => s.tier === 'Tier 1').reduce((a, b) => a + b.wasteWater, 0) / 400 / 100), Math.round(suppliers.filter(s => s.tier === 'Tier 1').reduce((a, b) => a + b.solidWaste, 0) / 4), Math.round(suppliers.filter(s => s.tier === 'Tier 1').reduce((a, b) => a + b.chemicalUse, 0) / 4)], name: 'Tier 1 Avg' }], itemStyle: { color: '#0077b6' }, areaStyle: { color: 'rgba(0,119,182,0.12)' }, lineStyle: { color: '#0077b6' } },
      { name: 'Tier 3 Avg', type: 'radar', data: [{ value: [Math.round(suppliers.filter(s => s.tier === 'Tier 3').reduce((a, b) => a + b.waterUse, 0) / 300 / 100), Math.round(suppliers.filter(s => s.tier === 'Tier 3').reduce((a, b) => a + b.energyUse, 0) / 3), Math.round(suppliers.filter(s => s.tier === 'Tier 3').reduce((a, b) => a + b.wasteWater, 0) / 300 / 100), Math.round(suppliers.filter(s => s.tier === 'Tier 3').reduce((a, b) => a + b.solidWaste, 0) / 3), Math.round(suppliers.filter(s => s.tier === 'Tier 3').reduce((a, b) => a + b.chemicalUse, 0) / 3)], name: 'Tier 3 Avg' }], itemStyle: { color: '#48cae4' }, areaStyle: { color: 'rgba(72,202,228,0.12)' }, lineStyle: { color: '#48cae4' } },
    ],
  };

  const highWaterConsumers = [...suppliers].sort((a, b) => b.waterUse - a.waterUse).slice(0, 5);
  const highEnergyConsumers = [...suppliers].sort((a, b) => b.energyUse - a.energyUse).slice(0, 5);

  return (
    <div>
      <div className="page-header"><h1 className="page-title">{t(lang, 'env.title')}</h1><p className="page-desc">{t(lang, 'env.desc')}</p></div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'env.totalWater')}</div><div className="stat-card-value">{(suppliers.reduce((a, b) => a + b.waterUse, 0) / 10000).toFixed(0)}W</div><div className="stat-card-change">m³</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'env.totalEnergy')}</div><div className="stat-card-value">{(suppliers.reduce((a, b) => a + b.energyUse, 0) / 1000).toFixed(0)}k</div><div className="stat-card-change">MWh</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'env.totalWasteWater')}</div><div className="stat-card-value">{(suppliers.reduce((a, b) => a + b.wasteWater, 0) / 10000).toFixed(0)}W</div><div className="stat-card-change">m³</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'env.totalChemical')}</div><div className="stat-card-value">{suppliers.reduce((a, b) => a + b.chemicalUse, 0)}</div><div className="stat-card-change">tons</div></div></div>
      </div>
      <div className="tabs">
        <div className={`tab ${metric === 'water' ? 'active' : ''}`} onClick={() => setMetric('water')}>{t(lang, 'env.tabWater')}</div>
        <div className={`tab ${metric === 'energy' ? 'active' : ''}`} onClick={() => setMetric('energy')}>{t(lang, 'env.tabEnergy')}</div>
        <div className={`tab ${metric === 'waste' ? 'active' : ''}`} onClick={() => setMetric('waste')}>{t(lang, 'env.tabWaste')}</div>
        <div className={`tab ${metric === 'chemical' ? 'active' : ''}`} onClick={() => setMetric('chemical')}>{t(lang, 'env.tabChemical')}</div>
      </div>
      <div className="grid-2">
        <div className="card"><div className="card-header"><span className="card-title">Top 10</span></div><div className="card-body"><div className="chart-container" style={{ height: '380px' }}><ReactECharts option={barOption} style={{ height: '100%' }} /></div></div></div>
        <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'env.radar')}</span></div><div className="card-body"><div className="chart-container" style={{ height: '380px' }}><ReactECharts option={radarOption} style={{ height: '100%' }} /></div></div></div>
      </div>
      <div className="grid-2">
        <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'env.topWater')}</span><span className="badge badge-red">{t(lang, 'env.needAttention')}</span></div><div className="card-body" style={{ padding: 0 }}><div className="table-wrap"><table><thead><tr><th>#</th><th>Supplier</th><th>Tier</th><th>Water (m³)</th><th>Wastewater (m³)</th><th>Risk</th></tr></thead><tbody>{highWaterConsumers.map((s, i) => (<tr key={s.id}><td><strong>#{i + 1}</strong></td><td style={{ fontWeight: 600 }}>{s.name}</td><td><span className="badge badge-blue">{s.tier}</span></td><td style={{ fontWeight: 700, color: '#e63946' }}>{s.waterUse.toLocaleString()}</td><td>{s.wasteWater.toLocaleString()}</td><td><span className={`badge ${s.riskLevel === 'high' ? 'badge-red' : s.riskLevel === 'medium' ? 'badge-yellow' : 'badge-green'}`}>{s.riskLevel === 'high' ? 'H' : s.riskLevel === 'medium' ? 'M' : 'L'}</span></td></tr>))}</tbody></table></div></div></div>
        <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'env.topEnergy')}</span><span className="badge badge-red">{t(lang, 'env.needAttention')}</span></div><div className="card-body" style={{ padding: 0 }}><div className="table-wrap"><table><thead><tr><th>#</th><th>Supplier</th><th>Tier</th><th>Energy (MWh)</th><th>Carbon (tCO₂e)</th><th>Risk</th></tr></thead><tbody>{highEnergyConsumers.map((s, i) => (<tr key={s.id}><td><strong>#{i + 1}</strong></td><td style={{ fontWeight: 600 }}>{s.name}</td><td><span className="badge badge-blue">{s.tier}</span></td><td style={{ fontWeight: 700, color: '#e63946' }}>{s.energyUse.toLocaleString()}</td><td>{(s.carbonScope1 + s.carbonScope2).toLocaleString()}</td><td><span className={`badge ${s.riskLevel === 'high' ? 'badge-red' : s.riskLevel === 'medium' ? 'badge-yellow' : 'badge-green'}`}>{s.riskLevel === 'high' ? 'H' : s.riskLevel === 'medium' ? 'M' : 'L'}</span></td></tr>))}</tbody></table></div></div></div>
      </div>
    </div>
  );
}
