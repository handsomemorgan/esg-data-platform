import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { suppliers } from '../data';

export default function RiskHeatmap() {
  const [riskView, setRiskView] = useState<'matrix' | 'map' | 'list'>('matrix');

  // Risk matrix data: x = ESG rating (A=4,B=3,C=2,D=1), y = audit score
  const riskMatrixOption = {
    tooltip: {
      formatter: (params: { data: number[] }) => {
        const s = suppliers.find(
          x => x.esgRating === ['D','C','B','A'][Math.round(params.data[0]) - 1] &&
               Math.abs(x.auditScore - params.data[1]) < 3
        );
        return s ? `${s.name}<br/>ESG: ${s.esgRating} | 审计: ${s.auditScore}<br/>风险: ${s.riskLevel === 'high' ? '高' : s.riskLevel === 'medium' ? '中' : '低'}` : '';
      },
    },
    grid: { left: '8%', right: '5%', bottom: '8%', top: '5%' },
    xAxis: {
      type: 'category',
      data: ['D', 'C', 'B', 'A'],
      name: 'ESG评级',
      nameLocation: 'center',
      nameGap: 25,
      axisLabel: { fontSize: 14, fontWeight: 'bold' },
    },
    yAxis: {
      type: 'value',
      name: '审计得分',
      min: 30,
      max: 100,
      nameLocation: 'center',
      nameGap: 40,
    },
    series: [{
      type: 'scatter',
      symbolSize: (val: number[]) => {
        const s = suppliers.find(
          x => x.esgRating === ['D','C','B','A'][Math.round(val[0]) - 1] &&
               Math.abs(x.auditScore - val[1]) < 3
        );
        return s ? (s.carbonScope1 + s.carbonScope2) / 500 : 20;
      },
      data: suppliers.map(s => ({
        value: [['D','C','B','A'].indexOf(s.esgRating), s.auditScore],
        name: s.name,
        itemStyle: {
          color: s.riskLevel === 'high' ? '#ef4444' : s.riskLevel === 'medium' ? '#f59e0b' : '#10b981',
          borderColor: s.penalties > 2 ? '#991b1b' : 'transparent',
          borderWidth: s.penalties > 2 ? 3 : 0,
        },
      })),
      label: {
        show: true,
        formatter: (params: { name: string }) => params.name.slice(0, 4),
        fontSize: 10,
        position: 'top',
      },
      emphasis: {
        label: { fontSize: 14, fontWeight: 'bold' },
        scale: 1.5,
      },
    }],
  };

  // Risk distribution bar
  const riskBarOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['高风险', '中风险', '低风险'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: ['Tier 1', 'Tier 2', 'Tier 3'] },
    yAxis: { type: 'value', name: '供应商数量' },
    series: [
      {
        name: '高风险', type: 'bar', stack: 'total',
        data: [
          suppliers.filter(s => s.tier === 'Tier 1' && s.riskLevel === 'high').length,
          suppliers.filter(s => s.tier === 'Tier 2' && s.riskLevel === 'high').length,
          suppliers.filter(s => s.tier === 'Tier 3' && s.riskLevel === 'high').length,
        ],
        itemStyle: { color: '#ef4444' }, barWidth: '50%',
      },
      {
        name: '中风险', type: 'bar', stack: 'total',
        data: [
          suppliers.filter(s => s.tier === 'Tier 1' && s.riskLevel === 'medium').length,
          suppliers.filter(s => s.tier === 'Tier 2' && s.riskLevel === 'medium').length,
          suppliers.filter(s => s.tier === 'Tier 3' && s.riskLevel === 'medium').length,
        ],
        itemStyle: { color: '#f59e0b' },
      },
      {
        name: '低风险', type: 'bar', stack: 'total',
        data: [
          suppliers.filter(s => s.tier === 'Tier 1' && s.riskLevel === 'low').length,
          suppliers.filter(s => s.tier === 'Tier 2' && s.riskLevel === 'low').length,
          suppliers.filter(s => s.tier === 'Tier 3' && s.riskLevel === 'low').length,
        ],
        itemStyle: { color: '#10b981' },
      },
    ],
  };

  // Sunburst: risk factors
  const sunburstOption = {
    tooltip: { trigger: 'item' },
    series: [{
      type: 'sunburst',
      data: [{
        name: '高风险(3)',
        itemStyle: { color: '#ef4444' },
        children: [
          { name: 'ESG评级低', value: 2, itemStyle: { color: '#f87171' } },
          { name: '环保处罚', value: 3, itemStyle: { color: '#fca5a5' } },
          { name: '舆情风险', value: 2, itemStyle: { color: '#fecaca' } },
        ],
      }, {
        name: '中风险(4)',
        itemStyle: { color: '#f59e0b' },
        children: [
          { name: '验厂得分低', value: 2, itemStyle: { color: '#fbbf24' } },
          { name: '整改逾期', value: 3, itemStyle: { color: '#fcd34d' } },
          { name: '认证不足', value: 2, itemStyle: { color: '#fde68a' } },
        ],
      }, {
        name: '低风险(3)',
        itemStyle: { color: '#10b981' },
        children: [
          { name: '体系完善', value: 3, itemStyle: { color: '#34d399' } },
          { name: '表现良好', value: 3, itemStyle: { color: '#6ee7b7' } },
        ],
      }],
      radius: [0, '90%'],
      label: { rotate: 'radial', fontSize: 11 },
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
    }],
  };

  const highRiskSuppliers = suppliers.filter(s => s.riskLevel === 'high');

  const getRiskBadgeClass = (level: string) => {
    switch (level) { case 'low': return 'badge-green'; case 'medium': return 'badge-yellow'; case 'high': return 'badge-red'; default: return 'badge-gray'; }
  };
  const getRiskLabel = (level: string) => {
    switch (level) { case 'low': return '低'; case 'medium': return '中'; case 'high': return '高'; default: return '?'; }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">风险热力图</h1>
        <p className="page-desc">根据ESG评级、环保处罚、财务和舆情风险形成红黄绿评级，生成高风险供应商预警名单</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="stat-card-info">
            <div className="stat-card-label">高风险供应商</div>
            <div className="stat-card-value" style={{ color: 'var(--danger)' }}>{suppliers.filter(s => s.riskLevel === 'high').length}</div>
          </div>
          <div className="stat-card-icon red">🔴</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-card-info">
            <div className="stat-card-label">中风险供应商</div>
            <div className="stat-card-value" style={{ color: '#d97706' }}>{suppliers.filter(s => s.riskLevel === 'medium').length}</div>
          </div>
          <div className="stat-card-icon orange">🟡</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-card-info">
            <div className="stat-card-label">低风险供应商</div>
            <div className="stat-card-value" style={{ color: 'var(--success)' }}>{suppliers.filter(s => s.riskLevel === 'low').length}</div>
          </div>
          <div className="stat-card-icon green">🟢</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #7c3aed' }}>
          <div className="stat-card-info">
            <div className="stat-card-label">累计环保处罚</div>
            <div className="stat-card-value" style={{ color: '#7c3aed' }}>{suppliers.reduce((a, b) => a + b.penalties, 0)}次</div>
          </div>
          <div className="stat-card-icon purple">⚖️</div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="tabs">
        <div className={`tab ${riskView === 'matrix' ? 'active' : ''}`} onClick={() => setRiskView('matrix')}>🎯 风险矩阵</div>
        <div className={`tab ${riskView === 'map' ? 'active' : ''}`} onClick={() => setRiskView('map')}>📊 风险分布</div>
        <div className={`tab ${riskView === 'list' ? 'active' : ''}`} onClick={() => setRiskView('list')}>⚠️ 预警名单</div>
      </div>

      {riskView === 'matrix' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header"><span className="card-title">ESG风险矩阵 (评级 × 审计得分)</span></div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '420px' }}>
                <ReactECharts option={riskMatrixOption} style={{ height: '100%' }} />
              </div>
              <div className="heat-legend" style={{ marginTop: '12px', justifyContent: 'center' }}>
                <div className="heat-legend-item"><div className="heat-legend-dot green" /> 低风险</div>
                <div className="heat-legend-item"><div className="heat-legend-dot yellow" /> 中风险</div>
                <div className="heat-legend-item"><div className="heat-legend-dot red" /> 高风险</div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                  气泡大小=碳排放量 | 粗边框=有环保处罚
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">风险因素旭日图</span></div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '420px' }}>
                <ReactECharts option={sunburstOption} style={{ height: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {riskView === 'map' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header"><span className="card-title">各层级风险分布</span></div>
            <div className="card-body">
              <div className="chart-container">
                <ReactECharts option={riskBarOption} style={{ height: '100%' }} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">各层级风险占比</span></div>
            <div className="card-body">
              <div className="chart-container">
                <ReactECharts
                  option={{
                    tooltip: { trigger: 'item', formatter: '{b}: {c}家 ({d}%)' },
                    legend: { bottom: 0 },
                    series: [{
                      type: 'pie', radius: ['50%', '75%'], center: ['50%', '45%'],
                      data: [
                        { value: suppliers.filter(s => s.riskLevel === 'high').length, name: '高风险', itemStyle: { color: '#ef4444' } },
                        { value: suppliers.filter(s => s.riskLevel === 'medium').length, name: '中风险', itemStyle: { color: '#f59e0b' } },
                        { value: suppliers.filter(s => s.riskLevel === 'low').length, name: '低风险', itemStyle: { color: '#10b981' } },
                      ],
                      label: { fontSize: 13 },
                    }],
                  }}
                  style={{ height: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {riskView === 'list' && (
        <>
          {/* Risk summary */}
          <div className="stats-row">
            <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
              <div className="stat-card-info">
                <div className="stat-card-label">🔴 高风险预警</div>
                <div className="stat-card-value" style={{ fontSize: '20px' }}>需立即采取整改行动</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">⚠️ 高风险供应商预警名单</span>
              <span className="badge badge-red">{highRiskSuppliers.length} 家需关注</span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>排名</th><th>供应商</th><th>层级</th><th>类别</th>
                      <th>ESG评级</th><th>审计得分</th><th>环保处罚</th>
                      <th>舆情风险</th><th>碳排放(tCO₂e)</th><th>预警原因</th>
                    </tr>
                  </thead>
                  <tbody>
                    {highRiskSuppliers.map((s, i) => (
                      <tr key={s.id} style={{ background: i === 0 ? '#fef2f2' : undefined }}>
                        <td><strong>#{i + 1}</strong></td>
                        <td style={{ fontWeight: 600 }}>{s.name}</td>
                        <td><span className="badge badge-blue">{s.tier}</span></td>
                        <td>{s.category}</td>
                        <td><span className={`badge ${s.esgRating === 'C' ? 'badge-yellow' : 'badge-red'}`}>{s.esgRating}</span></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="progress-bar" style={{ width: '50px' }}>
                              <div className="progress-bar-fill red" style={{ width: `${s.auditScore}%` }} />
                            </div>
                            <span style={{ fontWeight: 600, color: 'var(--danger)' }}>{s.auditScore}</span>
                          </div>
                        </td>
                        <td><span className="badge badge-red">{s.penalties}次</span></td>
                        <td><span className={`badge ${getRiskBadgeClass(s.mediaRisk)}`}>{s.mediaRisk === 'high' ? '高' : s.mediaRisk === 'medium' ? '中' : s.mediaRisk === 'low' ? '低' : '无'}</span></td>
                        <td>{(s.carbonScope1 + s.carbonScope2 + s.carbonScope3).toLocaleString()}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {s.penalties > 0 && <span className="badge badge-red">环保处罚</span>}
                            {s.mediaRisk === 'high' && <span className="badge badge-red">负面舆情</span>}
                            {s.auditScore < 60 && <span className="badge badge-red">审计不达标</span>}
                            {s.certifications.length === 0 && <span className="badge badge-yellow">认证缺失</span>}
                            {s.capOverdue > 3 && <span className="badge badge-red">整改逾期多</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* All suppliers risk mapping */}
          <div className="card">
            <div className="card-header"><span className="card-title">全部供应商风险评级</span></div>
            <div className="card-body" style={{ padding: 0 }}>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>供应商</th><th>层级</th><th>ESG评级</th><th>风险等级</th>
                      <th>审计分</th><th>处罚</th><th>舆情</th><th>CAP逾期</th><th>综合建议</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map(s => (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 600 }}>{s.name}</td>
                        <td><span className="badge badge-blue">{s.tier}</span></td>
                        <td><span className={`badge ${s.esgRating === 'A' ? 'badge-green' : s.esgRating === 'B' ? 'badge-blue' : s.esgRating === 'C' ? 'badge-yellow' : 'badge-red'}`}>{s.esgRating}</span></td>
                        <td>
                          <span className={`badge ${getRiskBadgeClass(s.riskLevel)}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            {s.riskLevel === 'high' ? '🔴' : s.riskLevel === 'medium' ? '🟡' : '🟢'} {getRiskLabel(s.riskLevel)}
                          </span>
                        </td>
                        <td>{s.auditScore}</td>
                        <td>{s.penalties > 0 ? <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{s.penalties}次</span> : '无'}</td>
                        <td><span className={`badge ${getRiskBadgeClass(s.mediaRisk)}`}>{s.mediaRisk === 'none' ? '无' : s.mediaRisk === 'low' ? '低' : s.mediaRisk === 'medium' ? '中' : '高'}</span></td>
                        <td>{s.capOverdue > 0 ? <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{s.capOverdue}项</span> : '0'}</td>
                        <td>
                          {s.riskLevel === 'high' ? <span className="badge badge-red">立即整改</span> :
                           s.riskLevel === 'medium' ? <span className="badge badge-yellow">加强监控</span> :
                           <span className="badge badge-green">维持管理</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
