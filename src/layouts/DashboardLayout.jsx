import React, { useState, useEffect } from 'react';
import { Dropdown, Badge, Drawer, Select, Button, Input } from 'antd';
import {
  Menu,
  Bell,
  LayoutDashboard,
  ShieldAlert,
  CarFront,
  Zap,
  Sprout,
  Settings,
  LogOut,
  Search,
  MonitorCheck,
  BarChart2
} from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import hyperviseLogo from '../assets/hypervise.png';
import chargezoneLogo from '../assets/chargezone.png';
import { WarningOutlined } from '@ant-design/icons';

const menuItems = [
  { key: '/', icon: <LayoutDashboard strokeWidth={2.5} size={22} />, label: 'Overview' },
  { key: '/detections', icon: <ShieldAlert strokeWidth={2.5} size={22} />, label: 'Detection & Security' },
  { key: '/vehicles', icon: <CarFront strokeWidth={2.5} size={22} />, label: 'Parking & Vehicles' },
  { key: '/operations', icon: <Zap strokeWidth={2.5} size={22} />, label: 'Charger Monitoring' },
  { key: '/environment', icon: <MonitorCheck strokeWidth={2.5} size={22} />, label: 'Safety Operations' },
  { key: '/analytics', icon: <BarChart2 strokeWidth={2.5} size={22} />, label: 'Analytics' },
  { key: '/settings', icon: <Settings strokeWidth={2.5} size={22} />, label: 'Settings' },
];

const mockNotifications = [
  { id: 1, type: 'Alert', text: 'SOP Violation Detected at Charger 4', time: '2 mins ago', unread: true },
  { id: 2, type: 'System', text: 'Camera 02 Offline', time: '15 mins ago', unread: true },
  { id: 3, type: 'Info', text: 'Vehicle MH12AB1234 Overstaying', time: '1 hour ago', unread: false },
  { id: 4, type: 'Alert', text: 'Fire & Smoke detected near PDB', time: '2 hours ago', unread: false },
];

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [searchVal, setSearchVal] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const day = now.getDate();

      const getDaySuffix = (d) => {
        if (d > 3 && d < 21) return "th";
        switch (d % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      };

      const formattedDate = now.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const [datePart] = formattedDate.split(" ");
      const restDate = formattedDate.replace(datePart, "");

      setCurrentTime(
        `${day}${getDaySuffix(day)}${restDate}, ${formattedTime}`
      );
    };

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const onSearch = (value) => {
    if (value.trim()) {
      window.open(`/vehicle-trail?reg=${encodeURIComponent(value.trim())}`, '_blank');
      setSearchVal('');
    }
  };


  return (
    <div className="flex flex-col h-screen bg-[#f3f4f6] overflow-hidden">

      {/* NAVBAR */}
      <header className="h-16 bg-white border-b-2 border-gray-200 flex items-center justify-between pl-3 pr-8 z-30 w-full shrink-0">

        {/* Navbar Left */}
        <div className="flex flex-row justify-center items-center gap-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 cursor-pointer rounded-lg text-gray-600 hover:bg-[#f9f9f9] transition-colors focus:outline-none"
          >
            <Menu size={26} strokeWidth={2} />
          </button>

          <img
            src={hyperviseLogo}
            alt="Hypervise"
            className="h-10 object-contain cursor-pointer"
            onClick={() => navigate("/")}
          />

          <div className="hidden md:flex ml-2">
            <div className="relative w-[250px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Search Vehicle No..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSearch(e.target.value);
                  }
                }}
                className="w-full rounded-md h-11 bg-[#f9f9f9] border border-gray-200 py-2 pl-10 pr-4 outline-none font-medium placeholder:font-normal"
              />
            </div>
          </div>
        </div>

        {/* Navbar Right */}
        <div className="flex items-center gap-4">
          <img src={chargezoneLogo} alt="ChargeZone" className="h-8 object-contain hidden sm:block" />

          <div className="h-8 border-l-2 border-gray-300 hidden sm:block"></div>

          <div className='flex flex-col justify-start items-start leading-6'>
            <div className="font-semibold text-sm tracking-tighter text-gray-700 hidden md:block">
              Charge Zone Admin User
            </div>
            <div className="text-gray-400 tracking-tighter hidden md:block  text-xs font-medium">
              adminuser@chargezone.com
            </div>
          </div>

          <div className="h-8 border-l-2 border-gray-300 hidden sm:block -mr-3"></div>

          <Badge count="99+" offset={[-2, 4]} color="#ef4444" className="cursor-pointer" onClick={() => setDrawerVisible(true)}>
            <div className="p-2 rounded-full hover:bg-[#f9f9f9] transition-colors">
              <Bell size={24} strokeWidth={2} className="text-gray-700" />
            </div>
          </Badge>
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Sidebar */}
        <aside
          className={`bg-white border-r-2 border-gray-200 transition-all duration-300 ease-in-out flex flex-col shrink-0 ${collapsed ? 'w-16' : 'w-[250px]'
            } z-20`}
        >
          <nav className="flex-1 overflow-y-auto py-2.5">
            <ul className="space-y-2 px-2.5">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.key || (item.key !== '/' && location.pathname.startsWith(item.key));
                return (
                  <li key={item.key}>
                    <button
                      onClick={() => navigate(item.key)}
                      className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'justify-start px-4'} tracking-tight cursor-pointer py-3 rounded-xl transition-all duration-200 group font-medium ${isActive
                        ? 'bg-[#1e2d5b] text-white shadow-md'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-[#1e2d5b]'
                        }`}
                    >
                      <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#1e2d5b] transition-all duration-200'}`}>
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className="ml-3.5 text-[16px] truncate">{item.label}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className='flex flex-col items-center justify-center gap-6 w-full'>
            {collapsed ? (
              <div
                title={collapsed ? "Online" : "Offline"}
                className="relative flex items-center cursor-pointer justify-center w-5 h-5 "
              >
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${collapsed ? "bg-green-400" : "bg-red-400"
                    }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${collapsed ? "bg-green-500" : "bg-red-500"
                    }`}
                ></span>
              </div>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                <div className='w-full px-4 animate-fadeIn'>
                  <div className='bg-gray-50 rounded-lg border border-gray-200 p-3 grid grid-cols-1 gap-3'>
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <div className="text-gray-500 font-medium text-xs ">
                        Charge Station Name:
                      </div>
                      <div className="text-sm font-bold tracking uppercase leading-4">
                        Charge Zone India Ltd
                      </div>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <div className="text-gray-500 font-medium text-xs ">
                        Location:
                      </div>
                      <div className="text-sm font-bold text-black uppercase leading-4">
                        Bangalore
                      </div>
                    </div>
                    <div className={`flex flex-col justify-start items-start gap-0.5`}>
                      <div className="text-gray-800 font-medium text-xs ">
                        Station Status:
                      </div>
                      <div
                        className={`text-sm font-bold  ${!collapsed ? "text-green-500" : "text-red-600"
                          } tracking leading-4 `}
                      >
                        {!collapsed ? "ONLINE" : "OFFLINE"}
                      </div>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <div className="text-gray-500 font-medium text-xs ">
                        Last Updated on:
                      </div>
                      <div className="text-sm font-semibold text-black leading-4">
                        {currentTime}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div
              className={`w-full border-t border-gray-300 py-3 flex flex-col justify-center items-center  bg-[#f9f9f9] transition-all duration-200`}
            >
              <button
                title="Sign Out"
                onClick={() => { }}
                className={`${collapsed ? "" : "mr-7"} inline-flex items-center justify-center gap-2 cursor-pointer text-[#FF5630] hover:text-[#e04826] transition-colors duration-200`}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.314 8.063 20.25 12l-3.936 3.938M9.75 12h10.497M9.75 20.25H4.5a.75.75 0 0 1-.75-.75v-15a.75.75 0 0 1 .75-.75h5.25"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {!collapsed && (
                  <div
                    className="
        transform
        transition-all
        ease-out
        translate-x-0
        opacity-100
        animate-slideIn
        font-medium text-[#FF5630] hover:text-[#e04826] text-lg tracking-tighter
      "
                  >
                    Sign Out
                  </div>
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f9f9f9] p-6">
          <Outlet />
        </main>
      </div>

      {/* Notifications Drawer */}
      <Drawer
        title={<span className="text-xl font-bold text-[#1e2d5b] flex items-center gap-2"><Bell className="text-red-500" /> Notifications</span>}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={400}
        extra={
          <Button type="link" className="font-bold text-blue-600 hover:text-blue-800 p-0">
            Mark all as read
          </Button>
        }
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="font-bold text-gray-600">Filter by Type:</span>
          <Select
            defaultValue="all"
            style={{ width: 150 }}
            options={[
              { value: 'all', label: 'All Notifications' },
              { value: 'alert', label: 'Alerts' },
              { value: 'system', label: 'System' },
            ]}
          />
        </div>

        <div className="space-y-3">
          {mockNotifications.map(notif => (
            <div key={notif.id} className={`p-4 rounded-xl border ${notif.unread ? 'bg-blue-50 border-blue-100' : 'bg-white border-[#f9f9f9]'} shadow-sm relative`}>
              {notif.unread && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500"></div>}
              <div className="font-bold text-gray-800 mb-1 pr-6">{notif.text}</div>
              <div className="flex justify-between items-center mt-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${notif.type === 'Alert' ? 'bg-red-100 text-red-700' : notif.type === 'System' ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 text-gray-700'}`}>
                  {notif.type}
                </span>
                <span className="text-xs font-semibold text-gray-400">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button type="dashed" className="w-full font-bold text-gray-500 h-10 border-gray-300">
            Load More Notifications
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default DashboardLayout;
