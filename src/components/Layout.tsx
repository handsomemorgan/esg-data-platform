import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  {
    section: '总览',
    items: [
      { path: '/', label: '平台总览', icon: '📊' },
    ],
  },
  {
    section: '供应链层',
    items: [
      { path: '/supply-chain', label: '供应链地图', icon: '🔗' },
      { path: '/suppliers', label: '供应商ESG档案', icon: '📋', badge: 10 },
    ],
  },
  {
    section: '数据链层',
    items: [
      { path: '/carbon', label: '碳排放仪表盘', icon: '🏭' },
      { path: '/environmental', label: '环境绩效看板', icon: '🌿' },
    ],
  },
  {
    section: '监测平台层',
    items: [
      { path: '/risk-heatmap', label: '风险热力图', icon: '🔥', badge: 3 },
      { path: '/cap-tracking', label: 'CAP整改追踪', icon: '📝', badge: 5 },
    ],
  },
  {
    section: '披露输出层',
    items: [
      { path: '/disclosure', label: '披露输出模块', icon: '📄' },
    ],
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return '平台总览';
    for (const group of navItems) {
      for (const item of group.items) {
        if (item.path === path) return item.label;
      }
    }
    return '';
  };

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🌱</div>
          <div>
            <div className="sidebar-logo-text">Green Life</div>
            <div className="sidebar-logo-sub">ESG数据监测平台</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((group) => (
            <div key={group.section}>
              <div className="sidebar-section">{group.section}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `sidebar-item${isActive ? ' active' : ''}`
                  }
                >
                  <span className="sidebar-item-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="sidebar-item-badge">{item.badge}</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          © 2026 ABC Fashion · ESG Platform v1.0
        </div>
      </aside>

      {/* Main Area */}
      <div style={{ flex: 1 }}>
        {/* Header */}
        <header className="header">
          <div className="header-breadcrumb">
            ESG数据监测 / <span>{getBreadcrumb()}</span>
          </div>
          <div className="header-right">
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
