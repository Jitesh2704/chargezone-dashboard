import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Timeline, Typography, Tag, Statistic } from 'antd';
import { CarOutlined, ClockCircleOutlined, CameraOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Car, ScanSearch, ShieldCheck } from 'lucide-react';

const { Title, Text } = Typography;

const VehicleTrail = () => {
  const [searchParams] = useSearchParams();
  const regNumber = searchParams.get('reg') || 'UNKNOWN';

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1e2d5b] tracking-tight">Vehicle Trail & Analytics</h1>
            <p className="text-gray-500 mt-2 text-sm">Detailed tracking and compliance report for vehicle registration.</p>
          </div>
          <div className="bg-white border border-gray-200 px-6 py-3 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
               <Car className="text-[#1e2d5b] w-6 h-6" />
            </div>
            <div>
              <Text type="secondary" className="text-xs uppercase tracking-wider font-bold">Registration Number</Text>
              <Title level={3} style={{ margin: 0, color: '#1e2d5b' }}>{regNumber.toUpperCase()}</Title>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-sm border-gray-100 rounded-2xl">
            <Statistic 
              title={<span className="font-semibold text-gray-500">Vehicle Type Verification</span>}
              value="Verified EV" 
              prefix={<CheckCircleOutlined className="text-green-500" />} 
              valueStyle={{ color: '#16a34a', fontWeight: 'bold' }}
            />
          </Card>
          <Card className="shadow-sm border-gray-100 rounded-2xl">
            <Statistic 
              title={<span className="font-semibold text-gray-500">Total Duration in Station</span>}
              value="45 mins" 
              prefix={<ClockCircleOutlined className="text-[#1e2d5b]" />} 
            />
          </Card>
          <Card className="shadow-sm border-gray-100 rounded-2xl">
            <Statistic 
              title={<span className="font-semibold text-gray-500">Compliance Status</span>}
              value="1 Violation" 
              prefix={<ShieldCheck className="text-orange-500 inline-block mr-2" />} 
              valueStyle={{ color: '#f97316', fontWeight: 'bold' }}
            />
          </Card>
        </div>

        <Card title={<span className="font-bold text-lg"><ScanSearch className="inline-block mr-2 w-5 h-5" /> Activity Timeline</span>} className="shadow-sm border-gray-100 rounded-2xl">
          <Timeline
            mode="left"
            items={[
              {
                label: '09:00 AM',
                children: (
                  <div>
                    <Text strong className="text-gray-800 text-base">Vehicle Entered Station</Text>
                    <br />
                    <Text type="secondary">Detected by Entrance Cam-01. ANPR successfully read plate {regNumber.toUpperCase()}.</Text>
                  </div>
                ),
                dot: <CameraOutlined className="text-blue-500 text-xl" />,
              },
              {
                label: '09:05 AM',
                children: (
                  <div>
                    <Text strong className="text-gray-800 text-base">Parked at Slot 4</Text>
                    <br />
                    <Tag color="green" className="mt-1">EV Verified</Tag>
                  </div>
                ),
                color: 'green',
              },
              {
                label: '09:10 AM',
                children: (
                  <div>
                    <Text strong className="text-red-600 text-base">SOP Violation: Gun Not Placed Correctly</Text>
                    <br />
                    <Text type="secondary">Detected by Charger Cam-04. Alert generated.</Text>
                  </div>
                ),
                color: 'red',
              },
              {
                label: '09:45 AM',
                children: (
                  <div>
                    <Text strong className="text-gray-800 text-base">Vehicle Exited Station</Text>
                    <br />
                    <Text type="secondary">Detected by Exit Cam-02.</Text>
                  </div>
                ),
                color: 'gray',
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

export default VehicleTrail;
