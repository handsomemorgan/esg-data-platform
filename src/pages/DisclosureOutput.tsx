import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { disclosureData, suppliers } from '../data';
import { useLang } from '../context/LanguageContext';
import { t } from '../i18n';

export default function DisclosureOutput() {
  const { lang } = useLang();
  const [reportType, setReportType] = useState<'annual' | 'investor' | 'consumer'>('annual');
  const verifiedCount = disclosureData.filter(d => d.verified).length;
  const totalIndicators = disclosureData.length;
  const verificationRate = Math.round((verifiedCount / totalIndicators) * 100);

  const coverageOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '8%', bottom: '5%', top: '5%', containLabel: true },
    xAxis: { type: 'value', name: 'Coverage (%)', max: 100, nameTextStyle: { color: '#7b8ca3' }, axisLabel: { color: '#7b8ca3' }, splitLine: { lineStyle: { color: '#1a2555' } } },
    yAxis: { type: 'category', data: disclosureData.map(d => d.indicator.length > 15 ? d.indicator.slice(0, 15) + '...' : d.indicator).reverse(), axisLabel: { fontSize: 11, color: '#7b8ca3' }, axisLine: { lineStyle: { color: '#1a2555' } } },
    series: [{ type: 'bar', data: disclosureData.map(d => ({ value: parseInt(d.coverage), itemStyle: { color: parseInt(d.coverage) >= 95 ? '#00b4d8' : parseInt(d.coverage) >= 80 ? '#0077b6' : '#e63946', borderRadius: [0, 4, 4, 0] } })), barWidth: '60%', label: { show: true, position: 'right', fontSize: 11, color: '#7b8ca3', formatter: '{c}%' } }],
  };

  const verificationPieOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, textStyle: { color: '#7b8ca3' } },
    series: [{ type: 'pie', radius: ['55%', '78%'], center: ['50%', '45%'], itemStyle: { borderColor: '#0d1330', borderWidth: 3 }, data: [{ value: verifiedCount, name: t(lang, 'disclosure.verifiedBadge'), itemStyle: { color: '#00b4d8' } }, { value: totalIndicators - verifiedCount, name: t(lang, 'disclosure.pendingBadge'), itemStyle: { color: '#0077b6' } }], label: { formatter: '{b}\n{c}', fontSize: 14, color: '#7b8ca3' } }],
  };

  const complianceRadarOption = {
    tooltip: {},
    radar: {
      indicator: [{ name: 'Environment', max: 100 }, { name: 'Social', max: 100 }, { name: 'Governance', max: 100 }, { name: 'Verification', max: 100 }, { name: 'Transparency', max: 100 }],
      center: ['50%', '55%'], radius: '68%', axisName: { color: '#7b8ca3' }, splitArea: { areaStyle: { color: ['rgba(0,180,216,0.02)', 'rgba(0,180,216,0.04)'] } }, splitLine: { lineStyle: { color: '#1a2555' } }, axisLine: { lineStyle: { color: '#1a2555' } },
    },
    series: [{ type: 'radar', data: [{ value: [82, 68, 75, verificationRate, 78], name: 'ABC Fashion', areaStyle: { color: 'rgba(0,180,216,0.2)' }, lineStyle: { color: '#00b4d8', width: 2 }, itemStyle: { color: '#48cae4' } }] }],
  };

  const getReportData = () => {
    switch (reportType) { case 'annual': return disclosureData; case 'investor': return disclosureData.filter(d => ['碳排放', '排放', '能源', '化学品'].some(k => d.indicator.includes(k))); case 'consumer': return disclosureData.filter(d => d.indicator.includes('水') || d.indicator.includes('化学品') || d.indicator.includes('固体') || d.indicator.includes('可再生')); default: return disclosureData; }
  };

  return (
    <div>
      <div className="page-header"><h1 className="page-title">{t(lang, 'disclosure.title')}</h1><p className="page-desc">{t(lang, 'disclosure.desc')}</p></div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'disclosure.total')}</div><div className="stat-card-value">{totalIndicators}</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'disclosure.verified')}</div><div className="stat-card-value" style={{ color: '#48cae4' }}>{verifiedCount}</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'disclosure.rate')}</div><div className="stat-card-value">{verificationRate}%</div></div></div>
        <div className="stat-card"><div className="stat-card-info"><div className="stat-card-label">{t(lang, 'disclosure.status')}</div><div className="stat-card-value" style={{ fontSize: '18px', color: '#48cae4' }}>{t(lang, 'disclosure.ready')}</div></div></div>
      </div>
      <div className="grid-3">
        <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'disclosure.coverage')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={coverageOption} style={{ height: '100%' }} /></div></div></div>
        <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'disclosure.verifyChart')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={verificationPieOption} style={{ height: '100%' }} /></div></div></div>
        <div className="card"><div className="card-header"><span className="card-title">{t(lang, 'disclosure.radar')}</span></div><div className="card-body"><div className="chart-container"><ReactECharts option={complianceRadarOption} style={{ height: '100%' }} /></div></div></div>
      </div>
      <div className="tabs">
        <div className={`tab ${reportType === 'annual' ? 'active' : ''}`} onClick={() => setReportType('annual')}>{t(lang, 'disclosure.tabAnnual')}</div>
        <div className={`tab ${reportType === 'investor' ? 'active' : ''}`} onClick={() => setReportType('investor')}>{t(lang, 'disclosure.tabInvestor')}</div>
        <div className={`tab ${reportType === 'consumer' ? 'active' : ''}`} onClick={() => setReportType('consumer')}>{t(lang, 'disclosure.tabConsumer')}</div>
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">{reportType === 'annual' ? t(lang, 'disclosure.tabAnnual') : reportType === 'investor' ? t(lang, 'disclosure.tabInvestor') : t(lang, 'disclosure.tabConsumer')}</span><div style={{ display: 'flex', gap: '8px' }}><button className="btn btn-outline btn-sm">{t(lang, 'disclosure.exportExcel')}</button><button className="btn btn-primary btn-sm">{t(lang, 'disclosure.generateReport')}</button></div></div>
        <div className="card-body" style={{ padding: 0 }}><div className="table-wrap"><table><thead><tr><th>Indicator</th><th>Value</th><th>Unit</th><th>Standard</th><th>Coverage</th><th>Verification</th></tr></thead><tbody>{getReportData().map((d, i) => (<tr key={i}><td style={{ fontWeight: 600 }}>{d.indicator}</td><td style={{ fontWeight: 700, color: '#48cae4' }}>{d.value}</td><td>{d.unit}</td><td><span className="badge badge-gray">{d.standard}</span></td><td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="progress-bar" style={{ width: '50px' }}><div className={`progress-bar-fill ${parseInt(d.coverage) >= 95 ? 'green' : parseInt(d.coverage) >= 80 ? 'yellow' : 'red'}`} style={{ width: `${d.coverage}%` }} /></div><span style={{ fontSize: '12px' }}>{d.coverage}</span></div></td><td><span className={`badge ${d.verified ? 'badge-green' : 'badge-yellow'}`}>{d.verified ? t(lang, 'disclosure.verifiedBadge') : t(lang, 'disclosure.pendingBadge')}</span></td></tr>))}</tbody></table></div></div>
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">{t(lang, 'disclosure.summary')}</span><button className="btn btn-primary">{t(lang, 'disclosure.genPackage')}</button></div>
        <div className="card-body">
          <div className="detail-grid">
            <div className="detail-item"><div className="detail-label">{t(lang, 'disclosure.period')}</div><div className="detail-value">{t(lang, 'disclosure.periodVal')}</div></div>
            <div className="detail-item"><div className="detail-label">{t(lang, 'disclosure.framework')}</div><div className="detail-value">{t(lang, 'disclosure.frameworkVal')}</div></div>
            <div className="detail-item"><div className="detail-label">{t(lang, 'disclosure.coverage2')}</div><div className="detail-value">Tier 1-3, {suppliers.length} suppliers</div></div>
            <div className="detail-item"><div className="detail-label">{t(lang, 'disclosure.mainSource')}</div><div className="detail-value">{t(lang, 'disclosure.mainSourceVal')} ({(suppliers.filter(s => s.tier === 'Tier 2').reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0) / suppliers.reduce((a, b) => a + b.carbonScope1 + b.carbonScope2 + b.carbonScope3, 0) * 100).toFixed(0)}%)</div></div>
            <div className="detail-item"><div className="detail-label">{t(lang, 'disclosure.target')}</div><div className="detail-value">{t(lang, 'disclosure.targetVal')}</div></div>
            <div className="detail-item"><div className="detail-label">{t(lang, 'disclosure.nextDisclosure')}</div><div className="detail-value">{t(lang, 'disclosure.nextDisclosureVal')}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
