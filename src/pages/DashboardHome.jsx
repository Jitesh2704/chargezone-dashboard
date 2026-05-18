import React from 'react';
import { Tabs, Card, Statistic, Table, Tag, Progress } from 'antd';
import { useLocation } from 'react-router-dom';
import { 
  CameraOutlined, 
  WarningOutlined, 
  SafetyCertificateOutlined,
  StopOutlined,
  EyeInvisibleOutlined,
  CarOutlined,
  ClockCircleOutlined,
  SoundOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  FireOutlined,
  DeleteOutlined,
  BulbOutlined
} from '@ant-design/icons';

// Mapping categories to their specific use case tabs
const categoryTabs = {
  '/': [
    {
      key: 'overview',
      label: 'System Overview',
      icon: <SafetyCertificateOutlined />,
      content: <OverviewContent />
    }
  ],
  '/detections': [
    { key: 'cam-deviation', label: 'Camera Deviation', icon: <CameraOutlined />, content: <DummyTabContent title="Camera Position Deviation" /> },
    { key: 'unauth-presence', label: 'Unauthorized Presence', icon: <StopOutlined />, content: <DummyTabContent title="Unauthorized Human Presence" /> },
    { key: 'fence-breach', label: 'Fence Breach', icon: <WarningOutlined />, content: <DummyTabContent title="Switchyard Fence Breach" /> },
    { key: 'cam-tampering', label: 'Camera Tampering', icon: <EyeInvisibleOutlined />, content: <DummyTabContent title="Camera Tampering & Loitering" /> },
    { key: 'cam-off', label: 'Camera Offline (>10m)', icon: <StopOutlined />, content: <DummyTabContent title="Camera Off for > 10 Mins" /> },
  ],
  '/vehicles': [
    { key: 'veh-verification', label: 'Vehicle Verification', icon: <CarOutlined />, content: <DummyTabContent title="Vehicle Movement & Type Verification" /> },
    { key: 'ev-id', label: 'EV vs Non-EV', icon: <ThunderboltOutlined />, content: <DummyTabContent title="EV & Non-EV Identification" /> },
    { key: 'voice-alert', label: 'Voice Alerts', icon: <SoundOutlined />, content: <DummyTabContent title="Voice Alert for Unauthorized Parking" /> },
    { key: 'overstay', label: 'Overstay Detection', icon: <ClockCircleOutlined />, content: <DummyTabContent title="Overstay Beyond Allowed Time" /> },
    { key: 'parking-visibility', label: 'Marking Visibility', icon: <EyeInvisibleOutlined />, content: <DummyTabContent title="EV Parking Marking Visibility" /> },
  ],
  '/operations': [
    { key: 'gun-boot', label: 'Gun Not in Boot', icon: <ToolOutlined />, content: <DummyTabContent title="Charging Gun Not Placed in Boot" /> },
    { key: 'sop-violation', label: 'SOP Violation', icon: <WarningOutlined />, content: <DummyTabContent title="SOP Violation During Charging" /> },
    { key: 'gun-cut', label: 'Sharp Object / Gun Cut', icon: <ToolOutlined />, content: <DummyTabContent title="Cutting of Charging Gun / Sharp Object" /> },
    { key: 'gun-twice', label: 'Multiple Gun Insertions', icon: <ToolOutlined />, content: <DummyTabContent title="Putting the Gun Twice or Thrice" /> },
  ],
  '/environment': [
    { key: 'fire-smoke', label: 'Fire & Smoke', icon: <FireOutlined />, content: <DummyTabContent title="Fire & Smoke Detection" /> },
    { key: 'smoking', label: 'Smoking / Spitting', icon: <StopOutlined />, content: <DummyTabContent title="Smoking & Spitting Detection" /> },
    { key: 'animal', label: 'Animal Movement', icon: <WarningOutlined />, content: <DummyTabContent title="Cattle / Animal Movement" /> },
    { key: 'garbage', label: 'Garbage & Debris', icon: <DeleteOutlined />, content: <DummyTabContent title="Garbage & Debris Detection" /> },
    { key: 'water', label: 'Water Logging', icon: <WarningOutlined />, content: <DummyTabContent title="Water Logging Detection" /> },
    { key: 'lighting', label: 'Canopy Lighting', icon: <BulbOutlined />, content: <DummyTabContent title="Canopy Lighting Monitoring (8 PM - 4 AM)" /> },
  ],
};

const getCategoryTitle = (path) => {
  if (path === '/') return 'Station Overview';
  if (path.startsWith('/detections')) return 'Detection & Security Intelligence';
  if (path.startsWith('/vehicles')) return 'Parking & Vehicle Analytics';
  if (path.startsWith('/operations')) return 'Charger Operations Monitoring';
  if (path.startsWith('/environment')) return 'Environment & Infrastructure';
  return 'Dashboard';
};

function DummyTabContent({ title }) {
  return (
    <div className="animate-fadeIn mt-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
          <CameraOutlined className="text-3xl text-[#1e2d5b]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-500 max-w-lg text-center mb-8">
          This panel displays real-time video feeds, AI inference logs, and active alerts specifically related to {title.toLowerCase()}.
        </p>
        
        {/* Mock Data Visuals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col items-center">
            <span className="text-sm font-semibold text-gray-500 mb-2">Today's Alerts</span>
            <span className="text-3xl font-extrabold text-[#1e2d5b]">12</span>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col items-center">
            <span className="text-sm font-semibold text-gray-500 mb-2">Detection Accuracy</span>
            <Progress type="circle" percent={98} strokeColor="#1e2d5b" size={60} />
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col items-center">
            <span className="text-sm font-semibold text-gray-500 mb-2">Status</span>
            <Tag color="success" className="px-4 py-1 text-sm mt-2 rounded-full font-bold">MONITORING ACTIVE</Tag>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewContent() {
  const recentAlerts = [
    { key: '1', time: '10:42 AM', type: 'Camera Tampering', location: 'Cam-04 (Entrance)', status: 'Active', severity: 'High' },
    { key: '2', time: '10:15 AM', type: 'Non-EV in EV Parking', location: 'Slot 3', status: 'Resolved', severity: 'Medium' },
    { key: '3', time: '09:30 AM', type: 'Garbage & Debris', location: 'Cam-01', status: 'Active', severity: 'Low' },
  ];

  const columns = [
    { title: 'Time', dataIndex: 'time', key: 'time' },
    { title: 'Incident Type', dataIndex: 'type', key: 'type', className: 'font-medium' },
    { title: 'Location', dataIndex: 'location', key: 'location', className: 'text-gray-500' },
    { 
      title: 'Severity', 
      key: 'severity', 
      render: (_, record) => {
        const colors = { High: 'volcano', Medium: 'orange', Low: 'green' };
        return <Tag color={colors[record.severity]} className="rounded-full px-3 font-semibold">{record.severity.toUpperCase()}</Tag>;
      } 
    },
    { 
      title: 'Status', 
      key: 'status', 
      render: (_, record) => (
        <span className={`px-2 py-1 rounded-md text-xs font-bold ${record.status === 'Active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {record.status}
        </span>
      ) 
    },
  ];

  return (
    <div className="animate-fadeIn mt-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <Statistic title={<span className="text-gray-500 font-medium">Active Alerts</span>} value={3} valueStyle={{ color: '#cf1322', fontWeight: 'bold' }} prefix={<WarningOutlined />} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <Statistic title={<span className="text-gray-500 font-medium">Vehicles Logged</span>} value={45} prefix={<CarOutlined className="text-blue-500" />} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <Statistic title={<span className="text-gray-500 font-medium">SOP Violations</span>} value={2} valueStyle={{ color: '#faad14' }} prefix={<SafetyCertificateOutlined />} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <Statistic title={<span className="text-gray-500 font-medium">Active Cameras</span>} value={12} suffix="/ 12" valueStyle={{ color: '#3f8600' }} prefix={<CameraOutlined />} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Recent Incident Logs</h3>
          <button className="text-sm font-semibold text-[#1e2d5b] hover:underline">View All</button>
        </div>
        <Table columns={columns} dataSource={recentAlerts} pagination={false} className="custom-table" />
      </div>
    </div>
  );
}

const DashboardHome = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Find which key matches the path, default to '/'
  const activeTabs = categoryTabs[currentPath] || categoryTabs['/'];
  const title = getCategoryTitle(currentPath);

  const tabItems = activeTabs.map((tab) => ({
    label: (
      <span className="flex items-center gap-2 font-medium px-2 py-1 text-[15px]">
        {tab.icon}
        {tab.label}
      </span>
    ),
    key: tab.key,
    children: tab.content,
  }));

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e2d5b] tracking-tight">{title}</h1>
          <p className="text-gray-500 mt-2 text-sm">Real-time monitoring and analytics dashboard.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-bold text-gray-700">System Online</span>
        </div>
      </div>

      {activeTabs.length > 1 ? (
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
          <Tabs 
            defaultActiveKey={activeTabs[0].key} 
            items={tabItems}
            className="modern-tabs"
            tabBarStyle={{ marginBottom: 0, padding: '0 16px', borderBottom: '1px solid #f3f4f6' }}
          />
        </div>
      ) : (
        activeTabs[0].content
      )}
    </div>
  );
};

export default DashboardHome;
