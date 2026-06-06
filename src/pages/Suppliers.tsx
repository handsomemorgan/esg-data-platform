import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { suppliers, type Supplier } from '../data';

export default function Suppliers() {
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

  const getRiskBadgeClass = (level: string) => {
    switch (level) { case 'low': return 'badge-green'; case 'medium': return 'badge-yellow'; case 'high': return 'badge-red'; default: return 'badge-gray'; }
  };
  const getRiskLabel = (level: string) => {
    switch (level) { case 'low': return '低风险'; case 'medium': return '中风险'; case 'high': return '高风险'; default: return '未知'; }
  };
  const getESGBadgeClass = (rating: string) => {
    switch (rating) { case 'A': return 'badge-green'; case 'B': return 'badge-blue'; case 'C': return 'badge-yellow'; case 'D': return 'badge-red'; default: return 'badge-gray'; }
  };

  // Radar chart for selected supplier
  const getRadarOption = (s: Supplier) => ({
    tooltip: {},
    radar: {
      indicator: [
        { name: '碳排放\n管理', max: 100 },
        { name: '水资源\n管理', max: 100 },
        { name: '化学品\n管理', max: 100 },
        { name: '废弃物\n管理', max: 100 },
        { name: '合规\n表现', max: 100 },
        { name: '认证\n覆盖', max: 100 },
      ],
      center: ['50%', '55%'],
      radius: '70%',
    },
    series: [{
      type: 'radar',
      data: [{
        value: [
          100 - Math.round((s.carbonScope1 + s.carbonScope2) / 500),
          Math.max(0, 100 - Math.round(s.waterUse / 5000)),
          Math.max(0, 100 - Math.round(s.chemicalUse / 3)),
          Math.max(0, 100 - Math.round(s.solidWaste / 10)),
          s.auditScore,
          Math.min(100, s.certifications.length * 25),
        ],
        name: s.name,
        areaStyle: { color: 'rgba(26,107,71,0.25)' },
        lineStyle: { color: '#1a6b47' },
        itemStyle: { color: '#1a6b47' },
      }],
    }],
  });

  // Compare ESG ratings
  const ratingBarOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: suppliers.map(s => s.name.slice(0, 4)) },
    yAxis: { type: 'value', name: '审计得分', max: 100 },
    grid: { left: '3%', right: '4%', bottom: '20%', top: '5%', containLabel: true },
    series: [{
      type: 'bar',
      data: suppliers.map(s => ({
        value: s.auditScore,
        itemStyle: {
          color: s.auditScore >= 80 ? '#10b981' : s.auditScore >= 60 ? '#3b82f6' : s.auditScore >= 45 ? '#f59e0b' : '#ef4444',
          borderRadius: [4, 4, 0, 0],
        },
      })),
      barWidth: '60%',
      label: { show: true, position: 'top', fontSize: 11, fontWeight: 600 },
    }],
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">供应商ESG档案</h1>
        <p className="page-desc">为每家供应商建立"一企一档"，记录认证、评级、整改和历史表现，形成供应商ESG画像</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">供应商总数</div>
            <div className="stat-card-value">{suppliers.length}</div>
          </div>
          <div className="stat-card-icon green">📋</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">A级供应商</div>
            <div className="stat-card-value">{suppliers.filter(s => s.esgRating === 'A').length}</div>
          </div>
          <div className="stat-card-icon green">⭐</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">平均审计得分</div>
            <div className="stat-card-value">{Math.round(suppliers.reduce((a, b) => a + b.auditScore, 0) / suppliers.length)}</div>
          </div>
          <div className="stat-card-icon blue">📊</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">高风险供应商</div>
            <div className="stat-card-value" style={{ color: 'var(--danger)' }}>{suppliers.filter(s => s.riskLevel === 'high').length}</div>
          </div>
          <div className="stat-card-icon red">⚠️</div>
        </div>
      </div>

      {/* Compare chart */}
      <div className="card">
        <div className="card-header"><span className="card-title">供应商审计得分对比</span></div>
        <div className="card-body">
          <div className="chart-container" style={{ height: '300px' }}>
            <ReactECharts option={ratingBarOption} style={{ height: '100%' }} />
          </div>
        </div>
      </div>

      {/* Supplier list */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">供应商档案列表</span>
          <div className="filter-bar" style={{ marginBottom: 0 }}>
            <input
              className="search-input"
              placeholder="🔍 搜索供应商名称或所在地..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: '#fff' }}
            />
            <select value={tierFilter} onChange={e => setTierFilter(e.target.value)}>
              <option value="all">全部层级</option>
              <option value="Tier 1">Tier 1</option>
              <option value="Tier 2">Tier 2</option>
              <option value="Tier 3">Tier 3</option>
            </select>
            <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)}>
              <option value="all">全部风险</option>
              <option value="low">低风险</option>
              <option value="medium">中风险</option>
              <option value="high">高风险</option>
            </select>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>编号</th><th>供应商名称</th><th>层级</th><th>类别</th><th>所在地</th>
                  <th>ESG评级</th><th>风险等级</th><th>审计得分</th><th>认证</th>
                  <th>最近验厂</th><th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{s.id}</td>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td><span className="badge badge-blue">{s.tier}</span></td>
                    <td>{s.category}</td>
                    <td>{s.location}</td>
                    <td><span className={`badge ${getESGBadgeClass(s.esgRating)}`}>{s.esgRating}</span></td>
                    <td><span className={`badge ${getRiskBadgeClass(s.riskLevel)}`}>{getRiskLabel(s.riskLevel)}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="progress-bar" style={{ width: '50px' }}>
                          <div
                            className={`progress-bar-fill ${s.auditScore >= 80 ? 'green' : s.auditScore >= 60 ? 'blue' : 'red'}`}
                            style={{ width: `${s.auditScore}%` }}
                          />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{s.auditScore}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '200px' }}>
                        {s.certifications.slice(0, 2).map((c, i) => (
                          <span key={i} className="badge badge-gray" style={{ fontSize: '10px' }}>{c}</span>
                        ))}
                        {s.certifications.length > 2 && <span className="badge badge-gray" style={{ fontSize: '10px' }}>+{s.certifications.length - 2}</span>}
                      </div>
                    </td>
                    <td style={{ fontSize: '13px' }}>{s.lastAudit}</td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => setSelectedSupplier(s)}>
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
        <div className="modal-overlay" onClick={() => setSelectedSupplier(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <button className="modal-close" onClick={() => setSelectedSupplier(null)}>✕</button>
            <div className="modal-title">
              {selectedSupplier.name}
              <span className={`badge ${getESGBadgeClass(selectedSupplier.esgRating)}`} style={{ marginLeft: '12px' }}>
                ESG评级: {selectedSupplier.esgRating}
              </span>
              <span className={`badge ${getRiskBadgeClass(selectedSupplier.riskLevel)}`} style={{ marginLeft: '8px' }}>
                {getRiskLabel(selectedSupplier.riskLevel)}
              </span>
            </div>

            {/* ESG Radar */}
            <div className="chart-container" style={{ height: '320px', marginBottom: '16px' }}>
              <ReactECharts option={getRadarOption(selectedSupplier)} style={{ height: '100%' }} />
            </div>

            {/* Detail Grid */}
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">层级</div>
                <div className="detail-value">{selectedSupplier.tier} - {selectedSupplier.category}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">所在地</div>
                <div className="detail-value">{selectedSupplier.location}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">最近验厂日期</div>
                <div className="detail-value">{selectedSupplier.lastAudit}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Scope 1 排放</div>
                <div className="detail-value">{selectedSupplier.carbonScope1.toLocaleString()} tCO₂e</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Scope 2 排放</div>
                <div className="detail-value">{selectedSupplier.carbonScope2.toLocaleString()} tCO₂e</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Scope 3 估算</div>
                <div className="detail-value">{selectedSupplier.carbonScope3.toLocaleString()} tCO₂e</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">年用水量</div>
                <div className="detail-value">{selectedSupplier.waterUse.toLocaleString()} m³</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">年能耗</div>
                <div className="detail-value">{selectedSupplier.energyUse.toLocaleString()} MWh</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">废水排放</div>
                <div className="detail-value">{selectedSupplier.wasteWater.toLocaleString()} m³</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">固体废弃物</div>
                <div className="detail-value">{selectedSupplier.solidWaste.toLocaleString()} 吨</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">化学品使用</div>
                <div className="detail-value">{selectedSupplier.chemicalUse} 吨</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">环保处罚次数</div>
                <div className="detail-value" style={{ color: selectedSupplier.penalties > 0 ? 'var(--danger)' : 'var(--success)' }}>
                  {selectedSupplier.penalties} 次
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <div className="detail-label" style={{ marginBottom: '8px', fontWeight: 600 }}>认证信息</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {selectedSupplier.certifications.map((c, i) => (
                  <span key={i} className="badge badge-green">{c}</span>
                ))}
                {selectedSupplier.certifications.length === 0 && <span className="badge badge-red">无认证</span>}
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <div className="detail-label" style={{ marginBottom: '8px', fontWeight: 600 }}>CAP整改情况</div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span>总计: <strong>{selectedSupplier.capCount}</strong></span>
                <span style={{ color: 'var(--success)' }}>已完成: <strong>{selectedSupplier.capCompleted}</strong></span>
                <span style={{ color: 'var(--danger)' }}>逾期: <strong>{selectedSupplier.capOverdue}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
