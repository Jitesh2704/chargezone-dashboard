import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import VehicleTrail from './pages/VehicleTrail';
import Overview from './pages/Overview';
import Operations from './pages/Operations';
import Detections from './pages/Detections';
import Environment from './pages/Environment';
import Vehicles from './pages/Vehicles';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import './index.css';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1e2d5b',
          colorBgBase: '#ffffff',
          colorTextBase: '#333333',
          borderRadius: 6,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        },
        components: {
          Layout: {
            bodyBg: '#e6e6e6',
            headerBg: '#ffffff',
          },
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/vehicle-trail" element={<VehicleTrail />} />
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="operations" element={<Operations />} />
            <Route path="detections" element={<Detections />} />
            <Route path="environment" element={<Environment />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="settings" element={<Settings />} />
            <Route path="analytics" element={<Analytics />} />
            {/* Fallback to Overview */}
            <Route path="*" element={<Overview />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
