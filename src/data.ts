// ========== Mock Data for ESG Supply Chain Monitoring Platform ==========

export interface Supplier {
  id: string;
  name: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  category: string;
  location: string;
  esgRating: 'A' | 'B' | 'C' | 'D';
  riskLevel: 'low' | 'medium' | 'high';
  carbonScope1: number; // tCO2e
  carbonScope2: number; // tCO2e
  carbonScope3: number; // tCO2e estimated
  waterUse: number; // m3
  energyUse: number; // MWh
  wasteWater: number; // m3
  solidWaste: number; // tons
  chemicalUse: number; // tons
  certifications: string[];
  lastAudit: string;
  auditScore: number;
  capCount: number;
  capCompleted: number;
  capOverdue: number;
  penalties: number;
  mediaRisk: 'none' | 'low' | 'medium' | 'high';
}

export const suppliers: Supplier[] = [
  {
    id: 'S001', name: '恒达纺织有限公司', tier: 'Tier 1', category: '成衣制造',
    location: '浙江绍兴', esgRating: 'B', riskLevel: 'medium',
    carbonScope1: 12500, carbonScope2: 8400, carbonScope3: 32000,
    waterUse: 180000, energyUse: 24000, wasteWater: 145000, solidWaste: 320,
    chemicalUse: 45, certifications: ['ISO 14001', 'OEKO-TEX Standard 100', 'Higg Index'],
    lastAudit: '2026-03-15', auditScore: 78, capCount: 12, capCompleted: 8, capOverdue: 2,
    penalties: 1, mediaRisk: 'low',
  },
  {
    id: 'S002', name: '鑫源服装集团', tier: 'Tier 1', category: '成衣制造',
    location: '广东东莞', esgRating: 'C', riskLevel: 'high',
    carbonScope1: 18500, carbonScope2: 11200, carbonScope3: 45000,
    waterUse: 250000, energyUse: 32000, wasteWater: 210000, solidWaste: 480,
    chemicalUse: 68, certifications: ['ISO 9001'],
    lastAudit: '2026-02-20', auditScore: 55, capCount: 25, capCompleted: 12, capOverdue: 8,
    penalties: 3, mediaRisk: 'high',
  },
  {
    id: 'S003', name: '绿色纺织科技', tier: 'Tier 1', category: '成衣制造',
    location: '江苏苏州', esgRating: 'A', riskLevel: 'low',
    carbonScope1: 8200, carbonScope2: 5600, carbonScope3: 21000,
    waterUse: 120000, energyUse: 15800, wasteWater: 95000, solidWaste: 180,
    chemicalUse: 28, certifications: ['ISO 14001', 'ISO 50001', 'OEKO-TEX Standard 100', 'Bluesign', 'Higg Index'],
    lastAudit: '2026-04-10', auditScore: 92, capCount: 3, capCompleted: 3, capOverdue: 0,
    penalties: 0, mediaRisk: 'none',
  },
  {
    id: 'S004', name: '美达染整工业', tier: 'Tier 2', category: '面料染整',
    location: '福建泉州', esgRating: 'C', riskLevel: 'high',
    carbonScope1: 35000, carbonScope2: 22000, carbonScope3: 68000,
    waterUse: 520000, energyUse: 58000, wasteWater: 480000, solidWaste: 850,
    chemicalUse: 320, certifications: [],
    lastAudit: '2026-01-05', auditScore: 42, capCount: 35, capCompleted: 15, capOverdue: 12,
    penalties: 6, mediaRisk: 'high',
  },
  {
    id: 'S005', name: '华丰纺织印染', tier: 'Tier 2', category: '面料染整',
    location: '浙江杭州', esgRating: 'B', riskLevel: 'medium',
    carbonScope1: 28000, carbonScope2: 18000, carbonScope3: 55000,
    waterUse: 420000, energyUse: 46000, wasteWater: 380000, solidWaste: 620,
    chemicalUse: 250, certifications: ['ISO 14001', 'ZDHC'],
    lastAudit: '2026-03-28', auditScore: 68, capCount: 18, capCompleted: 10, capOverdue: 4,
    penalties: 2, mediaRisk: 'medium',
  },
  {
    id: 'S006', name: '永新染整有限公司', tier: 'Tier 2', category: '面料染整',
    location: '广东佛山', esgRating: 'A', riskLevel: 'low',
    carbonScope1: 22000, carbonScope2: 14000, carbonScope3: 48000,
    waterUse: 350000, energyUse: 38000, wasteWater: 310000, solidWaste: 480,
    chemicalUse: 180, certifications: ['ISO 14001', 'ISO 50001', 'ZDHC', 'Bluesign'],
    lastAudit: '2026-04-02', auditScore: 88, capCount: 5, capCompleted: 4, capOverdue: 0,
    penalties: 0, mediaRisk: 'none',
  },
  {
    id: 'S007', name: '昌隆棉花供应', tier: 'Tier 3', category: '原材料',
    location: '新疆阿克苏', esgRating: 'B', riskLevel: 'medium',
    carbonScope1: 5500, carbonScope2: 2800, carbonScope3: 18000,
    waterUse: 85000, energyUse: 9200, wasteWater: 12000, solidWaste: 85,
    chemicalUse: 12, certifications: ['BCI', 'GOTS'],
    lastAudit: '2026-02-15', auditScore: 72, capCount: 8, capCompleted: 5, capOverdue: 1,
    penalties: 1, mediaRisk: 'low',
  },
  {
    id: 'S008', name: '顺达物流仓储', tier: 'Tier 3', category: '物流仓储',
    location: '上海', esgRating: 'B', riskLevel: 'low',
    carbonScope1: 8200, carbonScope2: 4500, carbonScope3: 15000,
    waterUse: 12000, energyUse: 15000, wasteWater: 3000, solidWaste: 45,
    chemicalUse: 2, certifications: ['ISO 14001'],
    lastAudit: '2026-04-20', auditScore: 75, capCount: 6, capCompleted: 4, capOverdue: 1,
    penalties: 0, mediaRisk: 'none',
  },
  {
    id: 'S009', name: '瑞丰化纤原料', tier: 'Tier 3', category: '原材料',
    location: '江苏南通', esgRating: 'C', riskLevel: 'high',
    carbonScope1: 12800, carbonScope2: 8200, carbonScope3: 28000,
    waterUse: 65000, energyUse: 22000, wasteWater: 28000, solidWaste: 180,
    chemicalUse: 95, certifications: [],
    lastAudit: '2026-01-20', auditScore: 48, capCount: 20, capCompleted: 8, capOverdue: 7,
    penalties: 4, mediaRisk: 'medium',
  },
  {
    id: 'S010', name: '德盛成衣制造', tier: 'Tier 1', category: '成衣制造',
    location: '山东青岛', esgRating: 'B', riskLevel: 'medium',
    carbonScope1: 10500, carbonScope2: 7200, carbonScope3: 28000,
    waterUse: 155000, energyUse: 20500, wasteWater: 128000, solidWaste: 280,
    chemicalUse: 38, certifications: ['ISO 14001', 'OEKO-TEX Standard 100'],
    lastAudit: '2026-03-08', auditScore: 74, capCount: 10, capCompleted: 7, capOverdue: 2,
    penalties: 1, mediaRisk: 'low',
  },
];

export const monthlyCarbonData = [
  { month: '2025-07', scope1: 124000, scope2: 82000, scope3: 350000 },
  { month: '2025-08', scope1: 128000, scope2: 85000, scope3: 358000 },
  { month: '2025-09', scope1: 126000, scope2: 84000, scope3: 362000 },
  { month: '2025-10', scope1: 131000, scope2: 87000, scope3: 370000 },
  { month: '2025-11', scope1: 129000, scope2: 86000, scope3: 365000 },
  { month: '2025-12', scope1: 135000, scope2: 89000, scope3: 380000 },
  { month: '2026-01', scope1: 132000, scope2: 88000, scope3: 375000 },
  { month: '2026-02', scope1: 128000, scope2: 85000, scope3: 368000 },
  { month: '2026-03', scope1: 125000, scope2: 83000, scope3: 360000 },
  { month: '2026-04', scope1: 122000, scope2: 81000, scope3: 355000 },
  { month: '2026-05', scope1: 119000, scope2: 79000, scope3: 348000 },
  { month: '2026-06', scope1: 116000, scope2: 77000, scope3: 342000 },
];

export const envPerformanceData = [
  { supplier: '恒达纺织', energy: 24000, water: 180, wasteWater: 145, waste: 320, chem: 45 },
  { supplier: '鑫源服装', energy: 32000, water: 250, wasteWater: 210, waste: 480, chem: 68 },
  { supplier: '绿色纺织', energy: 15800, water: 120, wasteWater: 95, waste: 180, chem: 28 },
  { supplier: '美达染整', energy: 58000, water: 520, wasteWater: 480, waste: 850, chem: 320 },
  { supplier: '华丰印染', energy: 46000, water: 420, wasteWater: 380, waste: 620, chem: 250 },
  { supplier: '永新染整', energy: 38000, water: 350, wasteWater: 310, waste: 480, chem: 180 },
  { supplier: '昌隆棉花', energy: 9200, water: 85, wasteWater: 12, waste: 85, chem: 12 },
  { supplier: '顺达物流', energy: 15000, water: 12, wasteWater: 3, waste: 45, chem: 2 },
  { supplier: '瑞丰化纤', energy: 22000, water: 65, wasteWater: 28, waste: 180, chem: 95 },
  { supplier: '德盛成衣', energy: 20500, water: 155, wasteWater: 128, waste: 280, chem: 38 },
];

export interface CAPItem {
  id: string;
  supplierId: string;
  supplierName: string;
  issue: string;
  severity: 'critical' | 'major' | 'minor';
  status: 'pending' | 'in_progress' | 'verified' | 'closed' | 'overdue';
  submitDate: string;
  dueDate: string;
  closeDate?: string;
  verifier: string;
  category: string;
}

export const capItems: CAPItem[] = [
  { id: 'CAP001', supplierId: 'S002', supplierName: '鑫源服装集团', issue: '废水处理系统升级改造', severity: 'critical', status: 'overdue', submitDate: '2026-01-15', dueDate: '2026-05-15', verifier: 'SGS', category: '废水' },
  { id: 'CAP002', supplierId: 'S002', supplierName: '鑫源服装集团', issue: '消防通道堵塞整改', severity: 'major', status: 'in_progress', submitDate: '2026-02-20', dueDate: '2026-06-20', verifier: 'BV', category: '安全' },
  { id: 'CAP003', supplierId: 'S004', supplierName: '美达染整工业', issue: '化学品泄漏应急预案', severity: 'critical', status: 'overdue', submitDate: '2025-12-01', dueDate: '2026-03-01', verifier: 'SGS', category: '化学品' },
  { id: 'CAP004', supplierId: 'S004', supplierName: '美达染整工业', issue: '废气排放超标整改', severity: 'critical', status: 'overdue', submitDate: '2026-01-10', dueDate: '2026-04-10', verifier: 'TUV', category: '废气' },
  { id: 'CAP005', supplierId: 'S001', supplierName: '恒达纺织有限公司', issue: '员工工时记录完善', severity: 'minor', status: 'in_progress', submitDate: '2026-03-15', dueDate: '2026-07-15', verifier: 'BV', category: '劳工' },
  { id: 'CAP006', supplierId: 'S005', supplierName: '华丰纺织印染', issue: '污水管网防渗修复', severity: 'major', status: 'in_progress', submitDate: '2026-02-28', dueDate: '2026-06-28', verifier: 'SGS', category: '废水' },
  { id: 'CAP007', supplierId: 'S009', supplierName: '瑞丰化纤原料', issue: '危废暂存间规范建设', severity: 'major', status: 'overdue', submitDate: '2026-01-05', dueDate: '2026-04-05', verifier: 'TUV', category: '废弃物' },
  { id: 'CAP008', supplierId: 'S006', supplierName: '永新染整有限公司', issue: '能源计量器具校准', severity: 'minor', status: 'verified', submitDate: '2026-02-10', dueDate: '2026-05-10', closeDate: '2026-05-08', verifier: 'SGS', category: '能源' },
  { id: 'CAP009', supplierId: 'S003', supplierName: '绿色纺织科技', issue: '车间通风系统优化', severity: 'minor', status: 'closed', submitDate: '2026-01-20', dueDate: '2026-04-20', closeDate: '2026-04-15', verifier: 'BV', category: '安全' },
  { id: 'CAP010', supplierId: 'S004', supplierName: '美达染整工业', issue: '污泥处置合规整改', severity: 'critical', status: 'pending', submitDate: '2026-04-01', dueDate: '2026-08-01', verifier: 'SGS', category: '废弃物' },
  { id: 'CAP011', supplierId: 'S007', supplierName: '昌隆棉花供应', issue: '农药使用记录完善', severity: 'minor', status: 'in_progress', submitDate: '2026-03-20', dueDate: '2026-07-20', verifier: 'TUV', category: '化学品' },
  { id: 'CAP012', supplierId: 'S001', supplierName: '恒达纺织有限公司', issue: '碳数据核算方法改进', severity: 'minor', status: 'verified', submitDate: '2026-02-01', dueDate: '2026-05-01', closeDate: '2026-04-28', verifier: 'SGS', category: '碳排放' },
];

export const riskHeatmapData = suppliers.map(s => ({
  name: s.name,
  tier: s.tier,
  esgRating: s.esgRating,
  riskLevel: s.riskLevel,
  auditScore: s.auditScore,
  penalties: s.penalties,
  mediaRisk: s.mediaRisk,
  location: s.location,
}));

export interface ESGDisclosureData {
  indicator: string;
  value: string;
  unit: string;
  standard: string;
  coverage: string;
  verified: boolean;
}

export const disclosureData: ESGDisclosureData[] = [
  { indicator: 'Scope 1 温室气体排放', value: '116,000', unit: 'tCO₂e', standard: 'GHG Protocol', coverage: '100%', verified: true },
  { indicator: 'Scope 2 温室气体排放', value: '77,000', unit: 'tCO₂e', standard: 'GHG Protocol', coverage: '100%', verified: true },
  { indicator: 'Scope 3 温室气体排放（估算）', value: '342,000', unit: 'tCO₂e', standard: 'GHG Protocol', coverage: '85%', verified: false },
  { indicator: '总用水量', value: '1,979,000', unit: 'm³', standard: 'GRI 303', coverage: '100%', verified: true },
  { indicator: '废水排放量', value: '1,717,000', unit: 'm³', standard: 'GRI 303', coverage: '100%', verified: true },
  { indicator: '固体废弃物总量', value: '3,528', unit: '吨', standard: 'GRI 306', coverage: '100%', verified: true },
  { indicator: '化学品使用总量', value: '1,038', unit: '吨', standard: 'GRI 301', coverage: '95%', verified: false },
  { indicator: '可再生能源使用比例', value: '18.5', unit: '%', standard: 'GRI 302', coverage: '100%', verified: true },
  { indicator: '供应商通过ESG审核比例', value: '72', unit: '%', standard: 'GRI 414', coverage: '100%', verified: true },
  { indicator: '高风险供应商比例', value: '30', unit: '%', standard: '内部标准', coverage: '100%', verified: true },
  { indicator: 'CAP整改完成率', value: '58', unit: '%', standard: '内部标准', coverage: '100%', verified: true },
  { indicator: '环保处罚累计金额', value: '2,850,000', unit: '元', standard: 'GRI 307', coverage: '100%', verified: true },
];
