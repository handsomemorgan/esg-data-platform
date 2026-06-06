import ReactECharts from 'echarts-for-react';
import { suppliers, monthlyCarbonData, capItems } from '../data';
import { useLang } from '../context/LanguageContext';
import { t } from '../i18n';

const C1 = '#2563eb'; const C2 = '#3b82f6'; const C3 = '#60a5fa';
const CR = '#ef4444'; const AX = '#e2e8f0'; const TX = '#64748b';

export default function Dashboard() {
  const { lang } = useLang();
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

  const as = { axisLabel: { color: TX }, axisLine: { lineStyle: { color: AX } } };
  const sl = { splitLine: { lineStyle: { color: AX } } };

  const tierBarOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: [t(lang, 'dashboard.barSuppliers'), t(lang, 'dashboard.barAudit')], bottom: 0, textStyle: { color: TX } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: ['Tier 1', 'Tier 2', 'Tier 3'], ...as },
    yAxis: [
      { type: 'value', name: t(lang, 'dashboard.barSuppliers'), nameTextStyle: { color: TX }, ...as, ...sl },
      { type: 'value', name: t(lang, 'dashboard.barAudit'), max: 100, nameTextStyle: { color: TX }, ...as, ...sl },
    ],
    series: [
      { name: t(lang, 'dashboard.barSuppliers'), type: 'bar', data: [suppliers.filter(s => s.tier === 'Tier 1').length, suppliers.filter(s => s.tier === 'Tier 2').length, suppliers.filter(s => s.tier === 'Tier 3').length], itemStyle: { color: C1, borderRadius: [4, 4, 0, 0] }, barWidth: '40%' },
      { name: t(lang, 'dashboard.barAudit'), type: 'bar', yAxisIndex: 1, data: [Math.round(suppliers.filter(s => s.tier === 'Tier 1').reduce((a, b) => a + b.auditScore, 0) / suppliers.filter(s => s.tier === 'Tier 1').length), Math.round(suppliers.filter(s => s.tier === 'Tier 2').reduce((a, b) => a + b.auditScore, 0) / suppliers.filter(s => s.tier === 'Tier 2').length), Math.round(suppliers.filter(s => s.tier === 'Tier 3').reduce((a, b) => a + b.auditScore, 0) / suppliers.filter(s => s.tier === 'Tier 3').length)], itemStyle: { color: C2, borderRadius: [4, 4, 0, 0] }, barWidth: '40%' },
    ],
  };

  const carbonTrendOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Scope 1', 'Scope 2', 'Scope 3'], bottom: 0, textStyle: { color: TX } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: monthlyCarbonData.map(d => d.month.slice(2)), ...as },
    yAxis: { type: 'value', name: 'tCO₂e', nameTextStyle: { color: TX }, ...as, ...sl },
    series: [
      { name: 'Scope 1', type: 'line', smooth: true, data: monthlyCarbonData.map(d => d.scope1), itemStyle: { color: C1 }, lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 5, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(37,99,235,0.15)' }, { offset: 1, color: 'rgba(37,99,235,0.01)' }] } } },
      { name: 'Scope 2', type: 'line', smooth: true, data: monthlyCarbonData.map(d => d.scope2), itemStyle: { color: C2 }, lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 5, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(59,130,246,0.15)' }, { offset: 1, color: 'rgba(59,130,246,0.01)' }] } } },
      { name: 'Scope 3', type: 'line', smooth: true, data: monthlyCarbonData.map(d => d.scope3), itemStyle: { color: C3 }, lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 5, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(96,165,250,0.12)' }, { offset: 1, color: 'rgba(96,165,250,0.01)' }] } } },
    ],
  };

  const riskPieOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: '5%', top: 'center', textStyle: { color: TX } },
    series: [{ type: 'pie', radius: ['50%', '75%'], center: ['40%', '50%'], label: { show: false }, emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } }, itemStyle: { borderColor: '#fff', borderWidth: 3 }, data: [{ value: highRiskCount, name: t(lang, 'dashboard.riskHigh'), itemStyle: { color: CR } }, { value: mediumRiskCount, name: t(lang, 'dashboard.riskMedium'), itemStyle: { color: C2 } }, { value: lowRiskCount, name: t(lang, 'dashboard.riskLow'), itemStyle: { color: C1 } }] }],
  };

  const capStatusOption = {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: TX } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: [t(lang, 'dashboard.capDone'), t(lang, 'dashboard.capInProgress'), t(lang, 'dashboard.capPending'), t(lang, 'dashboard.capOverdue')], ...as },
    yAxis: { type: 'value', name: '', ...as, ...sl },
    series: [{ type: 'bar', data: [{ value: capItems.filter(c => c.status === 'closed' || c.status === 'verified').length, itemStyle: { color: C1, borderRadius: [4, 4, 0, 0] } }, { value: capItems.filter(c => c.status === 'in_progress').length, itemStyle: { color: C2, borderRadius: [4, 4, 0, 0] } }, { value: capItems.filter(c => c.status === 'pending').length, itemStyle: { color: C3, borderRadius: [4, 4, 0, 0] } }, { value: capItems.filter(c => c.status === 'overdue').length, itemStyle: { color: CR, borderRadius: [4, 4, 0, 0] } }], barWidth: '50%' }],
  };

  return (
    <div>
      <div className="page-header"><h1 className="page-title">{t(lang, 'dashboard.title')}</h1><p className="page-desc">{t(lang, 'dashboard.desc')}</p></div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'dashboard.totalSuppliers')}</div><div className="stat-card-value">{totalSuppliers}</div><div className="stat-card-change up">{t(lang, 'dashboard.totalSuppliersDesc')}</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'dashboard.totalCarbon')}</div><div className="stat-card-value">{(totalCarbon / 1000).toFixed(0)}k</div><div className="stat-card-change up">{t(lang, 'dashboard.totalCarbonDesc')}</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'dashboard.avgAudit')}</div><div className="stat-card-value">{avgAuditScore}</div><div className="stat-card-change up">{t(lang, 'dashboard.avgAuditDesc')}</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'dashboard.capRate')}</div><div className="stat-card-value">{capCompletionRate}%</div><div className="stat-card-change down">{t(lang, 'dashboard.capRateDesc')} {overdueCaps} {t(lang, 'dashboard.capRateDescSuffix')}</div></div></div>
      </div>
      <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'dashboard.archTitle')}</span></div><div className="card-body"><div className="tier-flow"><div className="tier-col"><div className="tier-col-title">{t(lang, 'dashboard.archSupplyChain')}</div><div className="tier-col-sub">{t(lang, 'dashboard.archSupplyChainDesc')}</div><div className="tier-col-count">{totalSuppliers}</div><div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>{t(lang, 'dashboard.archSupplyChainDetail')}</div></div><div className="tier-arrow">→</div><div className="tier-col tier-2"><div className="tier-col-title">{t(lang, 'dashboard.archDataChain')}</div><div className="tier-col-sub">{t(lang, 'dashboard.archDataChainDesc')}</div><div className="tier-col-count">6</div><div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>{t(lang, 'dashboard.archDataChainDetail')}</div></div><div className="tier-arrow">→</div><div className="tier-col tier-3"><div className="tier-col-title">{t(lang, 'dashboard.archMonitor')}</div><div className="tier-col-sub">{t(lang, 'dashboard.archMonitorDesc')}</div><div className="tier-col-count">4</div><div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>{t(lang, 'dashboard.archMonitorDetail')}</div></div><div className="tier-arrow">→</div><div className="tier-col" style={{ borderTopColor: '#93c5fd' }}><div className="tier-col-title">{t(lang, 'dashboard.archDisclosure')}</div><div className="tier-col-sub">{t(lang, 'dashboard.archDisclosureDesc')}</div><div className="tier-col-count" style={{ color: '#60a5fa' }}>12</div><div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>{t(lang, 'dashboard.archDisclosureDetail')}</div></div></div></div></div>
      <div className="grid-2"><div className="card"><div className="card-header"><span className="card-title">{t(lang, 'dashboard.chartTier')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={tierBarOption} style={{ height: '100%' }} /></div></div></div><div className="card"><div className="card-header"><span className="card-title">{t(lang, 'dashboard.chartRisk')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={riskPieOption} style={{ height: '100%' }} /></div></div></div></div>
      <div className="grid-2"><div className="card"><div className="card-header"><span className="card-title">{t(lang, 'dashboard.chartCarbon')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={carbonTrendOption} style={{ height: '100%' }} /></div></div></div><div className="card"><div className="card-header"><span className="card-title">{t(lang, 'dashboard.chartCap')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={capStatusOption} style={{ height: '100%' }} /></div></div></div></div>
    </div>
  );
}
