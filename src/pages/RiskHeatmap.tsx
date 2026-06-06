import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { suppliers } from '../data';
import { useLang } from '../context/LanguageContext';
import { t } from '../i18n';

export default function RiskHeatmap() {
  const { lang } = useLang();
  const [riskView, setRiskView] = useState<'matrix' | 'map' | 'list'>('matrix');

  const riskMatrixOption = {
    tooltip: { formatter: (params: { data: number[] }) => { const s = suppliers.find(x => x.esgRating === ['D','C','B','A'][Math.round(params.data[0]) - 1] && Math.abs(x.auditScore - params.data[1]) < 3); return s ? `${s.name}<br/>ESG: ${s.esgRating} | Audit: ${s.auditScore}<br/>Risk: ${s.riskLevel}` : ''; } },
    grid: { left: '8%', right: '5%', bottom: '8%', top: '5%' },
    xAxis: { type: 'category', data: ['D', 'C', 'B', 'A'], name: 'ESG Rating', nameLocation: 'center', nameGap: 25, axisLabel: { fontSize: 14, fontWeight: 'bold', color: '#7b8ca3' }, axisLine: { lineStyle: { color: '#1a2555' } } },
    yAxis: { type: 'value', name: 'Audit Score', min: 30, max: 100, nameLocation: 'center', nameGap: 40, nameTextStyle: { color: '#7b8ca3' }, axisLabel: { color: '#7b8ca3' }, splitLine: { lineStyle: { color: '#1a2555' } } },
    series: [{ type: 'scatter', symbolSize: (val: number[]) => { const s = suppliers.find(x => x.esgRating === ['D','C','B','A'][Math.round(val[0]) - 1] && Math.abs(x.auditScore - val[1]) < 3); return s ? (s.carbonScope1 + s.carbonScope2) / 500 : 20; }, data: suppliers.map(s => ({ value: [['D','C','B','A'].indexOf(s.esgRating), s.auditScore], name: s.name, itemStyle: { color: s.riskLevel === 'high' ? '#e63946' : s.riskLevel === 'medium' ? '#0096c7' : '#48cae4', borderColor: s.penalties > 2 ? '#f07080' : 'transparent', borderWidth: s.penalties > 2 ? 3 : 0 } })), label: { show: true, formatter: (params: { name: string }) => params.name.slice(0, 4), fontSize: 10, color: '#7b8ca3', position: 'top' }, emphasis: { label: { fontSize: 14, fontWeight: 'bold' }, scale: 1.5 } }],
  };

  const riskBarOption = {
    tooltip: { trigger: 'axis' }, legend: { data: ['High', 'Medium', 'Low'], bottom: 0, textStyle: { color: '#7b8ca3' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: ['Tier 1', 'Tier 2', 'Tier 3'], axisLabel: { color: '#7b8ca3' }, axisLine: { lineStyle: { color: '#1a2555' } } },
    yAxis: { type: 'value', name: 'Count', nameTextStyle: { color: '#7b8ca3' }, axisLabel: { color: '#7b8ca3' }, splitLine: { lineStyle: { color: '#1a2555' } } },
    series: [
      { name: 'High', type: 'bar', stack: 'total', data: [suppliers.filter(s => s.tier === 'Tier 1' && s.riskLevel === 'high').length, suppliers.filter(s => s.tier === 'Tier 2' && s.riskLevel === 'high').length, suppliers.filter(s => s.tier === 'Tier 3' && s.riskLevel === 'high').length], itemStyle: { color: '#e63946' }, barWidth: '50%' },
      { name: 'Medium', type: 'bar', stack: 'total', data: [suppliers.filter(s => s.tier === 'Tier 1' && s.riskLevel === 'medium').length, suppliers.filter(s => s.tier === 'Tier 2' && s.riskLevel === 'medium').length, suppliers.filter(s => s.tier === 'Tier 3' && s.riskLevel === 'medium').length], itemStyle: { color: '#0096c7' } },
      { name: 'Low', type: 'bar', stack: 'total', data: [suppliers.filter(s => s.tier === 'Tier 1' && s.riskLevel === 'low').length, suppliers.filter(s => s.tier === 'Tier 2' && s.riskLevel === 'low').length, suppliers.filter(s => s.tier === 'Tier 3' && s.riskLevel === 'low').length], itemStyle: { color: '#48cae4' } },
    ],
  };

  const sunburstOption = {
    tooltip: { trigger: 'item' },
    series: [{ type: 'sunburst', data: [{ name: 'High(3)', itemStyle: { color: '#c1121f' }, children: [{ name: 'Low ESG', value: 2, itemStyle: { color: '#e63946' } }, { name: 'Penalties', value: 3, itemStyle: { color: '#f07080' } }, { name: 'Media Risk', value: 2, itemStyle: { color: '#f8a0a8' } }] }, { name: 'Medium(4)', itemStyle: { color: '#0077b6' }, children: [{ name: 'Low Audit', value: 2, itemStyle: { color: '#0096c7' } }, { name: 'CAP Overdue', value: 3, itemStyle: { color: '#00b4d8' } }, { name: 'No Certs', value: 2, itemStyle: { color: '#48cae4' } }] }, { name: 'Low(3)', itemStyle: { color: '#023e8a' }, children: [{ name: 'System OK', value: 3, itemStyle: { color: '#0077b6' } }, { name: 'Good Perf', value: 3, itemStyle: { color: '#00b4d8' } }] }], radius: [0, '90%'], label: { rotate: 'radial', fontSize: 11, color: '#fff' }, itemStyle: { borderRadius: 4, borderColor: '#0d1330', borderWidth: 2 } }],
  };

  const highRiskSuppliers = suppliers.filter(s => s.riskLevel === 'high');
  const getRiskBadgeClass = (level: string) => { switch (level) { case 'low': return 'badge-green'; case 'medium': return 'badge-yellow'; case 'high': return 'badge-red'; default: return 'badge-gray'; } };

  return (
    <div>
      <div className="page-header"><h1 className="page-title">{t(lang, 'risk.title')}</h1><p className="page-desc">{t(lang, 'risk.desc')}</p></div>
      <div className="stats-row">
        <div className="stat-card" style={{ borderLeft: '3px solid #e63946' }}><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'risk.highRisk')}</div><div className="stat-card-value" style={{ color: '#e63946' }}>{suppliers.filter(s => s.riskLevel === 'high').length}</div></div></div>
        <div className="stat-card" style={{ borderLeft: '3px solid #0096c7' }}><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'risk.mediumRisk')}</div><div className="stat-card-value" style={{ color: '#0096c7' }}>{suppliers.filter(s => s.riskLevel === 'medium').length}</div></div></div>
        <div className="stat-card" style={{ borderLeft: '3px solid #48cae4' }}><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'risk.lowRisk')}</div><div className="stat-card-value" style={{ color: '#48cae4' }}>{suppliers.filter(s => s.riskLevel === 'low').length}</div></div></div>
        <div className="stat-card" style={{ borderLeft: '3px solid #90e0ef' }}><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'risk.penalties')}</div><div className="stat-card-value" style={{ color: '#90e0ef' }}>{suppliers.reduce((a, b) => a + b.penalties, 0)}</div></div></div>
      </div>
      <div className="tabs">
        <div className={`tab ${riskView === 'matrix' ? 'active' : ''}`} onClick={() => setRiskView('matrix')}>{t(lang, 'risk.tabMatrix')}</div>
        <div className={`tab ${riskView === 'map' ? 'active' : ''}`} onClick={() => setRiskView('map')}>{t(lang, 'risk.tabDist')}</div>
        <div className={`tab ${riskView === 'list' ? 'active' : ''}`} onClick={() => setRiskView('list')}>{t(lang, 'risk.tabList')}</div>
      </div>
      {riskView === 'matrix' && (
        <div className="grid-2">
          <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'risk.matrixTitle')}</span></div><div className="card-body"><div className="chart-container" style={{ height: '420px' }}><ReactECharts option={riskMatrixOption} style={{ height: '100%' }} /></div><div className="heat-legend" style={{ marginTop: '12px', justifyContent: 'center' }}><div className="heat-legend-item"><div className="heat-legend-dot green" /> {t(lang, 'risk.lowRiskLabel')}</div><div className="heat-legend-item"><div className="heat-legend-dot yellow" /> {t(lang, 'risk.mediumRiskLabel')}</div><div className="heat-legend-item"><div className="heat-legend-dot red" /> {t(lang, 'risk.highRiskLabel')}</div><span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>Size = carbon | Bold = penalties</span></div></div></div>
          <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'risk.sunburstTitle')}</span></div><div className="card-body"><div className="chart-container" style={{ height: '420px' }}><ReactECharts option={sunburstOption} style={{ height: '100%' }} /></div></div></div>
        </div>
      )}
      {riskView === 'map' && (
        <div className="grid-2">
          <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'risk.distTitle')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={riskBarOption} style={{ height: '100%' }} /></div></div></div>
          <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'risk.pieTitle')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={{ tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' }, legend: { bottom: 0, textStyle: { color: '#7b8ca3' } }, series: [{ type: 'pie', radius: ['50%', '75%'], center: ['50%', '45%'], itemStyle: { borderColor: '#0d1330', borderWidth: 3 }, data: [{ value: suppliers.filter(s => s.riskLevel === 'high').length, name: 'High', itemStyle: { color: '#e63946' } }, { value: suppliers.filter(s => s.riskLevel === 'medium').length, name: 'Medium', itemStyle: { color: '#0096c7' } }, { value: suppliers.filter(s => s.riskLevel === 'low').length, name: 'Low', itemStyle: { color: '#48cae4' } }], label: { fontSize: 13, color: '#7b8ca3' } }] }} style={{ height: '100%' }} /></div></div></div>
        </div>
      )}
      {riskView === 'list' && (
        <>
          <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'risk.warningTitle')}</span><span className="badge badge-red">{highRiskSuppliers.length} {t(lang, 'risk.needAttention')}</span></div><div className="card-body" style={{ padding: 0 }}><div className="table-wrap"><table><thead><tr><th>#</th><th>Supplier</th><th>Tier</th><th>ESG</th><th>Audit</th><th>Penalties</th><th>Media</th><th>Carbon</th><th>Reasons</th></tr></thead><tbody>{highRiskSuppliers.map((s, i) => (<tr key={s.id} style={{ background: i === 0 ? 'rgba(230,57,70,0.05)' : undefined }}><td><strong>#{i + 1}</strong></td><td style={{ fontWeight: 600 }}>{s.name}</td><td><span className="badge badge-blue">{s.tier}</span></td><td><span className={`badge ${s.esgRating === 'C' ? 'badge-yellow' : 'badge-red'}`}>{s.esgRating}</span></td><td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="progress-bar" style={{ width: '50px' }}><div className="progress-bar-fill red" style={{ width: `${s.auditScore}%` }} /></div><span style={{ fontWeight: 600, color: '#e63946' }}>{s.auditScore}</span></div></td><td><span className="badge badge-red">{s.penalties}</span></td><td><span className={`badge ${getRiskBadgeClass(s.mediaRisk)}`}>{s.mediaRisk === 'high' ? 'H' : s.mediaRisk === 'medium' ? 'M' : s.mediaRisk === 'low' ? 'L' : '-'}</span></td><td>{(s.carbonScope1 + s.carbonScope2 + s.carbonScope3).toLocaleString()}</td><td><div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>{s.penalties > 0 && <span className="badge badge-red">{t(lang, 'risk.reason1')}</span>}{s.mediaRisk === 'high' && <span className="badge badge-red">{t(lang, 'risk.reason2')}</span>}{s.auditScore < 60 && <span className="badge badge-red">{t(lang, 'risk.reason3')}</span>}{s.certifications.length === 0 && <span className="badge badge-yellow">{t(lang, 'risk.reason4')}</span>}{s.capOverdue > 3 && <span className="badge badge-red">{t(lang, 'risk.reason5')}</span>}</div></td></tr>))}</tbody></table></div></div></div>
          <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'risk.allTitle')}</span></div><div className="card-body" style={{ padding: 0 }}><div className="table-wrap"><table><thead><tr><th>Supplier</th><th>Tier</th><th>ESG</th><th>Risk</th><th>Audit</th><th>Penalties</th><th>Media</th><th>CAP Overdue</th><th>Action</th></tr></thead><tbody>{suppliers.map(s => (<tr key={s.id}><td style={{ fontWeight: 600 }}>{s.name}</td><td><span className="badge badge-blue">{s.tier}</span></td><td><span className={`badge ${s.esgRating === 'A' ? 'badge-green' : s.esgRating === 'B' ? 'badge-blue' : s.esgRating === 'C' ? 'badge-yellow' : 'badge-red'}`}>{s.esgRating}</span></td><td><span className={`badge ${getRiskBadgeClass(s.riskLevel)}`}>{s.riskLevel === 'high' ? 'High' : s.riskLevel === 'medium' ? 'Medium' : 'Low'}</span></td><td>{s.auditScore}</td><td>{s.penalties > 0 ? <span style={{ color: '#e63946', fontWeight: 600 }}>{s.penalties}</span> : '0'}</td><td><span className={`badge ${getRiskBadgeClass(s.mediaRisk)}`}>{s.mediaRisk === 'none' ? '-' : s.mediaRisk}</span></td><td>{s.capOverdue > 0 ? <span style={{ color: '#e63946', fontWeight: 600 }}>{s.capOverdue}</span> : '0'}</td><td>{s.riskLevel === 'high' ? <span className="badge badge-red">{t(lang, 'risk.action1')}</span> : s.riskLevel === 'medium' ? <span className="badge badge-yellow">{t(lang, 'risk.action2')}</span> : <span className="badge badge-green">{t(lang, 'risk.action3')}</span>}</td></tr>))}</tbody></table></div></div></div>
        </>
      )}
    </div>
  );
}
