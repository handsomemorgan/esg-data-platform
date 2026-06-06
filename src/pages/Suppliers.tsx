import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { suppliers, type Supplier } from '../data';
import { useLang } from '../context/LanguageContext';
import { t, ta } from '../i18n';

export default function Suppliers() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [tierFilter, setTierFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  const filtered = suppliers.filter(s => {
    if (search && !s.name.includes(search) && !s.location.includes(search)) return false;
    if (tierFilter !== 'all' && s.tier !== tierFilter) return false;
    if (riskFilter !== 'all' && s.riskLevel !== riskFilter) return false;
    return true;
  });

  const getRiskBadgeClass = (level: string) => { switch (level) { case 'low': return 'badge-green'; case 'medium': return 'badge-yellow'; case 'high': return 'badge-red'; default: return 'badge-gray'; } };
  const getRiskLabel = (level: string) => { switch (level) { case 'low': return t(lang, 'suppliers.lowRisk'); case 'medium': return t(lang, 'suppliers.mediumRisk'); case 'high': return t(lang, 'suppliers.highRiskFilter'); default: return t(lang, 'common.unknown'); } };
  const getESGBadgeClass = (rating: string) => { switch (rating) { case 'A': return 'badge-green'; case 'B': return 'badge-blue'; case 'C': return 'badge-yellow'; case 'D': return 'badge-red'; default: return 'badge-gray'; } };

  const getRadarOption = (s: Supplier) => ({
    tooltip: {},
    radar: {
      indicator: [{ name: 'Carbon', max: 100 }, { name: 'Water', max: 100 }, { name: 'Chemical', max: 100 }, { name: 'Waste', max: 100 }, { name: 'Compliance', max: 100 }, { name: 'Certified', max: 100 }],
      center: ['50%', '55%'], radius: '70%',
      axisName: { color: '#7b8ca3' }, splitArea: { areaStyle: { color: ['rgba(0,180,216,0.02)', 'rgba(0,180,216,0.04)'] } }, splitLine: { lineStyle: { color: '#1a2555' } }, axisLine: { lineStyle: { color: '#1a2555' } },
    },
    series: [{ type: 'radar', data: [{ value: [100 - Math.round((s.carbonScope1 + s.carbonScope2) / 500), Math.max(0, 100 - Math.round(s.waterUse / 5000)), Math.max(0, 100 - Math.round(s.chemicalUse / 3)), Math.max(0, 100 - Math.round(s.solidWaste / 10)), s.auditScore, Math.min(100, s.certifications.length * 25)], name: s.name, areaStyle: { color: 'rgba(0,180,216,0.2)' }, lineStyle: { color: '#48cae4', width: 2 }, itemStyle: { color: '#00b4d8' } }] }],
  });

  const ratingBarOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: suppliers.map(s => s.name.slice(0, 4)), axisLabel: { color: '#7b8ca3' }, axisLine: { lineStyle: { color: '#1a2555' } } },
    yAxis: { type: 'value', name: 'Score', max: 100, nameTextStyle: { color: '#7b8ca3' }, axisLabel: { color: '#7b8ca3' }, splitLine: { lineStyle: { color: '#1a2555' } } },
    grid: { left: '3%', right: '4%', bottom: '20%', top: '5%', containLabel: true },
    series: [{ type: 'bar', data: suppliers.map(s => ({ value: s.auditScore, itemStyle: { color: s.auditScore >= 80 ? '#48cae4' : s.auditScore >= 60 ? '#00b4d8' : s.auditScore >= 45 ? '#0077b6' : '#e63946', borderRadius: [4, 4, 0, 0] } })), barWidth: '60%', label: { show: true, position: 'top', fontSize: 11, fontWeight: 600, color: '#7b8ca3' } }],
  };

  const cols = ta(lang, 'suppliers.cols');

  return (
    <div>
      <div className="page-header"><h1 className="page-title">{t(lang, 'suppliers.title')}</h1><p className="page-desc">{t(lang, 'suppliers.desc')}</p></div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'suppliers.total')}</div><div className="stat-card-value">{suppliers.length}</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'suppliers.aLevel')}</div><div className="stat-card-value">{suppliers.filter(s => s.esgRating === 'A').length}</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'suppliers.avgAudit')}</div><div className="stat-card-value">{Math.round(suppliers.reduce((a, b) => a + b.auditScore, 0) / suppliers.length)}</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'suppliers.highRisk')}</div><div className="stat-card-value" style={{ color: '#e63946' }}>{suppliers.filter(s => s.riskLevel === 'high').length}</div></div></div>
      </div>
      <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'suppliers.compareChart')}</span></div><div className="card-body"><div className="chart-container" style={{ height: '300px' }}><ReactECharts option={ratingBarOption} style={{ height: '100%' }} /></div></div></div>
      <div className="card">
        <div className="card-header"><span className="card-title">{t(lang, 'suppliers.listTitle')}</span>
          <div className="filter-bar" style={{ marginBottom: 0 }}>
            <input className="search-input" placeholder={t(lang, 'suppliers.search')} value={search} onChange={e => setSearch(e.target.value)} />
            <select value={tierFilter} onChange={e => setTierFilter(e.target.value)}><option value="all">{t(lang, 'suppliers.allTiers')}</option><option value="Tier 1">Tier 1</option><option value="Tier 2">Tier 2</option><option value="Tier 3">Tier 3</option></select>
            <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)}><option value="all">{t(lang, 'suppliers.allRisk')}</option><option value="low">{t(lang, 'suppliers.lowRisk')}</option><option value="medium">{t(lang, 'suppliers.mediumRisk')}</option><option value="high">{t(lang, 'suppliers.highRiskFilter')}</option></select>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}><div className="table-wrap"><table><thead><tr>{cols.map((c: string) => <th key={c}>{c}</th>)}</tr></thead><tbody>{filtered.map(s => (<tr key={s.id}><td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{s.id}</td><td style={{ fontWeight: 600 }}>{s.name}</td><td><span className="badge badge-blue">{s.tier}</span></td><td>{s.category}</td><td>{s.location}</td><td><span className={`badge ${getESGBadgeClass(s.esgRating)}`}>{s.esgRating}</span></td><td><span className={`badge ${getRiskBadgeClass(s.riskLevel)}`}>{getRiskLabel(s.riskLevel)}</span></td><td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="progress-bar" style={{ width: '50px' }}><div className={`progress-bar-fill ${s.auditScore >= 80 ? 'green' : s.auditScore >= 60 ? 'blue' : 'red'}`} style={{ width: `${s.auditScore}%` }} /></div><span style={{ fontSize: '13px', fontWeight: 600 }}>{s.auditScore}</span></div></td><td><div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '200px' }}>{s.certifications.slice(0, 2).map((c, i) => (<span key={i} className="badge badge-gray" style={{ fontSize: '10px' }}>{c}</span>))}{s.certifications.length > 2 && <span className="badge badge-gray" style={{ fontSize: '10px' }}>+{s.certifications.length - 2}</span>}</div></td><td style={{ fontSize: '13px' }}>{s.lastAudit}</td><td><button className="btn btn-outline btn-sm" onClick={() => setSelectedSupplier(s)}>{t(lang, 'suppliers.viewDetail')}</button></td></tr>))}</tbody></table></div></div>
      </div>
      {selectedSupplier && (
        <div className="modal-overlay" onClick={() => setSelectedSupplier(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedSupplier(null)}>x</button>
            <div className="modal-title">{selectedSupplier.name}<span className={`badge ${getESGBadgeClass(selectedSupplier.esgRating)}`} style={{ marginLeft: '12px' }}>ESG: {selectedSupplier.esgRating}</span><span className={`badge ${getRiskBadgeClass(selectedSupplier.riskLevel)}`} style={{ marginLeft: '8px' }}>{getRiskLabel(selectedSupplier.riskLevel)}</span></div>
            <div className="chart-container" style={{ height: '320px', marginBottom: '16px' }}><ReactECharts option={getRadarOption(selectedSupplier)} style={{ height: '100%' }} /></div>
            <div className="detail-grid">
              <div className="detail-item"><div className="detail-label">Tier</div><div className="detail-value">{selectedSupplier.tier} - {selectedSupplier.category}</div></div>
              <div className="detail-item"><div className="detail-label">Location</div><div className="detail-value">{selectedSupplier.location}</div></div>
              <div className="detail-item"><div className="detail-label">Last Audit</div><div className="detail-value">{selectedSupplier.lastAudit}</div></div>
              <div className="detail-item"><div className="detail-label">Scope 1</div><div className="detail-value">{selectedSupplier.carbonScope1.toLocaleString()} tCO₂e</div></div>
              <div className="detail-item"><div className="detail-label">Scope 2</div><div className="detail-value">{selectedSupplier.carbonScope2.toLocaleString()} tCO₂e</div></div>
              <div className="detail-item"><div className="detail-label">Scope 3</div><div className="detail-value">{selectedSupplier.carbonScope3.toLocaleString()} tCO₂e</div></div>
              <div className="detail-item"><div className="detail-label">Water Use</div><div className="detail-value">{selectedSupplier.waterUse.toLocaleString()} m³</div></div>
              <div className="detail-item"><div className="detail-label">Energy Use</div><div className="detail-value">{selectedSupplier.energyUse.toLocaleString()} MWh</div></div>
              <div className="detail-item"><div className="detail-label">Wastewater</div><div className="detail-value">{selectedSupplier.wasteWater.toLocaleString()} m³</div></div>
              <div className="detail-item"><div className="detail-label">Solid Waste</div><div className="detail-value">{selectedSupplier.solidWaste.toLocaleString()} tons</div></div>
              <div className="detail-item"><div className="detail-label">Chemical Use</div><div className="detail-value">{selectedSupplier.chemicalUse} tons</div></div>
              <div className="detail-item"><div className="detail-label">Penalties</div><div className="detail-value" style={{ color: selectedSupplier.penalties > 0 ? '#e63946' : '#48cae4' }}>{selectedSupplier.penalties}</div></div>
            </div>
            <div style={{ marginTop: '16px' }}><div className="detail-label" style={{ marginBottom: '8px', fontWeight: 600 }}>{t(lang, 'suppliers.certs')}</div><div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>{selectedSupplier.certifications.map((c, i) => (<span key={i} className="badge badge-green">{c}</span>))}{selectedSupplier.certifications.length === 0 && <span className="badge badge-red">{t(lang, 'suppliers.noCerts')}</span>}</div></div>
            <div style={{ marginTop: '16px' }}><div className="detail-label" style={{ marginBottom: '8px', fontWeight: 600 }}>{t(lang, 'suppliers.capStatus')}</div><div style={{ display: 'flex', gap: '16px' }}><span>{t(lang, 'suppliers.total2')}: <strong>{selectedSupplier.capCount}</strong></span><span style={{ color: '#48cae4' }}>{t(lang, 'suppliers.done')}: <strong>{selectedSupplier.capCompleted}</strong></span><span style={{ color: '#e63946' }}>{t(lang, 'suppliers.overdue')}: <strong>{selectedSupplier.capOverdue}</strong></span></div></div>
          </div>
        </div>
      )}
    </div>
  );
}
