import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { capItems, type CAPItem } from '../data';
import { useLang } from '../context/LanguageContext';
import { t, to } from '../i18n';

const C1 = '#2563eb'; const C2 = '#3b82f6'; const C3 = '#60a5fa'; const CR = '#ef4444';

export default function CAPTracking() {
  const { lang } = useLang();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedCAP, setSelectedCAP] = useState<CAPItem | null>(null);
  const filtered = capItems.filter(c => { if (statusFilter !== 'all' && c.status !== statusFilter) return false; if (severityFilter !== 'all' && c.severity !== severityFilter) return false; return true; });
  const total = capItems.length;
  const completed = capItems.filter(c => c.status === 'closed' || c.status === 'verified').length;
  const inProgress = capItems.filter(c => c.status === 'in_progress').length;
  const pending = capItems.filter(c => c.status === 'pending').length;
  const overdue = capItems.filter(c => c.status === 'overdue').length;
  const completionRate = Math.round((completed / total) * 100);

  const getStatusBadgeClass = (s: string) => { switch (s) { case 'closed': case 'verified': return 'badge-green'; case 'in_progress': return 'badge-blue'; case 'pending': return 'badge-yellow'; case 'overdue': return 'badge-red'; default: return 'badge-gray'; } };
  const getStatusLabel = (s: string) => { switch (s) { case 'closed': case 'verified': return t(lang, 'cap.statusClosed'); case 'in_progress': return t(lang, 'cap.statusInProgress'); case 'pending': return t(lang, 'cap.statusPending'); case 'overdue': return t(lang, 'cap.statusOverdue'); default: return s; } };
  const getSeverityBadgeClass = (s: string) => { switch (s) { case 'critical': return 'badge-red'; case 'major': return 'badge-yellow'; case 'minor': return 'badge-blue'; default: return 'badge-gray'; } };
  const getSeverityLabel = (s: string) => { switch (s) { case 'critical': return t(lang, 'cap.severityCritical'); case 'major': return t(lang, 'cap.severityMajor'); case 'minor': return t(lang, 'cap.severityMinor'); default: return s; } };
  const catLabels = to(lang, 'cap.categoryLabels');

  const statusPieOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: '5%', top: 'center', textStyle: { color: '#64748b' } },
    series: [{ type: 'pie', radius: ['50%', '75%'], center: ['40%', '50%'], label: { formatter: '{b}\n{d}%', color: '#64748b' }, itemStyle: { borderColor: '#fff', borderWidth: 3 }, data: [{ value: completed, name: t(lang, 'cap.done'), itemStyle: { color: C1 } }, { value: inProgress, name: t(lang, 'cap.inProgress'), itemStyle: { color: C2 } }, { value: pending, name: t(lang, 'cap.statusPending'), itemStyle: { color: C3 } }, { value: overdue, name: t(lang, 'cap.overdue'), itemStyle: { color: CR } }] }],
  };

  const gaugeOption = {
    series: [{ type: 'gauge', startAngle: 200, endAngle: -20, center: ['50%', '60%'], radius: '85%', min: 0, max: 100, splitNumber: 5, axisLine: { lineStyle: { width: 6, color: [[0.3, CR], [0.6, C1], [1, C2]] } }, pointer: { icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z', length: '60%', width: 8, itemStyle: { color: 'auto' } }, axisTick: { distance: -8, length: 6, lineStyle: { width: 1, color: '#94a3b8' } }, splitLine: { distance: -10, length: 14, lineStyle: { width: 2, color: '#94a3b8' } }, axisLabel: { distance: 20, color: '#64748b', fontSize: 11 }, anchor: { show: true, showAbove: true, size: 14, itemStyle: { borderWidth: 2 } }, title: { show: true, offsetCenter: [0, '85%'], fontSize: 14, color: '#64748b' }, detail: { valueAnimation: true, formatter: '{value}%', fontSize: 28, fontWeight: 'bold', offsetCenter: [0, '55%'], color: '#1a1a2e' }, data: [{ value: completionRate, name: t(lang, 'cap.gauge') }] }],
  };

  const cats = ['废水', '化学品', '安全', '废气', '废弃物', '劳工', '能源', '碳排放'];
  const categoryOption = {
    tooltip: { trigger: 'axis' }, legend: { bottom: 0, textStyle: { color: '#64748b' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: cats.map(c => catLabels[c] || c), axisLabel: { fontSize: 11, rotate: 30, color: '#64748b' }, axisLine: { lineStyle: { color: '#e2e8f0' } } },
    yAxis: { type: 'value', name: '', nameTextStyle: { color: '#64748b' }, axisLabel: { color: '#64748b' }, splitLine: { lineStyle: { color: '#e2e8f0' } } },
    series: [
      { name: t(lang, 'cap.done'), type: 'bar', stack: 'total', data: cats.map(cat => capItems.filter(c => c.category === cat && (c.status === 'closed' || c.status === 'verified')).length), itemStyle: { color: C1 } },
      { name: t(lang, 'cap.inProgress'), type: 'bar', stack: 'total', data: cats.map(cat => capItems.filter(c => c.category === cat && c.status === 'in_progress').length), itemStyle: { color: C2 } },
      { name: t(lang, 'cap.overdue'), type: 'bar', stack: 'total', data: cats.map(cat => capItems.filter(c => c.category === cat && (c.status === 'overdue' || c.status === 'pending')).length), itemStyle: { color: CR } },
    ],
  };

  return (
    <div>
      <div className="page-header"><h1 className="page-title">{t(lang, 'cap.title')}</h1><p className="page-desc">{t(lang, 'cap.desc')}</p></div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'cap.total')}</div><div className="stat-card-value">{total}</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'cap.done')}</div><div className="stat-card-value" style={{ color: C1 }}>{completed}</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'cap.inProgress')}</div><div className="stat-card-value" style={{ color: C2 }}>{inProgress}</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'cap.overdue')}</div><div className="stat-card-value" style={{ color: CR }}>{overdue}</div><div className="stat-card-change down">{t(lang, 'cap.needUrgent')}</div></div></div>
      </div>
      <div className="grid-3"><div className="card"><div className="card-header"><span className="card-title">{t(lang, 'cap.pie')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={statusPieOption} style={{ height: '100%' }} /></div></div></div><div className="card"><div className="card-header"><span className="card-title">{t(lang, 'cap.gauge')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={gaugeOption} style={{ height: '100%' }} /></div></div></div><div className="card"><div className="card-header"><span className="card-title">{t(lang, 'cap.category')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={categoryOption} style={{ height: '100%' }} /></div></div></div></div>
      <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'cap.list')}</span><div className="filter-bar" style={{ marginBottom: 0 }}><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="all">{t(lang, 'cap.allStatus')}</option><option value="pending">{t(lang, 'cap.statusPending')}</option><option value="in_progress">{t(lang, 'cap.statusInProgress')}</option><option value="verified">{t(lang, 'cap.statusVerified')}</option><option value="closed">{t(lang, 'cap.statusClosed')}</option><option value="overdue">{t(lang, 'cap.statusOverdue')}</option></select><select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}><option value="all">{t(lang, 'cap.allSeverity')}</option><option value="critical">{t(lang, 'cap.severityCritical')}</option><option value="major">{t(lang, 'cap.severityMajor')}</option><option value="minor">{t(lang, 'cap.severityMinor')}</option></select></div></div><div className="card-body" style={{ padding: 0 }}><div className="table-wrap"><table><thead><tr><th>ID</th><th>Supplier</th><th>Issue</th><th>Category</th><th>Severity</th><th>Status</th><th>Submit</th><th>Due</th><th>Close</th><th>Verifier</th><th></th></tr></thead><tbody>{filtered.map(c => (<tr key={c.id} style={{ background: c.status === 'overdue' ? '#fef2f2' : undefined }}><td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{c.id}</td><td style={{ fontWeight: 600 }}>{c.supplierName}</td><td style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.issue}</td><td><span className="badge badge-gray">{catLabels[c.category] || c.category}</span></td><td><span className={`badge ${getSeverityBadgeClass(c.severity)}`}>{getSeverityLabel(c.severity)}</span></td><td><span className={`badge ${getStatusBadgeClass(c.status)}`}>{getStatusLabel(c.status)}</span></td><td style={{ fontSize: '13px' }}>{c.submitDate}</td><td style={{ fontSize: '13px', color: c.status === 'overdue' ? '#ef4444' : undefined, fontWeight: c.status === 'overdue' ? 600 : undefined }}>{c.dueDate}</td><td style={{ fontSize: '13px' }}>{c.closeDate || '-'}</td><td>{c.verifier}</td><td><button className="btn btn-outline btn-sm" onClick={() => setSelectedCAP(c)}>{t(lang, 'cap.detail')}</button></td></tr>))}</tbody></table></div></div></div>
      {selectedCAP && (<div className="modal-overlay" onClick={() => setSelectedCAP(null)}><div className="modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelectedCAP(null)}>x</button><div className="modal-title">{selectedCAP.id} - {selectedCAP.issue}</div><div className="detail-grid"><div className="detail-item"><div className="detail-label">Supplier</div><div className="detail-value">{selectedCAP.supplierName}</div></div><div className="detail-item"><div className="detail-label">Category</div><div className="detail-value"><span className="badge badge-gray">{catLabels[selectedCAP.category] || selectedCAP.category}</span></div></div><div className="detail-item"><div className="detail-label">Severity</div><div className="detail-value"><span className={`badge ${getSeverityBadgeClass(selectedCAP.severity)}`}>{getSeverityLabel(selectedCAP.severity)}</span></div></div><div className="detail-item"><div className="detail-label">Status</div><div className="detail-value"><span className={`badge ${getStatusBadgeClass(selectedCAP.status)}`}>{getStatusLabel(selectedCAP.status)}</span></div></div><div className="detail-item"><div className="detail-label">Submit</div><div className="detail-value">{selectedCAP.submitDate}</div></div><div className="detail-item"><div className="detail-label">Due</div><div className="detail-value" style={{ color: selectedCAP.status === 'overdue' ? '#ef4444' : undefined }}>{selectedCAP.dueDate}</div></div><div className="detail-item"><div className="detail-label">Close</div><div className="detail-value">{selectedCAP.closeDate || t(lang, 'cap.notClosed')}</div></div><div className="detail-item"><div className="detail-label">Verifier</div><div className="detail-value">{selectedCAP.verifier}</div></div></div><div style={{ marginTop: '24px' }}><div style={{ fontWeight: 600, marginBottom: '16px', color: '#1a1a2e' }}>{t(lang, 'cap.timeline')}</div><div className="timeline"><div className="timeline-item"><div className={`timeline-dot ${selectedCAP.status !== 'pending' ? 'done' : 'pending'}`} /><div className="timeline-date">{selectedCAP.submitDate}</div><div className="timeline-title">{t(lang, 'cap.timeline1')}</div></div><div className="timeline-item"><div className={`timeline-dot ${selectedCAP.status === 'in_progress' || selectedCAP.status === 'verified' || selectedCAP.status === 'closed' ? 'done' : 'pending'}`} /><div className="timeline-date">{selectedCAP.dueDate}</div><div className="timeline-title">{t(lang, 'cap.timeline2')}</div></div><div className="timeline-item"><div className={`timeline-dot ${selectedCAP.status === 'verified' || selectedCAP.status === 'closed' ? 'done' : selectedCAP.status === 'overdue' ? 'overdue' : 'pending'}`} /><div className="timeline-date">{selectedCAP.dueDate}</div><div className="timeline-title">{selectedCAP.status === 'overdue' ? t(lang, 'cap.timeline3Overdue') : selectedCAP.status === 'verified' || selectedCAP.status === 'closed' ? `${selectedCAP.verifier} ${t(lang, 'cap.timeline3Done')}` : t(lang, 'cap.timeline3')}</div></div><div className="timeline-item"><div className={`timeline-dot ${selectedCAP.status === 'closed' ? 'done' : 'pending'}`} /><div className="timeline-date">{selectedCAP.closeDate || '-'}</div><div className="timeline-title">{selectedCAP.status === 'closed' ? t(lang, 'cap.timeline4') : t(lang, 'cap.timeline4Wait')}</div></div></div></div></div></div>)}
    </div>
  );
}
