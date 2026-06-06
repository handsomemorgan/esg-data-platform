import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { disclosureData, suppliers } from '../data';

export default function DisclosureOutput() {
  const [reportType, setReportType] = useState<'annual' | 'investor' | 'consumer'>('annual');

  const verifiedCount = disclosureData.filter(d => d.verified).length;
  const totalIndicators = disclosureData.length;
  const verificationRate = Math.round((verifiedCount / totalIndicators) * 100);

  // Coverage bar chart
  const coverageOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '8%', bottom: '5%', top: '5%', containLabel: true },
    xAxis: { type: 'value', name: '覆盖率 (%)', max: 100 },
    yAxis: {
      type: 'category',
      data: disclosureData.map(d => d.indicator.length > 15 ? d.indicator.slice(0, 15) + '...' : d.indicator).reverse(),
      axisLabel: { fontSize: 11 },
    },
    series: [{
      type: 'bar',
      data: disclosureData.map(d => ({
        value: parseInt(d.coverage),
        itemStyle: {
          color: parseInt(d.coverage) >= 95 ? '#10b981' : parseInt(d.coverage) >= 80 ? '#f59e0b' : '#ef4444',
          borderRadius: [0, 6, 6, 0],
        },
      })),
      barWidth: '60%',
      label: { show: true, position: 'right', fontSize: 11, formatter: '{c}%' },
    }],
  };

  // Verification status pie
  const verificationPieOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}项 ({d}%)' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie', radius: ['55%', '78%'], center: ['50%', '45%'],
      data: [
        { value: verifiedCount, name: '已验证', itemStyle: { color: '#10b981' } },
        { value: totalIndicators - verifiedCount, name: '待验证', itemStyle: { color: '#f59e0b' } },
      ],
      label: { formatter: '{b}\n{c}项', fontSize: 14 },
    }],
  };

  // ESG compliance radar
  const complianceRadarOption = {
    tooltip: {},
    radar: {
      indicator: [
        { name: '环境指标\n覆盖', max: 100 },
        { name: '社会指标\n覆盖', max: 100 },
        { name: '治理指标\n覆盖', max: 100 },
        { name: '数据验证\n率', max: 100 },
        { name: '供应链\n透明度', max: 100 },
      ],
      center: ['50%', '55%'],
      radius: '68%',
    },
    series: [{
      type: 'radar',
      data: [{
        value: [82, 68, 75, verificationRate, 78],
        name: 'ABC Fashion',
        areaStyle: { color: 'rgba(26,107,71,0.2)' },
        lineStyle: { color: '#1a6b47', width: 2 },
        itemStyle: { color: '#1a6b47' },
      }],
    }],
  };

  const getReportData = () => {
    switch (reportType) {
      case 'annual': return disclosureData;
      case 'investor': return disclosureData.filter(d => ['碳排放', '排放', '能源', '化学品'].some(k => d.indicator.includes(k)));
      case 'consumer': return disclosureData.filter(d => d.indicator.includes('水') || d.indicator.includes('化学品') || d.indicator.includes('固体') || d.indicator.includes('可再生'));
      default: return disclosureData;
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">披露输出模块</h1>
        <p className="page-desc">自动汇总年度ESG报告所需指标，将内部管理数据转化为外部披露依据，支持投资者沟通、消费者标签和采购决策</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">ESG披露指标总数</div>
            <div className="stat-card-value">{totalIndicators}</div>
          </div>
          <div className="stat-card-icon green">📋</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">已验证指标</div>
            <div className="stat-card-value" style={{ color: 'var(--success)' }}>{verifiedCount}</div>
          </div>
          <div className="stat-card-icon blue">✅</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">数据验证率</div>
            <div className="stat-card-value">{verificationRate}%</div>
          </div>
          <div className="stat-card-icon purple">📊</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <div className="stat-card-label">报告生成状态</div>
            <div className="stat-card-value" style={{ fontSize: '18px', color: 'var(--success)' }}>就绪</div>
          </div>
          <div className="stat-card-icon green">📄</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-3">
        <div className="card">
          <div className="card-header"><span className="card-title">指标覆盖率</span></div>
          <div className="card-body">
            <div className="chart-container">
              <ReactECharts option={coverageOption} style={{ height: '100%' }} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">数据验证状态</span></div>
          <div className="card-body">
            <div className="chart-container">
              <ReactECharts option={verificationPieOption} style={{ height: '100%' }} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">ESG合规雷达</span></div>
          <div className="card-body">
            <div className="chart-container">
              <ReactECharts option={complianceRadarOption} style={{ height: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="tabs">
        <div className={`tab ${reportType === 'annual' ? 'active' : ''}`} onClick={() => setReportType('annual')}>📊 年度ESG报告</div>
        <div className={`tab ${reportType === 'investor' ? 'active' : ''}`} onClick={() => setReportType('investor')}>💰 投资者沟通</div>
        <div className={`tab ${reportType === 'consumer' ? 'active' : ''}`} onClick={() => setReportType('consumer')}>🏷️ 消费者标签</div>
      </div>

      {/* Report data table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            {reportType === 'annual' ? '📊 年度ESG报告指标' : reportType === 'investor' ? '💰 投资者沟通数据' : '🏷️ 消费者标签数据'}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-outline btn-sm">📥 导出Excel</button>
            <button className="btn btn-primary btn-sm">📄 生成报告</button>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>指标名称</th><th>数值</th><th>单位</th><th>参考标准</th>
                  <th>数据覆盖率</th><th>验证状态</th>
                </tr>
              </thead>
              <tbody>
                {getReportData().map((d, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{d.indicator}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{d.value}</td>
                    <td>{d.unit}</td>
                    <td><span className="badge badge-gray">{d.standard}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="progress-bar" style={{ width: '50px' }}>
                          <div
                            className={`progress-bar-fill ${parseInt(d.coverage) >= 95 ? 'green' : parseInt(d.coverage) >= 80 ? 'yellow' : 'red'}`}
                            style={{ width: `${d.coverage}%` }}
                          />
                        </div>
                        <span style={{ fontSize: '12px' }}>{d.coverage}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${d.verified ? 'badge-green' : 'badge-yellow'}`}>
                        {d.verified ? '✅ 已验证' : '⚠️ 待验证'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">披露输出摘要</span>
          <button className="btn btn-primary">📄 生成完整ESG数据包</button>
        </div>
        <div className="card-body">
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">报告周期</div>
              <div className="detail-value">2026年度 (2025.07 - 2026.06)</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">参考框架</div>
              <div className="detail-value">GRI Standards · GHG Protocol · SASB</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">供应链覆盖率</div>
              <div className="detail-value">Tier 1-3 共 {suppliers.length} 家供应商</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">主要排放源</div>
              <div className="detail-value">Tier 2 面料染整 ({(suppliers.filter(s => s.tier === 'Tier 2').reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0) / suppliers.reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0) * 100).toFixed(0)}%)</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">减排目标</div>
              <div className="detail-value">2030年碳减排 30% (vs 2025 baseline)</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">下次披露日期</div>
              <div className="detail-value">2027年3月 (年度ESG报告)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
