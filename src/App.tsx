import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SupplyChain from './pages/SupplyChain';
import Suppliers from './pages/Suppliers';
import CarbonDashboard from './pages/CarbonDashboard';
import EnvironmentalPerformance from './pages/EnvironmentalPerformance';
import RiskHeatmap from './pages/RiskHeatmap';
import CAPTracking from './pages/CAPTracking';
import DisclosureOutput from './pages/DisclosureOutput';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/supply-chain" element={<SupplyChain />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/carbon" element={<CarbonDashboard />} />
          <Route path="/environmental" element={<EnvironmentalPerformance />} />
          <Route path="/risk-heatmap" element={<RiskHeatmap />} />
          <Route path="/cap-tracking" element={<CAPTracking />} />
          <Route path="/disclosure" element={<DisclosureOutput />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
