import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { suppliers } from '../data';
import { useLang } from '../context/LanguageContext';
import { t } from '../i18n';

const C1 = '#2563eb'; const C2 = '#3b82f6'; const C3 = '#60a5fa'; const C4 = '#93c5fd';
const AX = '#e2e8f0'; const TX = '#64748b';

export default function SupplyChain() {
  const { lang } = useLang();
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const filtered = selectedTier === 'all' ? suppliers : suppliers.filter(s => s.tier === selectedTier);
  const tier1 = suppliers.filter(s => s.tier === 'Tier 1');
  const tier2 = suppliers.filter(s => s.tier === 'Tier 2');
  const tier3 = suppliers.filter(s => s.tier === 'Tier 3');

  const as = { axisLabel: { color: TX }, axisLine: { lineStyle: { color: AX } } };
  const sl = { splitLine: { lineStyle: { color: AX } } };

  const sankeyOption = {
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    series: [{ type: 'sankey', layout: 'none', emphasis: { focus: 'adjacency' }, nodeAlign: 'left', layoutIterations: 0, data: [{ name: 'Tier 3\nRaw Mat.', itemStyle: { color: C1 } }, { name: 'Tier 3\nLogistics', itemStyle: { color: C2 } }, { name: 'Tier 2\nDyeing', itemStyle: { color: C3 } }, { name: 'Tier 1\nGarment', itemStyle: { color: C4 } }, { name: 'ABC Fashion', itemStyle: { color: '#bfdbfe' } }], links: [{ source: 'Tier 3\nRaw Mat.', target: 'Tier 2\nDyeing', value: 3 }, { source: 'Tier 3\nLogistics', target: 'Tier 1\nGarment', value: 1 }, { source: 'Tier 3\nLogistics', target: 'Tier 2\nDyeing', value: 1 }, { source: 'Tier 2\nDyeing', target: 'Tier 1\nGarment', value: 3 }, { source: 'Tier 1\nGarment', target: 'ABC Fashion', value: 4 }], lineStyle: { color: 'gradient', curveness: 0.5 }, label: { fontSize: 12, color: TX } }],
  };

  const tierPieOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [{ type: 'pie', radius: ['55%', '80%'], center: ['50%', '50%'], label: { formatter: '{b}\n{c}', fontSize: 13, color: TX }, emphasis: { label: { fontSize: 18, fontWeight: 'bold' } }, itemStyle: { borderColor: '#fff', borderWidth: 3 }, data: [{ value: tier1.length, name: t(lang, 'supplyChain.tier1'), itemStyle: { color: C1 } }, { value: tier2.length, name: t(lang, 'supplyChain.tier2'), itemStyle: { color: C2 } }, { value: tier3.length, name: t(lang, 'supplyChain.tier3'), itemStyle: { color: C3 } }] }],
  };

  const barOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: [t(lang, 'supplyChain.carbonCol'), t(lang, 'supplyChain.waterCol')], bottom: 0, textStyle: { color: TX } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: ['Tier 1', 'Tier 2', 'Tier 3'], ...as },
    yAxis: [
      { type: 'value', name: 'tCO₂e', nameTextStyle: { color: TX }, ...as, ...sl },
      { type: 'value', name: '100m³', nameTextStyle: { color: TX }, ...as, ...sl },
    ],
    series: [
      { name: t(lang, 'supplyChain.carbonCol'), type: 'bar', data: [tier1.reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0), tier2.reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0), tier3.reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0)], itemStyle: { color: C1, borderRadius: [4, 4, 0, 0] }, barWidth: '35%' },
      { name: t(lang, 'supplyChain.waterCol'), type: 'bar', yAxisIndex: 1, data: [Math.round(tier1.reduce((a, b) => a + b.waterUse, 0) / 100), Math.round(tier2.reduce((a, b) => a + b.waterUse, 0) / 100), Math.round(tier3.reduce((a, b) => a + b.waterUse, 0) / 100)], itemStyle: { color: C2, borderRadius: [4, 4, 0, 0] }, barWidth: '35%' },
    ],
  };

  const getRiskBadgeClass = (level: string) => { switch (level) { case 'low': return 'badge-green'; case 'medium': return 'badge-yellow'; case 'high': return 'badge-red'; default: return 'badge-gray'; } };
  const getRiskLabel = (level: string) => { switch (level) { case 'low': return t(lang, 'suppliers.lowRisk'); case 'medium': return t(lang, 'suppliers.mediumRisk'); case 'high': return t(lang, 'suppliers.highRiskFilter'); default: return t(lang, 'common.unknown'); } };

  return (
    <div>
      <div className="page-header"><h1 className="page-title">{t(lang, 'supplyChain.title')}</h1><p className="page-desc">{t(lang, 'supplyChain.desc')}</p></div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'supplyChain.tier1')}</div><div className="stat-card-value">{tier1.length}</div><div className="stat-card-change down">{t(lang, 'suppliers.highRisk')} {tier1.filter(s => s.riskLevel === 'high').length}</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'supplyChain.tier2')}</div><div className="stat-card-value">{tier2.length}</div><div className="stat-card-change down">{t(lang, 'suppliers.highRisk')} {tier2.filter(s => s.riskLevel === 'high').length}</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'supplyChain.tier3')}</div><div className="stat-card-value">{tier3.length}</div><div className="stat-card-change">{t(lang, 'suppliers.highRisk')} {tier3.filter(s => s.riskLevel === 'high').length}</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'supplyChain.totalCarbon')}</div><div className="stat-card-value">{(suppliers.reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0) / 1000).toFixed(0)}k</div><div className="stat-card-change">{t(lang, 'common.tCO2eYear')}</div></div></div>
      </div>
      <div className="grid-2"><div className="card"><div className="card-header"><span className="card-title">{t(lang, 'supplyChain.sankey')}</span></div><div className="card-body"><div className="chart-container" style={{ height: '380px' }}><ReactECharts option={sankeyOption} style={{ height: '100%' }} /></div></div></div><div className="card"><div className="card-header"><span className="card-title">{t(lang, 'supplyChain.pie')}</span></div><div className="card-body"><div className="chart-container" style={{ height: '380px' }}><ReactECharts option={tierPieOption} style={{ height: '100%' }} /></div></div></div></div>
      <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'supplyChain.bar')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={barOption} style={{ height: '100%' }} /></div></div></div>
      <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'supplyChain.list')}</span><div className="filter-bar" style={{ marginBottom: 0 }}><select value={selectedTier} onChange={e => setSelectedTier(e.target.value)}><option value="all">{t(lang, 'supplyChain.allTiers')}</option><option value="Tier 1">Tier 1</option><option value="Tier 2">Tier 2</option><option value="Tier 3">Tier 3</option></select></div></div><div className="card-body" style={{ padding: 0 }}><div className="table-wrap"><table><thead><tr>{['ID','Supplier','Tier','Category','Location','ESG','Risk','Carbon','Water','Audit','Certs'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{filtered.map(s => (<tr key={s.id}><td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{s.id}</td><td style={{ fontWeight: 600 }}>{s.name}</td><td><span className="badge badge-blue">{s.tier}</span></td><td>{lang === 'en' ? (s.category === '成衣制造' ? 'Garment' : s.category === '面料染整' ? 'Dyeing' : s.category === '原材料' ? 'Raw Mat.' : 'Logistics') : s.category}</td><td>{s.location}</td><td><span className={`badge ${s.esgRating === 'A' ? 'badge-green' : s.esgRating === 'B' ? 'badge-blue' : s.esgRating === 'C' ? 'badge-yellow' : 'badge-red'}`}>{s.esgRating}</span></td><td><span className={`badge ${getRiskBadgeClass(s.riskLevel)}`}>{getRiskLabel(s.riskLevel)}</span></td><td>{(s.carbonScope1 + s.carbonScope2 + s.carbonScope3).toLocaleString()}</td><td>{s.waterUse.toLocaleString()}</td><td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="progress-bar" style={{ width: '60px' }}><div className={`progress-bar-fill ${s.auditScore >= 80 ? 'green' : s.auditScore >= 60 ? 'blue' : 'red'}`} style={{ width: `${s.auditScore}%` }} /></div><span style={{ fontSize: '13px', fontWeight: 600 }}>{s.auditScore}</span></div></td><td>{s.certifications.length}</td></tr>))}</tbody></table></div></div></div>
    </div>
  );
}
