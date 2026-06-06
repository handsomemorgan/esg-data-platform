import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { capItems, type CAPItem } from '../data';

export default function CAPTracking() {
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
  const getStatusLabel = (s: string) => { switch (s) { case 'closed': case 'verified': return '已完成'; case 'in_progress': return '进行中'; case 'pending': return '待处理'; case 'overdue': return '已逾期'; default: return s; } };
  const getSeverityBadgeClass = (s: string) => { switch (s) { case 'critical': return 'badge-red'; case 'major': return 'badge-yellow'; case 'minor': return 'badge-blue'; default: return 'badge-gray'; } };
  const getSeverityLabel = (s: string) => { switch (s) { case 'critical': return '严重'; case 'major': return '重大'; case 'minor': return '轻微'; default: return s; } };

  const statusPieOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}项 ({d}%)' },
    legend: { orient: 'vertical', right: '5%', top: 'center', textStyle: { color: '#7b8ca3' } },
    series: [{ type: 'pie', radius: ['50%', '75%'], center: ['40%', '50%'], label: { formatter: '{b}\n{d}%', color: '#7b8ca3' }, itemStyle: { borderColor: '#0d1330', borderWidth: 3 }, data: [{ value: completed, name: '已完成', itemStyle: { color: '#00b4d8' } }, { value: inProgress, name: '进行中', itemStyle: { color: '#48cae4' } }, { value: pending, name: '待处理', itemStyle: { color: '#0077b6' } }, { value: overdue, name: '已逾期', itemStyle: { color: '#e63946' } }] }],
  };

  const gaugeOption = {
    series: [{ type: 'gauge', startAngle: 200, endAngle: -20, center: ['50%', '60%'], radius: '85%', min: 0, max: 100, splitNumber: 5, axisLine: { lineStyle: { width: 6, color: [[0.3, '#e63946'], [0.6, '#0077b6'], [1, '#00b4d8']] } }, pointer: { icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z', length: '60%', width: 8, itemStyle: { color: 'auto' } }, axisTick: { distance: -8, length: 6, lineStyle: { width: 1, color: '#556278' } }, splitLine: { distance: -10, length: 14, lineStyle: { width: 2, color: '#556278' } }, axisLabel: { distance: 20, color: '#7b8ca3', fontSize: 11 }, anchor: { show: true, showAbove: true, size: 14, itemStyle: { borderWidth: 2, borderColor: '#556278' } }, title: { show: true, offsetCenter: [0, '85%'], fontSize: 14, color: '#7b8ca3' }, detail: { valueAnimation: true, formatter: '{value}%', fontSize: 28, fontWeight: 'bold', offsetCenter: [0, '55%'], color: '#e0e8f0' }, data: [{ value: completionRate, name: '整改完成率' }] }],
  };

  const categoryOption = {
    tooltip: { trigger: 'axis' }, legend: { bottom: 0, textStyle: { color: '#7b8ca3' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: ['废水', '化学品', '安全', '废气', '废弃物', '劳工', '能源', '碳排放'], axisLabel: { fontSize: 11, rotate: 30, color: '#7b8ca3' }, axisLine: { lineStyle: { color: '#1a2555' } } },
    yAxis: { type: 'value', name: '数量', nameTextStyle: { color: '#7b8ca3' }, axisLabel: { color: '#7b8ca3' }, splitLine: { lineStyle: { color: '#1a2555' } } },
    series: [
      { name: '已完成', type: 'bar', stack: 'total', data: ['废水','化学品','安全','废气','废弃物','劳工','能源','碳排放'].map(cat => capItems.filter(c => c.category === cat && (c.status === 'closed' || c.status === 'verified')).length), itemStyle: { color: '#00b4d8' } },
      { name: '进行中', type: 'bar', stack: 'total', data: ['废水','化学品','安全','废气','废弃物','劳工','能源','碳排放'].map(cat => capItems.filter(c => c.category === cat && c.status === 'in_progress').length), itemStyle: { color: '#48cae4' } },
      { name: '逾期/待处理', type: 'bar', stack: 'total', data: ['废水','化学品','安全','废气','废弃物','劳工','能源','碳排放'].map(cat => capItems.filter(c => c.category === cat && (c.status === 'overdue' || c.status === 'pending')).length), itemStyle: { color: '#e63946' } },
    ],
  };

  return (
    <div>
      <div className="page-header"><h1 className="page-title">CAP整改追踪</h1><p className="page-desc">跟踪整改计划提交、执行、验证和关闭情况，监控整改完成率与逾期整改清单</p></div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">整改项目总数</div><div className="stat-card-value">{total}</div></div><div className="stat-card-icon">📝</div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">已完成</div><div className="stat-card-value" style={{ color: '#48cae4' }}>{completed}</div></div><div className="stat-card-icon">✅</div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">进行中</div><div className="stat-card-value" style={{ color: '#00b4d8' }}>{inProgress}</div></div><div className="stat-card-icon">🔄</div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">已逾期</div><div className="stat-card-value" style={{ color: '#e63946' }}>{overdue}</div><div className="stat-card-change down">需紧急处理</div></div><div className="stat-card-icon">🚨</div></div>
      </div>
      <div className="grid-3">
        <div className="card"><div className="card-header"><span className="card-title">整改状态分布</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={statusPieOption} style={{ height: '100%' }} /></div></div></div>
        <div className="card"><div className="card-header"><span className="card-title">整改完成率</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={gaugeOption} style={{ height: '100%' }} /></div></div></div>
        <div className="card"><div className="card-header"><span className="card-title">分类整改进度</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={categoryOption} style={{ height: '100%' }} /></div></div></div>
      </div>
      <div className="card">
        <div className="card-header">
          <span className="card-title">CAP整改清单</span>
          <div className="filter-bar" style={{ marginBottom: 0 }}>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="all">全部状态</option><option value="pending">待处理</option><option value="in_progress">进行中</option><option value="verified">已验证</option><option value="closed">已关闭</option><option value="overdue">已逾期</option></select>
            <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}><option value="all">全部严重程度</option><option value="critical">严重</option><option value="major">重大</option><option value="minor">轻微</option></select>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}><div className="table-wrap"><table><thead><tr><th>编号</th><th>供应商</th><th>问题描述</th><th>类别</th><th>严重程度</th><th>状态</th><th>提交日期</th><th>截止日期</th><th>关闭日期</th><th>验证机构</th><th>操作</th></tr></thead><tbody>{filtered.map(c => (<tr key={c.id} style={{ background: c.status === 'overdue' ? 'rgba(230,57,70,0.05)' : undefined }}><td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{c.id}</td><td style={{ fontWeight: 600 }}>{c.supplierName}</td><td style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.issue}</td><td><span className="badge badge-gray">{c.category}</span></td><td><span className={`badge ${getSeverityBadgeClass(c.severity)}`}>{getSeverityLabel(c.severity)}</span></td><td><span className={`badge ${getStatusBadgeClass(c.status)}`}>{getStatusLabel(c.status)}</span></td><td style={{ fontSize: '13px' }}>{c.submitDate}</td><td style={{ fontSize: '13px', color: c.status === 'overdue' ? '#e63946' : undefined, fontWeight: c.status === 'overdue' ? 600 : undefined }}>{c.dueDate}</td><td style={{ fontSize: '13px' }}>{c.closeDate || '-'}</td><td>{c.verifier}</td><td><button className="btn btn-outline btn-sm" onClick={() => setSelectedCAP(c)}>详情</button></td></tr>))}</tbody></table></div></div>
      </div>
      {selectedCAP && (
        <div className="modal-overlay" onClick={() => setSelectedCAP(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCAP(null)}>✕</button>
            <div className="modal-title">{selectedCAP.id} - {selectedCAP.issue}</div>
            <div className="detail-grid">
              <div className="detail-item"><div className="detail-label">供应商</div><div className="detail-value">{selectedCAP.supplierName}</div></div>
              <div className="detail-item"><div className="detail-label">类别</div><div className="detail-value"><span className="badge badge-gray">{selectedCAP.category}</span></div></div>
              <div className="detail-item"><div className="detail-label">严重程度</div><div className="detail-value"><span className={`badge ${getSeverityBadgeClass(selectedCAP.severity)}`}>{getSeverityLabel(selectedCAP.severity)}</span></div></div>
              <div className="detail-item"><div className="detail-label">当前状态</div><div className="detail-value"><span className={`badge ${getStatusBadgeClass(selectedCAP.status)}`}>{getStatusLabel(selectedCAP.status)}</span></div></div>
              <div className="detail-item"><div className="detail-label">提交日期</div><div className="detail-value">{selectedCAP.submitDate}</div></div>
              <div className="detail-item"><div className="detail-label">截止日期</div><div className="detail-value" style={{ color: selectedCAP.status === 'overdue' ? '#e63946' : undefined }}>{selectedCAP.dueDate}</div></div>
              <div className="detail-item"><div className="detail-label">关闭日期</div><div className="detail-value">{selectedCAP.closeDate || '未关闭'}</div></div>
              <div className="detail-item"><div className="detail-label">验证机构</div><div className="detail-value">{selectedCAP.verifier}</div></div>
            </div>
            <div style={{ marginTop: '24px' }}><div style={{ fontWeight: 600, marginBottom: '16px', color: '#c8d6e5' }}>整改追踪时间线</div><div className="timeline"><div className="timeline-item"><div className={`timeline-dot ${selectedCAP.status !== 'pending' ? 'done' : 'pending'}`} /><div className="timeline-date">{selectedCAP.submitDate}</div><div className="timeline-title">整改计划提交</div></div><div className="timeline-item"><div className={`timeline-dot ${selectedCAP.status === 'in_progress' || selectedCAP.status === 'verified' || selectedCAP.status === 'closed' ? 'done' : 'pending'}`} /><div className="timeline-date">{selectedCAP.dueDate}</div><div className="timeline-title">整改执行中</div></div><div className="timeline-item"><div className={`timeline-dot ${selectedCAP.status === 'verified' || selectedCAP.status === 'closed' ? 'done' : selectedCAP.status === 'overdue' ? 'overdue' : 'pending'}`} /><div className="timeline-date">{selectedCAP.dueDate}</div><div className="timeline-title">{selectedCAP.status === 'overdue' ? '整改已逾期' : selectedCAP.status === 'verified' || selectedCAP.status === 'closed' ? `${selectedCAP.verifier} 验证通过` : '第三方验证'}</div></div><div className="timeline-item"><div className={`timeline-dot ${selectedCAP.status === 'closed' ? 'done' : 'pending'}`} /><div className="timeline-date">{selectedCAP.closeDate || '待定'}</div><div className="timeline-title">{selectedCAP.status === 'closed' ? '整改关闭' : '等待关闭'}</div></div></div></div>
          </div>
        </div>
      )}
    </div>
  );
}
