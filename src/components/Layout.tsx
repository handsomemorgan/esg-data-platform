import { NavLink, useLocation } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { t } from '../i18n';

const navKeys = [
  { section: 'nav.overview', items: [{ path: '/', label: 'nav.dashboard' }] },
  { section: 'nav.supplyChain', items: [
    { path: '/supply-chain', label: 'nav.supplyChainMap' },
    { path: '/suppliers', label: 'nav.supplierProfiles', badge: 10 },
  ]},
  { section: 'nav.dataChain', items: [
    { path: '/carbon', label: 'nav.carbonDashboard' },
    { path: '/environmental', label: 'nav.envPerformance' },
  ]},
  { section: 'nav.monitor', items: [
    { path: '/risk-heatmap', label: 'nav.riskHeatmap', badge: 3 },
    { path: '/cap-tracking', label: 'nav.capTracking', badge: 5 },
  ]},
  { section: 'nav.disclosure', items: [
    { path: '/disclosure', label: 'nav.disclosureOutput' },
  ]},
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { lang, toggleLang } = useLang();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return t(lang, 'nav.dashboard');
    for (const group of navKeys) {
      for (const item of group.items) {
        if (item.path === path) return t(lang, item.label);
      }
    }
    return '';
  };

  const today = new Date().toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <div className="sidebar-logo-text">{t(lang, 'app.title')}</div>
            <div className="sidebar-logo-sub">{t(lang, 'app.subtitle')}</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navKeys.map((group) => (
            <div key={group.section}>
              <div className="sidebar-section">{t(lang, group.section)}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `sidebar-item${isActive ? ' active' : ''}`
                  }
                >
                  <span>{t(lang, item.label)}</span>
                  {item.badge && (
                    <span className="sidebar-item-badge">{item.badge}</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          {t(lang, 'app.footer')}
        </div>
      </aside>

      {/* Main Area */}
      <div style={{ flex: 1 }}>
        {/* Header */}
        <header className="header">
          <div className="header-breadcrumb">
            {t(lang, 'breadcrumb.prefix')} / <span>{getBreadcrumb()}</span>
          </div>
          <div className="header-right">
            <button
              className="btn btn-outline btn-sm"
              onClick={toggleLang}
              style={{ fontWeight: 700, letterSpacing: '0.5px' }}
            >
              {lang === 'zh' ? 'EN' : '中文'}
            </button>
            <span className="header-date">{today}</span>
            <div className="header-avatar">A</div>
          </div>
        </header>

        {/* Content */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
