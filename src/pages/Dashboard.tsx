import ReactECharts from 'echarts-for-react';
import { suppliers, monthlyCarbonData, capItems } from '../data';
import { useLang } from '../context/LanguageContext';
import { t } from '../i18n';

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

  const axisStyle = { axisLabel: { color: '#7b8ca3' }, axisLine: { lineStyle: { color: '#1a2555' } } };
  const splitLine = { splitLine: { lineStyle: { color: '#1a2555' } } };

  const tierBarOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: [t(lang, 'dashboard.barSuppliers'), t(lang, 'dashboard.barAudit')], bottom: 0, textStyle: { color: '#7b8ca3' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: ['Tier 1', 'Tier 2', 'Tier 3'], ...axisStyle },
    yAxis: [
      { type: 'value', name: t(lang, 'dashboard.barSuppliers'), nameTextStyle: { color: '#7b8ca3' }, ...axisStyle, ...splitLine },
      { type: 'value', name: t(lang, 'dashboard.barAudit'), max: 100, nameTextStyle: { color: '#7b8ca3' }, ...axisStyle, ...splitLine },
    ],
    series: [
      { name: t(lang, 'dashboard.barSuppliers'), type: 'bar', data: [suppliers.filter(s => s.tier === 'Tier 1').length, suppliers.filter(s => s.tier === 'Tier 2').length, suppliers.filter(s => s.tier === 'Tier 3').length], itemStyle: { color: '#0077b6', borderRadius: [4, 4, 0, 0] }, barWidth: '40%' },
      { name: t(lang, 'dashboard.barAudit'), type: 'bar', yAxisIndex: 1, data: [Math.round(suppliers.filter(s => s.tier === 'Tier 1').reduce((a, b) => a + b.auditScore, 0) / suppliers.filter(s => s.tier === 'Tier 1').length), Math.round(suppliers.filter(s => s.tier === 'Tier 2').reduce((a, b) => a + b.auditScore, 0) / suppliers.filter(s => s.tier === 'Tier 2').length), Math.round(suppliers.filter(s => s.tier === 'Tier 3').reduce((a, b) => a + b.auditScore, 0) / suppliers.filter(s => s.tier === 'Tier 3').length)], itemStyle: { color: '#48cae4', borderRadius: [4, 4, 0, 0] }, barWidth: '40%' },
    ],
  };

  const carbonTrendOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Scope 1', 'Scope 2', 'Scope 3'], bottom: 0, textStyle: { color: '#7b8ca3' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: monthlyCarbonData.map(d => d.month.slice(2)), ...axisStyle },
    yAxis: { type: 'value', name: 'tCO₂e', nameTextStyle: { color: '#7b8ca3' }, ...axisStyle, ...splitLine },
    series: [
      { name: 'Scope 1', type: 'line', smooth: true, data: monthlyCarbonData.map(d => d.scope1), itemStyle: { color: '#0077b6' }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(0,119,182,0.3)' }, { offset: 1, color: 'rgba(0,119,182,0.02)' }] } }, lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 5 },
      { name: 'Scope 2', type: 'line', smooth: true, data: monthlyCarbonData.map(d => d.scope2), itemStyle: { color: '#48cae4' }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(72,202,228,0.3)' }, { offset: 1, color: 'rgba(72,202,228,0.02)' }] } }, lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 5 },
      { name: 'Scope 3', type: 'line', smooth: true, data: monthlyCarbonData.map(d => d.scope3), itemStyle: { color: '#90e0ef' }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(144,224,239,0.25)' }, { offset: 1, color: 'rgba(144,224,239,0.02)' }] } }, lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 5 },
    ],
  };

  const riskPieOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: '5%', top: 'center', textStyle: { color: '#7b8ca3' } },
    series: [{ type: 'pie', radius: ['50%', '75%'], center: ['40%', '50%'], label: { show: false }, emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } }, itemStyle: { borderColor: '#0d1330', borderWidth: 3 }, data: [{ value: highRiskCount, name: t(lang, 'dashboard.riskHigh'), itemStyle: { color: '#e63946' } }, { value: mediumRiskCount, name: t(lang, 'dashboard.riskMedium'), itemStyle: { color: '#0096c7' } }, { value: lowRiskCount, name: t(lang, 'dashboard.riskLow'), itemStyle: { color: '#0077b6' } }] }],
  };

  const capStatusOption = {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: '#7b8ca3' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: [t(lang, 'dashboard.capDone'), t(lang, 'dashboard.capInProgress'), t(lang, 'dashboard.capPending'), t(lang, 'dashboard.capOverdue')], ...axisStyle },
    yAxis: { type: 'value', name: '', ...axisStyle, ...splitLine },
    series: [{ type: 'bar', data: [{ value: capItems.filter(c => c.status === 'closed' || c.status === 'verified').length, itemStyle: { color: '#0077b6', borderRadius: [4, 4, 0, 0] } }, { value: capItems.filter(c => c.status === 'in_progress').length, itemStyle: { color: '#48cae4', borderRadius: [4, 4, 0, 0] } }, { value: capItems.filter(c => c.status === 'pending').length, itemStyle: { color: '#0096c7', borderRadius: [4, 4, 0, 0] } }, { value: capItems.filter(c => c.status === 'overdue').length, itemStyle: { color: '#e63946', borderRadius: [4, 4, 0, 0] } }], barWidth: '50%' }],
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t(lang, 'dashboard.title')}</h1>
        <p className="page-desc">{t(lang, 'dashboard.desc')}</p>
      </div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'dashboard.totalSuppliers')}</div><div className="stat-card-value">{totalSuppliers}</div><div className="stat-card-change up">{t(lang, 'dashboard.totalSuppliersDesc')}</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'dashboard.totalCarbon')}</div><div className="stat-card-value">{(totalCarbon / 1000).toFixed(0)}k</div><div className="stat-card-change up">{t(lang, 'dashboard.totalCarbonDesc')}</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'dashboard.avgAudit')}</div><div className="stat-card-value">{avgAuditScore}</div><div className="stat-card-change up">{t(lang, 'dashboard.avgAuditDesc')}</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'dashboard.capRate')}</div><div className="stat-card-value">{capCompletionRate}%</div><div className="stat-card-change down">{t(lang, 'dashboard.capRateDesc')} {overdueCaps} {t(lang, 'dashboard.capRateDescSuffix')}</div></div></div>
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">{t(lang, 'dashboard.archTitle')}</span></div>
        <div className="card-body">
          <div className="tier-flow">
            <div className="tier-col"><div className="tier-col-title">{t(lang, 'dashboard.archSupplyChain')}</div><div className="tier-col-sub">{t(lang, 'dashboard.archSupplyChainDesc')}</div><div className="tier-col-count">{totalSuppliers}</div><div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>{t(lang, 'dashboard.archSupplyChainDetail')}</div></div>
            <div className="tier-arrow">→</div>
            <div className="tier-col tier-2"><div className="tier-col-title">{t(lang, 'dashboard.archDataChain')}</div><div className="tier-col-sub">{t(lang, 'dashboard.archDataChainDesc')}</div><div className="tier-col-count">6</div><div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>{t(lang, 'dashboard.archDataChainDetail')}</div></div>
            <div className="tier-arrow">→</div>
            <div className="tier-col tier-3"><div className="tier-col-title">{t(lang, 'dashboard.archMonitor')}</div><div className="tier-col-sub">{t(lang, 'dashboard.archMonitorDesc')}</div><div className="tier-col-count">4</div><div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>{t(lang, 'dashboard.archMonitorDetail')}</div></div>
            <div className="tier-arrow">→</div>
            <div className="tier-col" style={{ borderTopColor: '#90e0ef' }}><div className="tier-col-title">{t(lang, 'dashboard.archDisclosure')}</div><div className="tier-col-sub">{t(lang, 'dashboard.archDisclosureDesc')}</div><div className="tier-col-count" style={{ color: '#90e0ef' }}>12</div><div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>{t(lang, 'dashboard.archDisclosureDetail')}</div></div>
          </div>
        </div>
      </div>
      <div className="grid-2">
        <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'dashboard.chartTier')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={tierBarOption} style={{ height: '100%' }} /></div></div></div>
        <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'dashboard.chartRisk')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={riskPieOption} style={{ height: '100%' }} /></div></div></div>
      </div>
      <div className="grid-2">
        <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'dashboard.chartCarbon')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={carbonTrendOption} style={{ height: '100%' }} /></div></div></div>
        <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'dashboard.chartCap')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={capStatusOption} style={{ height: '100%' }} /></div></div></div>
      </div>
    </div>
  );
}
