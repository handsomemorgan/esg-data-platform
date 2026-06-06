import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { suppliers } from '../data';

export default function SupplyChain() {
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const filtered = selectedTier === 'all' ? suppliers : suppliers.filter(s => s.tier === selectedTier);
  const tier1 = suppliers.filter(s => s.tier === 'Tier 1');
  const tier2 = suppliers.filter(s => s.tier === 'Tier 2');
  const tier3 = suppliers.filter(s => s.tier === 'Tier 3');

  const axisStyle = { axisLabel: { color: '#7b8ca3' }, axisLine: { lineStyle: { color: '#1a2555' } } };
  const splitLine = { splitLine: { lineStyle: { color: '#1a2555' } } };

  const sankeyOption = {
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    series: [{
      type: 'sankey', layout: 'none', emphasis: { focus: 'adjacency' },
      nodeAlign: 'left', layoutIterations: 0,
      data: [
        { name: 'Tier 3\n原材料', itemStyle: { color: '#0077b6' } },
        { name: 'Tier 3\n物流仓储', itemStyle: { color: '#0096c7' } },
        { name: 'Tier 2\n面料染整', itemStyle: { color: '#00b4d8' } },
        { name: 'Tier 1\n成衣制造', itemStyle: { color: '#48cae4' } },
        { name: 'ABC Fashion', itemStyle: { color: '#90e0ef' } },
      ],
      links: [
        { source: 'Tier 3\n原材料', target: 'Tier 2\n面料染整', value: 3 },
        { source: 'Tier 3\n物流仓储', target: 'Tier 1\n成衣制造', value: 1 },
        { source: 'Tier 3\n物流仓储', target: 'Tier 2\n面料染整', value: 1 },
        { source: 'Tier 2\n面料染整', target: 'Tier 1\n成衣制造', value: 3 },
        { source: 'Tier 1\n成衣制造', target: 'ABC Fashion', value: 4 },
      ],
      lineStyle: { color: 'gradient', curveness: 0.5 },
      label: { fontSize: 12, color: '#bcc8d6' },
    }],
  };

  const tierPieOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}家 ({d}%)' },
    series: [{
      type: 'pie', radius: ['55%', '80%'], center: ['50%', '50%'],
      label: { formatter: '{b}\n{c}家', fontSize: 13, color: '#bcc8d6' },
      emphasis: { label: { fontSize: 18, fontWeight: 'bold' } },
      itemStyle: { borderColor: '#0d1330', borderWidth: 3 },
      data: [
        { value: tier1.length, name: 'Tier 1 成衣制造', itemStyle: { color: '#0077b6' } },
        { value: tier2.length, name: 'Tier 2 面料染整', itemStyle: { color: '#00b4d8' } },
        { value: tier3.length, name: 'Tier 3 原材料/物流', itemStyle: { color: '#48cae4' } },
      ],
    }],
  };

  const barOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['碳排放(tCO₂e)', '水耗(百m³)'], bottom: 0, textStyle: { color: '#7b8ca3' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: ['Tier 1', 'Tier 2', 'Tier 3'], ...axisStyle },
    yAxis: [
      { type: 'value', name: 'tCO₂e', nameTextStyle: { color: '#7b8ca3' }, ...axisStyle, ...splitLine },
      { type: 'value', name: '百m³', nameTextStyle: { color: '#7b8ca3' }, ...axisStyle, ...splitLine },
    ],
    series: [
      {
        name: '碳排放(tCO₂e)', type: 'bar',
        data: [
          tier1.reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0),
          tier2.reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0),
          tier3.reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0),
        ],
        itemStyle: { color: '#0077b6', borderRadius: [4, 4, 0, 0] }, barWidth: '35%',
      },
      {
        name: '水耗(百m³)', type: 'bar', yAxisIndex: 1,
        data: [
          Math.round(tier1.reduce((a, b) => a + b.waterUse, 0) / 100),
          Math.round(tier2.reduce((a, b) => a + b.waterUse, 0) / 100),
          Math.round(tier3.reduce((a, b) => a + b.waterUse, 0) / 100),
        ],
        itemStyle: { color: '#48cae4', borderRadius: [4, 4, 0, 0] }, barWidth: '35%',
      },
    ],
  };

  const getRiskBadgeClass = (level: string) => {
    switch (level) { case 'low': return 'badge-green'; case 'medium': return 'badge-yellow'; case 'high': return 'badge-red'; default: return 'badge-gray'; }
  };
  const getRiskLabel = (level: string) => {
    switch (level) { case 'low': return '低风险'; case 'medium': return '中风险'; case 'high': return '高风险'; default: return '未知'; }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">供应链地图</h1>
        <p className="page-desc">覆盖Tier 1成衣制造、Tier 2面料染整、Tier 3原材料及物流仓储环节，明确重点监测对象，识别高排放、高耗水、高风险环节</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">Tier 1 成衣制造</div>
            <div className="stat-card-value">{tier1.length}</div>
            <div className="stat-card-change down">高风险 {tier1.filter(s => s.riskLevel === 'high').length} 家</div>
          </div>
          <div className="stat-card-icon">🏗️</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">Tier 2 面料染整</div>
            <div className="stat-card-value">{tier2.length}</div>
            <div className="stat-card-change down">高风险 {tier2.filter(s => s.riskLevel === 'high').length} 家</div>
          </div>
          <div className="stat-card-icon">🎨</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">Tier 3 原材料/物流</div>
            <div className="stat-card-value">{tier3.length}</div>
            <div className="stat-card-change">高风险 {tier3.filter(s => s.riskLevel === 'high').length} 家</div>
          </div>
          <div className="stat-card-icon">🚛</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">供应链总碳排放</div>
            <div className="stat-card-value">{(suppliers.reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0) / 1000).toFixed(0)}k</div>
            <div className="stat-card-change">tCO₂e/年</div>
          </div>
          <div className="stat-card-icon">💨</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><span className="card-title">供应链流向图（桑基图）</span></div>
          <div className="card-body">
            <div className="chart-container" style={{ height: '380px' }}>
              <ReactECharts option={sankeyOption} style={{ height: '100%' }} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">各层级供应商分布</span></div>
          <div className="card-body">
            <div className="chart-container" style={{ height: '380px' }}>
              <ReactECharts option={tierPieOption} style={{ height: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">各层级碳排放与水耗对比</span></div>
        <div className="card-body">
          <div className="chart-container">
            <ReactECharts option={barOption} style={{ height: '100%' }} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">供应商清单</span>
          <div className="filter-bar" style={{ marginBottom: 0 }}>
            <select value={selectedTier} onChange={e => setSelectedTier(e.target.value)}>
              <option value="all">全部层级</option>
              <option value="Tier 1">Tier 1</option>
              <option value="Tier 2">Tier 2</option>
              <option value="Tier 3">Tier 3</option>
            </select>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>编号</th><th>供应商名称</th><th>层级</th><th>类别</th><th>所在地</th><th>ESG评级</th><th>风险等级</th><th>碳排放(tCO₂e)</th><th>水耗(m³)</th><th>审计得分</th><th>认证数</th></tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{s.id}</td>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td><span className="badge badge-blue">{s.tier}</span></td>
                    <td>{s.category}</td>
                    <td>{s.location}</td>
                    <td><span className={`badge ${s.esgRating === 'A' ? 'badge-green' : s.esgRating === 'B' ? 'badge-blue' : s.esgRating === 'C' ? 'badge-yellow' : 'badge-red'}`}>{s.esgRating}</span></td>
                    <td><span className={`badge ${getRiskBadgeClass(s.riskLevel)}`}>{getRiskLabel(s.riskLevel)}</span></td>
                    <td>{(s.carbonScope1 + s.carbonScope2 + s.carbonScope3).toLocaleString()}</td>
                    <td>{s.waterUse.toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="progress-bar" style={{ width: '60px' }}>
                          <div className={`progress-bar-fill ${s.auditScore >= 80 ? 'green' : s.auditScore >= 60 ? 'blue' : 'red'}`} style={{ width: `${s.auditScore}%` }} />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{s.auditScore}</span>
                      </div>
                    </td>
                    <td>{s.certifications.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
