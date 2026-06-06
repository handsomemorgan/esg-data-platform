import ReactECharts from 'echarts-for-react';
import { suppliers, monthlyCarbonData, capItems } from '../data';

export default function Dashboard() {
  const totalSuppliers = suppliers.length;
  const highRiskCount = suppliers.filter(s => s.riskLevel === 'high').length;
  const mediumRiskCount = suppliers.filter(s => s.riskLevel === 'medium').length;
  const lowRiskCount = suppliers.filter(s => s.riskLevel === 'low').length;
  const avgAuditScore = Math.round(suppliers.reduce((a, b) => a + b.auditScore, 0) / totalSuppliers);
  const totalCarbon = suppliers.reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0);
  const overdueCaps = capItems.filter(c => c.status === 'overdue').length;
  const capCompletionRate = Math.round(
    (capItems.filter(c => c.status === 'closed' || c.status === 'verified').length / capItems.length) * 100
  );

  const tierBarOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['供应商数量', '平均审计分'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: ['Tier 1 成衣制造', 'Tier 2 面料染整', 'Tier 3 原材料/物流'] },
    yAxis: [
      { type: 'value', name: '数量' },
      { type: 'value', name: '分数', max: 100 },
    ],
    series: [
      {
        name: '供应商数量', type: 'bar',
        data: [
          suppliers.filter(s => s.tier === 'Tier 1').length,
          suppliers.filter(s => s.tier === 'Tier 2').length,
          suppliers.filter(s => s.tier === 'Tier 3').length,
        ],
        itemStyle: { color: '#1a6b47' }, barWidth: '40%',
      },
      {
        name: '平均审计分', type: 'bar', yAxisIndex: 1,
        data: [
          Math.round(suppliers.filter(s => s.tier === 'Tier 1').reduce((a, b) => a + b.auditScore, 0) / suppliers.filter(s => s.tier === 'Tier 1').length),
          Math.round(suppliers.filter(s => s.tier === 'Tier 2').reduce((a, b) => a + b.auditScore, 0) / suppliers.filter(s => s.tier === 'Tier 2').length),
          Math.round(suppliers.filter(s => s.tier === 'Tier 3').reduce((a, b) => a + b.auditScore, 0) / suppliers.filter(s => s.tier === 'Tier 3').length),
        ],
        itemStyle: { color: '#3b82f6' }, barWidth: '40%',
      },
    ],
  };

  const carbonTrendOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Scope 1', 'Scope 2', 'Scope 3'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: monthlyCarbonData.map(d => d.month.slice(2)) },
    yAxis: { type: 'value', name: 'tCO₂e' },
    series: [
      {
        name: 'Scope 1', type: 'line', smooth: true,
        data: monthlyCarbonData.map(d => d.scope1),
        itemStyle: { color: '#1a6b47' }, areaStyle: { color: 'rgba(26,107,71,0.1)' },
      },
      {
        name: 'Scope 2', type: 'line', smooth: true,
        data: monthlyCarbonData.map(d => d.scope2),
        itemStyle: { color: '#3b82f6' }, areaStyle: { color: 'rgba(59,130,246,0.1)' },
      },
      {
        name: 'Scope 3', type: 'line', smooth: true,
        data: monthlyCarbonData.map(d => d.scope3),
        itemStyle: { color: '#f59e0b' }, areaStyle: { color: 'rgba(245,158,11,0.1)' },
      },
    ],
  };

  const riskPieOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: '5%', top: 'center' },
    series: [{
      type: 'pie', radius: ['50%', '75%'], center: ['40%', '50%'],
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
      data: [
        { value: highRiskCount, name: '高风险', itemStyle: { color: '#ef4444' } },
        { value: mediumRiskCount, name: '中风险', itemStyle: { color: '#f59e0b' } },
        { value: lowRiskCount, name: '低风险', itemStyle: { color: '#10b981' } },
      ],
    }],
  };

  const capStatusOption = {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: ['已完成', '进行中', '待处理', '逾期'] },
    yAxis: { type: 'value', name: '数量' },
    series: [{
      type: 'bar', data: [
        { value: capItems.filter(c => c.status === 'closed' || c.status === 'verified').length, itemStyle: { color: '#10b981' } },
        { value: capItems.filter(c => c.status === 'in_progress').length, itemStyle: { color: '#3b82f6' } },
        { value: capItems.filter(c => c.status === 'pending').length, itemStyle: { color: '#f59e0b' } },
        { value: capItems.filter(c => c.status === 'overdue').length, itemStyle: { color: '#ef4444' } },
      ],
      barWidth: '50%',
    }],
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">供应链ESG数据监测平台</h1>
        <p className="page-desc">实时采集 · 动态分析 · 风险预警 · 自动披露</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">供应商总数</div>
            <div className="stat-card-value">{totalSuppliers}</div>
            <div className="stat-card-change up">覆盖3个Tier层级</div>
          </div>
          <div className="stat-card-icon green">🏭</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">碳排放总量 (年度)</div>
            <div className="stat-card-value">{(totalCarbon / 1000).toFixed(0)}k</div>
            <div className="stat-card-change down">↓ 5.2% vs 去年</div>
          </div>
          <div className="stat-card-icon blue">💨</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">平均审计得分</div>
            <div className="stat-card-value">{avgAuditScore}</div>
            <div className="stat-card-change up">↑ 3.5 vs 上季度</div>
          </div>
          <div className="stat-card-icon purple">📋</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">CAP整改完成率</div>
            <div className="stat-card-value">{capCompletionRate}%</div>
            <div className="stat-card-change down">逾期 {overdueCaps} 项</div>
          </div>
          <div className="stat-card-icon orange">⚠️</div>
        </div>
      </div>

      {/* Platform Architecture */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">平台总体架构 —— "供应链层—数据链层—监测平台层—披露输出层"</span>
        </div>
        <div className="card-body">
          <div className="tier-flow">
            <div className="tier-col">
              <div className="tier-col-title">🔗 供应链层</div>
              <div className="tier-col-sub">Tier 1-3 全覆盖</div>
              <div className="tier-col-count">{totalSuppliers}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                成衣制造 · 面料染整 · 原材料 · 物流仓储
              </div>
            </div>
            <div className="tier-arrow">→</div>
            <div className="tier-col tier-2">
              <div className="tier-col-title">📡 数据链层</div>
              <div className="tier-col-sub">统一数据口径</div>
              <div className="tier-col-count">6</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                碳排放 · 能源 · 水耗 · 化学品 · 验厂 · 外部风险
              </div>
            </div>
            <div className="tier-arrow">→</div>
            <div className="tier-col tier-3">
              <div className="tier-col-title">📊 监测平台层</div>
              <div className="tier-col-sub">实时监测与预警</div>
              <div className="tier-col-count">4</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                碳仪表盘 · 环境看板 · 风险热力图 · 整改追踪
              </div>
            </div>
            <div className="tier-arrow">→</div>
            <div className="tier-col" style={{ borderTopColor: '#7c3aed' }}>
              <div className="tier-col-title">📄 披露输出层</div>
              <div className="tier-col-sub">自动汇总披露</div>
              <div className="tier-col-count" style={{ color: '#7c3aed' }}>12</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                ESG报告 · 投资者沟通 · 消费者标签 · 采购决策
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header"><span className="card-title">各层级供应商与审计得分</span></div>
          <div className="card-body">
            <div className="chart-container">
              <ReactECharts option={tierBarOption} style={{ height: '100%' }} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">风险分布</span></div>
          <div className="card-body">
            <div className="chart-container">
              <ReactECharts option={riskPieOption} style={{ height: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><span className="card-title">供应链碳排放趋势（近12个月）</span></div>
          <div className="card-body">
            <div className="chart-container">
              <ReactECharts option={carbonTrendOption} style={{ height: '100%' }} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">CAP整改状态分布</span></div>
          <div className="card-body">
            <div className="chart-container">
              <ReactECharts option={capStatusOption} style={{ height: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
